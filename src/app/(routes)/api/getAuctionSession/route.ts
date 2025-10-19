import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check if there's an auction session
    const auctionSession = await prisma.auctionSession.findFirst({
      include: {
        currentPlayer: true,
        biddingCaptain: true,
      },
    });

    if (auctionSession) {
      return NextResponse.json({
        success: true,
        data: auctionSession,
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }
  } catch (error) {
    console.error("Error fetching auction session:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch auction session",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
