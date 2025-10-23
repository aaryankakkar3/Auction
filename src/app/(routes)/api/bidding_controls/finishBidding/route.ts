import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { stopAuctionTimer } from "@/app/utils/auctionTimer";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current auction session with all related data
    const auctionSession = await prisma.auctionSession.findFirst({
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    if (!auctionSession) {
      return NextResponse.json(
        {
          success: false,
          message: "No auction session found",
          error: "NO_SESSION_FOUND",
        },
        { status: 404 }
      );
    }

    // Check if the session is in COMPLETED_APPROVAL_PENDING status
    if (auctionSession.status !== "COMPLETED_APPROVAL_PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot finish bidding. Session status is ${auctionSession.status}, expected COMPLETED_APPROVAL_PENDING`,
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    if (!auctionSession.currentPlayer) {
      return NextResponse.json(
        {
          success: false,
          message: "No current player found in auction session",
          error: "NO_CURRENT_PLAYER",
        },
        { status: 400 }
      );
    }

    // Check if there are bids (bidPrice AND biddingCaptain exist)
    const hasBids = auctionSession.bidPrice && auctionSession.biddingCaptain;

    if (hasBids) {
      // There are bids - process sale
      const bidPrice = auctionSession.bidPrice!;
      const biddingCaptain = auctionSession.biddingCaptain!;

      // Check if captain has enough budget
      if (biddingCaptain.remainingBudget < bidPrice) {
        return NextResponse.json(
          {
            success: false,
            message: `Captain ${biddingCaptain.name} has insufficient budget. Required: ${bidPrice}, Available: ${biddingCaptain.remainingBudget}`,
            error: "INSUFFICIENT_BUDGET",
          },
          { status: 400 }
        );
      }

      // Use transaction to ensure all updates succeed together
      const result = await prisma.$transaction(async (tx) => {
        // Update captain's budget
        const updatedCaptain = await tx.captain.update({
          where: { id: biddingCaptain.id },
          data: {
            remainingBudget: biddingCaptain.remainingBudget - bidPrice,
          },
        });

        // Update player as SOLD
        const updatedPlayer = await tx.player.update({
          where: { id: auctionSession.currentPlayer!.id },
          data: {
            currentState: "SOLD",
            soldPrice: bidPrice,
            soldToCaptainId: biddingCaptain.id,
          },
        });

        // Update auction session to COMPLETED
        const updatedSession = await tx.auctionSession.update({
          where: { id: auctionSession.id },
          data: {
            status: "COMPLETED",
          },
          include: {
            currentPlayer: true,
            biddingCaptain: true,
          },
        });

        return { updatedCaptain, updatedPlayer, updatedSession };
      });

      console.log(
        `Player ${auctionSession.currentPlayer.name} SOLD to ${biddingCaptain.name} for ${bidPrice}`
      );

      // Emit Socket.IO events for real-time updates
      const globalThis_ = globalThis as any;
      const io = globalThis_.__socketIO;
      if (io) {
        // Stop the auction timer
        stopAuctionTimer(io);

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
          changeType: "PLAYER_SOLD",
          timestamp: new Date().toISOString(),
        });

        // Note: playerUpdate emission removed to prevent duplicate toasts
      }

      return NextResponse.json({
        success: true,
        message: `Player ${auctionSession.currentPlayer.name} sold to ${biddingCaptain.name} for ${bidPrice}`,
        data: result.updatedSession,
        saleDetails: {
          player: result.updatedPlayer,
          captain: result.updatedCaptain,
          salePrice: bidPrice,
        },
      });
    } else {
      // No bids - mark player as UNSOLD
      const result = await prisma.$transaction(async (tx) => {
        // Update player as UNSOLD
        const updatedPlayer = await tx.player.update({
          where: { id: auctionSession.currentPlayer!.id },
          data: {
            currentState: "UNSOLD",
          },
        });

        // Update auction session to COMPLETED
        const updatedSession = await tx.auctionSession.update({
          where: { id: auctionSession.id },
          data: {
            status: "COMPLETED",
          },
          include: {
            currentPlayer: true,
            biddingCaptain: true,
          },
        });

        return { updatedPlayer, updatedSession };
      });

      console.log(`Player ${auctionSession.currentPlayer.name} went UNSOLD`);

      // Emit Socket.IO events for real-time updates
      const globalThis_ = globalThis as any;
      const io = globalThis_.__socketIO;
      if (io) {
        // Stop the auction timer
        stopAuctionTimer(io);

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
          changeType: "PLAYER_UNSOLD",
          timestamp: new Date().toISOString(),
        });

        // Note: playerUpdate emission removed to prevent duplicate toasts
      }

      return NextResponse.json({
        success: true,
        message: `Player ${auctionSession.currentPlayer.name} went unsold`,
        data: result.updatedSession,
        saleDetails: {
          player: result.updatedPlayer,
          captain: null,
          salePrice: null,
        },
      });
    }
  } catch (error) {
    console.error("Error finishing bidding:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to finish bidding",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
