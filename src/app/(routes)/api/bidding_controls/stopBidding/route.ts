import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { stopAuctionTimer } from "@/app/utils/auctionTimer";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current auction session
    const auctionSession = await prisma.auctionSession.findFirst();

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

    // Check if the session is in ACTIVE status
    if (auctionSession.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot stop bidding. Session status is ${auctionSession.status}, expected ACTIVE`,
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Update the auction session to COMPLETED_APPROVAL_PENDING status
    const updatedSession = await prisma.auctionSession.update({
      where: {
        id: auctionSession.id,
      },
      data: {
        status: "COMPLETED_APPROVAL_PENDING",
      },
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    console.log(
      "Bidding stopped for player:",
      updatedSession.currentPlayer?.name
    );

    // Emit Socket.IO event for real-time updates
    const globalThis_ = globalThis as any;
    const io = globalThis_.__socketIO;
    if (io) {
      // Stop the auction timer
      stopAuctionTimer(io);

      // Emit auction session update to clients
      io.emit("auctionSessionUpdate", {
        id: updatedSession.id,
        status: updatedSession.status,
        currentPlayer: updatedSession.currentPlayer,
        bidPrice: updatedSession.bidPrice,
        biddingCaptain: updatedSession.biddingCaptain,
        currentPlayerId: updatedSession.currentPlayerId,
        lastBidAt: updatedSession.lastBidAt,
        biddingCaptainId: updatedSession.biddingCaptainId,
        changeType: "BIDDING_STOPPED",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bidding stopped and awaiting approval",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error stopping bidding:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to stop bidding",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
