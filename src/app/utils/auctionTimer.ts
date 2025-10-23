import { PrismaClient } from "@/generated/prisma";
import { Server as SocketIOServer } from "socket.io";

const prisma = new PrismaClient();

export async function startAuctionTimer(io: SocketIOServer) {
  // Use global timer to ensure only one timer exists across all API routes
  const globalThis_ = globalThis as any;

  // Clear any existing timer
  if (globalThis_.__auctionTimer) {
    console.log("⏰ Clearing existing timer");
    clearInterval(globalThis_.__auctionTimer);
    globalThis_.__auctionTimer = null;
  }

  // Get timer duration from environment variable
  const timerDuration = parseInt(
    process.env.NEXT_PUBLIC_TIMER_COUNTDOWN || "30"
  );
  let currentTimeLeft = timerDuration;

  console.log(`⏰ Starting ${timerDuration}s countdown timer`);

  // Store current time in global variable for pause functionality
  globalThis_.__currentTimeLeft = currentTimeLeft;

  // Broadcast initial timer state
  io.emit("timer_update", { timeLeft: currentTimeLeft });

  // Start countdown
  globalThis_.__auctionTimer = setInterval(async () => {
    currentTimeLeft--;
    globalThis_.__currentTimeLeft = currentTimeLeft; // Keep global variable updated
    io.emit("timer_update", { timeLeft: currentTimeLeft });

    if (currentTimeLeft <= 0) {
      clearInterval(globalThis_.__auctionTimer);
      globalThis_.__auctionTimer = null;
      console.log("⏰ Timer expired! Auto-completing auction...");

      try {
        // Update auction session to COMPLETED_APPROVAL_PENDING
        const updatedSession = await prisma.auctionSession.update({
          where: { id: "singleton" },
          data: { status: "COMPLETED_APPROVAL_PENDING" },
          include: {
            currentPlayer: true,
            biddingCaptain: true,
          },
        });

        console.log("✅ Auto-completed auction session");

        // Broadcast the status change to all clients
        io.emit("auctionSessionUpdate", {
          id: updatedSession.id,
          status: updatedSession.status,
          currentPlayer: updatedSession.currentPlayer,
          bidPrice: updatedSession.bidPrice,
          biddingCaptain: updatedSession.biddingCaptain,
          currentPlayerId: updatedSession.currentPlayerId,
          lastBidAt: updatedSession.lastBidAt,
          biddingCaptainId: updatedSession.biddingCaptainId,
          changeType: "TIMER_EXPIRED",
          timestamp: new Date().toISOString(),
        });

        // Stop timer updates
        io.emit("timer_update", { timeLeft: 0 });
      } catch (error) {
        console.error("❌ Error auto-completing auction:", error);
      } finally {
        await prisma.$disconnect();
      }
    }
  }, 1000);
}

export function stopAuctionTimer(io: SocketIOServer) {
  const globalThis_ = globalThis as any;

  if (globalThis_.__auctionTimer) {
    clearInterval(globalThis_.__auctionTimer);
    globalThis_.__auctionTimer = null;
    globalThis_.__currentTimeLeft = 0; // Clear global time variable
    console.log("⏰ Timer stopped");

    // Stop timer updates to clients
    io.emit("timer_update", { timeLeft: 0 });
  }
}
