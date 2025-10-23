import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const captainUsername = url.searchParams.get("captain");

    if (!captainUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Captain username is required",
          error: "MISSING_CAPTAIN_PARAMETER",
        },
        { status: 400 }
      );
    }

    // Find the captain
    const captain = await prisma.captain.findUnique({
      where: { username: captainUsername },
    });

    if (!captain) {
      return NextResponse.json(
        {
          success: false,
          message: "Captain not found",
          error: "CAPTAIN_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Get captain's sold players
    const soldPlayers = await prisma.player.findMany({
      where: {
        currentState: "SOLD",
        soldToCaptainId: captain.id,
      },
    });

    // Calculate total spent and average player cost
    const totalSpent = soldPlayers.reduce(
      (sum, player) => sum + (player.soldPrice || 0),
      0
    );
    const averagePlayerCost =
      soldPlayers.length > 0 ? totalSpent / soldPlayers.length : 0;

    // Get environment variables
    const startingBalance = parseInt(process.env.STARTING_BALANCE || "100000");
    const minimumPlayers = parseInt(process.env.MINIMUM_PLAYERS || "24");

    return NextResponse.json({
      success: true,
      data: {
        captain: {
          name: captain.name,
          username: captain.username,
          remainingBudget: captain.remainingBudget,
        },
        startingBalance,
        minimumPlayers,
        totalPlayers: soldPlayers.length,
        totalSpent,
        averagePlayerCost: Math.round(averagePlayerCost),
      },
    });
  } catch (error) {
    console.error("Error fetching captain stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch captain stats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
