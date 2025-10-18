import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch all players
    const allPlayers = await prisma.player.findMany({
      include: {
        soldToCaptain: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Separate players into sold and remaining categories
    const soldPlayers = allPlayers.filter(
      (player) => player.currentState === "SOLD"
    );
    const remainingPlayers = allPlayers.filter(
      (player) =>
        player.currentState === "UNAUCTIONED" ||
        player.currentState === "UNSOLD"
    );

    return NextResponse.json({
      success: true,
      data: {
        soldPlayers,
        remainingPlayers,
        totalPlayers: allPlayers.length,
        soldCount: soldPlayers.length,
        remainingCount: remainingPlayers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching players:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch players",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
