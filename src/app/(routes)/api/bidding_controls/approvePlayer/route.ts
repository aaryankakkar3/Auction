import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

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

    // Check if the session is in WAITING status
    if (auctionSession.status !== "WAITING") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot approve player. Session status is ${auctionSession.status}, expected WAITING`,
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Update the auction session to ACTIVE status with current timestamp
    const updatedSession = await prisma.auctionSession.update({
      where: {
        id: auctionSession.id,
      },
      data: {
        status: "ACTIVE",
        lastBidAt: new Date(),
      },
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    console.log(
      "Auction session approved and activated for player:",
      updatedSession.currentPlayer?.name
    );

    return NextResponse.json({
      success: true,
      message: "Player approved and auction activated",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error approving player:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve player",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
