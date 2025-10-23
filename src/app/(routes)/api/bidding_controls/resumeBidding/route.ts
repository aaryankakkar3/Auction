import { PrismaClient } from "../../../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const currentSession = await prisma.auctionSession.findFirst({
      where: {
        status: "ACTIVE",
        pausedAt: { not: null },
      },
    });

    if (!currentSession || currentSession.pausedAt === null) {
      return NextResponse.json(
        {
          success: false,
          message: "No paused auction to resume",
          error: "NO_PAUSED_AUCTION",
        },
        { status: 400 }
      );
    }

    const remainingTime = currentSession.pausedAt;

    // Update session to resume - clear pause state
    const updatedSession = await prisma.auctionSession.update({
      where: { id: currentSession.id },
      data: {
        pausedAt: null, // Clear pause state
      },
    });

    console.log(`▶️ Auction resumed with ${remainingTime} seconds remaining`);

    // Emit resume event to all clients
    const globalThis_ = globalThis as any;
    const io = globalThis_.__socketIO;
    if (io) {
      // Start the timer by emitting timer updates
      let currentTimeLeft = remainingTime;

      // Use global timer for resume
      if (globalThis_.__auctionTimer) {
        clearInterval(globalThis_.__auctionTimer);
      }

      // Start countdown
      globalThis_.__auctionTimer = setInterval(async () => {
        currentTimeLeft--;
        globalThis_.__currentTimeLeft = currentTimeLeft; // Keep global variable updated
        io.emit("timer_update", { timeLeft: currentTimeLeft });

        if (currentTimeLeft <= 0) {
          clearInterval(globalThis_.__auctionTimer);
          globalThis_.__auctionTimer = null;
          globalThis_.__currentTimeLeft = 0; // Clear global time variable
          console.log("⏰ Timer expired! Auto-completing auction...");

          try {
            // Update auction session to COMPLETED_APPROVAL_PENDING
            const completedSession = await prisma.auctionSession.update({
              where: { id: currentSession.id },
              data: { status: "COMPLETED_APPROVAL_PENDING" },
              include: {
                currentPlayer: true,
                biddingCaptain: true,
              },
            });

            // Broadcast the status change
            io.emit("auctionSessionUpdate", {
              id: completedSession.id,
              status: completedSession.status,
              currentPlayer: completedSession.currentPlayer,
              bidPrice: completedSession.bidPrice,
              biddingCaptain: completedSession.biddingCaptain,
              currentPlayerId: completedSession.currentPlayerId,
              lastBidAt: completedSession.lastBidAt,
              biddingCaptainId: completedSession.biddingCaptainId,
              changeType: "TIMER_EXPIRED",
              timestamp: new Date().toISOString(),
            });

            io.emit("timer_update", { timeLeft: 0 });
          } catch (error) {
            console.error("❌ Error auto-completing auction:", error);
          }
        }
      }, 1000);

      // Broadcast initial timer state and session update
      io.emit("timer_update", { timeLeft: currentTimeLeft });
      io.emit("auctionSessionUpdate", {
        ...updatedSession,
        changeType: "AUCTION_RESUMED",
        message: "Auction resumed",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Auction resumed successfully",
      data: {
        remainingTime,
      },
    });
  } catch (error) {
    console.error("Error resuming auction:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to resume auction",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
