import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";
import { Socket } from "net";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

// Global timer state
let auctionTimer: NodeJS.Timeout | null = null;
let currentTimeLeft: number = 0;

// Make timer function globally available immediately
const startTimerGlobal = () => {
  const globalThis_ = globalThis as any;
  const io = globalThis_.__socketIO;
  if (io) {
    console.log("⏰ Timer function called, starting countdown");
    startAuctionTimer(io);
  } else {
    console.log("❌ Socket.IO not available when timer function called");
  }
};

// Store the timer function globally immediately
(globalThis as any).__startAuctionTimer = startTimerGlobal;

// Timer functions
function startAuctionTimer(io: SocketIOServer) {
  // Clear existing timer
  if (auctionTimer) {
    clearInterval(auctionTimer);
  }

  // Get timer duration from environment variable
  const timerDuration = parseInt(
    process.env.NEXT_PUBLIC_TIMER_COUNTDOWN || "30"
  );
  currentTimeLeft = timerDuration;

  console.log(`⏰ Starting ${timerDuration}s countdown timer`);

  // Broadcast initial timer state
  io.emit("timer_update", { timeLeft: currentTimeLeft });

  // Start countdown
  auctionTimer = setInterval(async () => {
    currentTimeLeft--;

    // Broadcast timer update to all clients
    io.emit("timer_update", { timeLeft: currentTimeLeft });

    console.log(`⏰ Timer: ${currentTimeLeft}s remaining`);

    // When timer reaches 0, auto-update auction status
    if (currentTimeLeft <= 0) {
      clearInterval(auctionTimer!);
      auctionTimer = null;

      console.log("⏰ Timer expired! Auto-updating auction status...");
      await autoCompleteAuction(io);
    }
  }, 1000);
}

async function autoCompleteAuction(io: SocketIOServer) {
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
  } catch (error) {
    console.error("❌ Error auto-completing auction:", error);
  }
}

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    // Server already exists, reusing
  } else {
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      transports: ["polling"], // Use polling only for Next.js compatibility
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      // Listen for timer control requests from API routes (legacy - no longer used)
      socket.on("updateAuctionSession", (updateData) => {
        // This is kept for compatibility but not actively used
        // Timer logic is now handled directly in API routes
      });

      // Send current timer state to newly connected clients
      socket.emit("timer_update", { timeLeft: currentTimeLeft });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    // Make the socket server globally accessible
    const globalThis_ = globalThis as any;
    globalThis_.__socketIO = io;
  }
  res.end();
}
