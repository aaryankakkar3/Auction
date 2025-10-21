import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Server as SocketServer } from "socket.io";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current auction session
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
          message: `Cannot discard bidding. Session status is ${auctionSession.status}, expected COMPLETED_APPROVAL_PENDING`,
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Update the auction session to COMPLETED status (discard the auction)
    const updatedSession = await prisma.auctionSession.update({
      where: {
        id: auctionSession.id,
      },
      data: {
        status: "COMPLETED",
      },
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    console.log(
      "Auction session discarded for player:",
      updatedSession.currentPlayer?.name
    );

    // Emit Socket.IO event to update all clients
    const globalThis_ = globalThis as any;
    const io = globalThis_.__socketIO;
    if (io) {
      // Emit auction session update directly to clients
      io.emit("auctionSessionUpdate", {
        id: updatedSession.id,
        status: updatedSession.status,
        currentPlayer: updatedSession.currentPlayer,
        bidPrice: updatedSession.bidPrice,
        biddingCaptain: updatedSession.biddingCaptain,
        currentPlayerId: updatedSession.currentPlayerId,
        lastBidAt: updatedSession.lastBidAt,
        biddingCaptainId: updatedSession.biddingCaptainId,
        changeType: "BIDDING_DISCARDED",
        timestamp: new Date().toISOString(),
      });
      console.log("📡 Emitted auction session update via Socket.IO");
    }

    return NextResponse.json({
      success: true,
      message: `Auction session discarded for ${auctionSession.currentPlayer?.name}`,
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error discarding bidding:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to discard bidding",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
