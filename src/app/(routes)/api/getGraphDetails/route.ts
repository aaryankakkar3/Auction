import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Function to determine player category based on gender and age
function getPlayerCategory(gender: string, age: number): string {
  const genderPrefix = gender === "MALE" ? "M" : "W";

  if (age <= 16) {
    return `${genderPrefix} U-17`;
  } else if (age >= 17 && age <= 39) {
    return `${genderPrefix} Open`;
  } else if (age >= 40 && age <= 59) {
    return `${genderPrefix} 40+`;
  } else if (age >= 60) {
    return `${genderPrefix} 60+`;
  }

  return `${genderPrefix} Open`; // Default fallback
}

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

    // Get captain's sold players with their gender and age
    const soldPlayers = await prisma.player.findMany({
      where: {
        currentState: "SOLD",
        soldToCaptainId: captain.id,
      },
      select: {
        gender: true,
        age: true,
      },
    });

    // Count players by category
    const playerCount: Record<string, number> = {};

    soldPlayers.forEach((player) => {
      const category = getPlayerCategory(player.gender, player.age);
      playerCount[category] = (playerCount[category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        captain: {
          name: captain.name,
          username: captain.username,
        },
        playerCount,
      },
    });
  } catch (error) {
    console.error("Error fetching graph details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch graph details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
