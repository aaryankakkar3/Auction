import { PrismaClient } from "../../../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const currentSession = await prisma.auctionSession.findFirst({
      where: { status: "ACTIVE" },
    });

    if (!currentSession) {
      return NextResponse.json(
        {
          success: false,
          message: "No active auction to pause",
          error: "NO_ACTIVE_AUCTION",
        },
        { status: 400 }
      );
    }

    // Get current timer state from global variable
    const globalThis_ = globalThis as any;
    let timeRemaining = 0;

    // Try to get current time from global timer state
    if (globalThis_.__currentTimeLeft) {
      timeRemaining = globalThis_.__currentTimeLeft;
    } else {
      // Fallback: use default timer duration if no active timer
      const timerDuration = parseInt(
        process.env.NEXT_PUBLIC_TIMER_COUNTDOWN || "30"
      );
      timeRemaining = timerDuration;
    }

    // Clear the existing timer
    if (globalThis_.__auctionTimer) {
      clearInterval(globalThis_.__auctionTimer);
      globalThis_.__auctionTimer = null;
    }

    // Update session to paused state
    const updatedSession = await prisma.auctionSession.update({
      where: { id: currentSession.id },
      data: {
        pausedAt: timeRemaining, // Store remaining seconds in pausedAt
      },
    });

    console.log(`⏸️ Auction paused with ${timeRemaining} seconds remaining`);

    // Emit pause event to all clients
    const io = globalThis_.__socketIO;
    if (io) {
      io.emit("auctionSessionUpdate", {
        ...updatedSession,
        changeType: "AUCTION_PAUSED",
        message: "Auction paused",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Auction paused successfully",
      data: {
        timeRemaining,
        pausedAt: timeRemaining,
      },
    });
  } catch (error) {
    console.error("Error pausing auction:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to pause auction",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
