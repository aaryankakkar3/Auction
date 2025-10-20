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

    // Check if the session is in COMPLETED_APPROVAL_PENDING status
    if (auctionSession.status !== "COMPLETED_APPROVAL_PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot restart bidding. Session status is ${auctionSession.status}, expected COMPLETED_APPROVAL_PENDING`,
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Update the auction session to restart bidding
    const updatedSession = await prisma.auctionSession.update({
      where: {
        id: auctionSession.id,
      },
      data: {
        status: "ACTIVE",
        bidPrice: null,
        biddingCaptainId: null,
        lastBidAt: new Date(),
      },
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    console.log(
      "Bidding restarted for player:",
      updatedSession.currentPlayer?.name
    );

    return NextResponse.json({
      success: true,
      message: "Bidding restarted successfully",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error restarting bidding:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to restart bidding",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
