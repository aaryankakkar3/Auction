import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startAuctionTimer } from "@/app/utils/auctionTimer";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, bidAmount } = body;

    if (!username || !bidAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Captain username and bid amount are required",
          error: "MISSING_PARAMETERS",
        },
        { status: 400 }
      );
    }

    // Get environment variables
    const BID_INCREMENT = parseInt(
      process.env.NEXT_PUBLIC_BID_INCREMENT || "100"
    );
    const BASE_PRICE = parseInt(process.env.NEXT_PUBLIC_BASE_PRICE || "1000");
    const TIMER_COUNTDOWN = parseInt(
      process.env.NEXT_PUBLIC_TIMER_COUNTDOWN || "30"
    );

    // Use transaction to ensure atomic read-validate-write
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get current auction session with fresh data
      const auctionSession = await tx.auctionSession.findFirst({
        include: {
          currentPlayer: true,
          biddingCaptain: true,
        },
      });

      if (!auctionSession) {
        throw new Error("NO_SESSION_FOUND");
      }

      // 2. Check auction status is ACTIVE
      if (auctionSession.status !== "ACTIVE") {
        throw new Error(
          `INVALID_STATUS:Cannot place bid. Auction status is ${auctionSession.status}, expected ACTIVE`
        );
      }

      // 3. Check current player exists
      if (!auctionSession.currentPlayer) {
        throw new Error(
          "NO_CURRENT_PLAYER:No player is currently being auctioned"
        );
      }

      // 4. Find captain by username
      const captain = await tx.captain.findUnique({
        where: { username: username },
      });

      if (!captain) {
        throw new Error(
          `CAPTAIN_NOT_FOUND:Captain with username '${username}' not found`
        );
      }

      // 5. Bid amount validation
      const currentBid = auctionSession.bidPrice || 0;
      const expectedBid =
        currentBid === 0 ? BASE_PRICE : currentBid + BID_INCREMENT;

      if (bidAmount < expectedBid) {
        throw new Error(
          `BID_TOO_LOW:A bid equal or higher than $${expectedBid} has already been placed`
        );
      }

      if (bidAmount > expectedBid) {
        throw new Error(
          `INVALID_BID:Invalid bid. Expected bid amount is $${expectedBid}`
        );
      }

      // 7. Check if same captain is rebidding
      if (auctionSession.biddingCaptainId === captain.id) {
        throw new Error(
          `SAME_CAPTAIN_REBID:You have already placed the current highest bid`
        );
      }

      // 8. Check captain has enough budget
      if (captain.remainingBudget < bidAmount) {
        throw new Error(
          `INSUFFICIENT_BUDGET:Insufficient budget. Required: $${bidAmount}, Available: $${captain.remainingBudget}`
        );
      }

      // 9. Update auction session with new bid
      const updatedSession = await tx.auctionSession.update({
        where: { id: auctionSession.id },
        data: {
          bidPrice: bidAmount,
          biddingCaptainId: captain.id,
          lastBidAt: new Date(),
        },
        include: {
          currentPlayer: true,
          biddingCaptain: true,
        },
      });

      return { updatedSession, captain };
    });

    console.log(
      `Bid placed: ${username} bid $${bidAmount} for ${result.updatedSession.currentPlayer?.name}`
    );

    // Emit Socket.IO event for real-time updates
    const globalThis_ = globalThis as any;
    const io = globalThis_.__socketIO;

    if (io) {
      // Emit auction session update to clients
      io.emit("auctionSessionUpdate", {
        id: result.updatedSession.id,
        status: result.updatedSession.status,
        currentPlayer: result.updatedSession.currentPlayer,
        bidPrice: result.updatedSession.bidPrice,
        biddingCaptain: result.updatedSession.biddingCaptain,
        currentPlayerId: result.updatedSession.currentPlayerId,
        lastBidAt: result.updatedSession.lastBidAt,
        biddingCaptainId: result.updatedSession.biddingCaptainId,
        changeType: "NEW_BID",
        timestamp: new Date().toISOString(),
      });

      // Start auction timer with auto-completion
      startAuctionTimer(io);
    }
    return NextResponse.json({
      success: true,
      message: `Bid of $${bidAmount} placed successfully by ${username}`,
      data: {
        auctionSession: result.updatedSession,
        bidAmount,
        captain: result.captain,
      },
    });
  } catch (error) {
    console.error("Error placing bid:", error);

    // Handle custom errors with specific error codes
    if (error instanceof Error && error.message.includes(":")) {
      const [errorCode, message] = error.message.split(":", 2);
      return NextResponse.json(
        {
          success: false,
          message: message || "Failed to place bid",
          error: errorCode,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to place bid",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
