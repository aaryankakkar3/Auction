import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Function to determine player category based on gender and age
function getPlayerCategory(gender: string, age: number): string {
  const genderSuffix = gender === "MALE" ? "M" : "W";

  if (age <= 16) {
    return `U-17${genderSuffix}`;
  } else if (age >= 17 && age <= 39) {
    return `Open-${genderSuffix}`;
  } else if (age >= 40 && age <= 59) {
    return `40+${genderSuffix}`;
  } else if (age >= 60) {
    return `60+${genderSuffix}`;
  }

  return `Open-${genderSuffix}`; // Default fallback
}

// Function to get category display name
function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    "U-17M": "U-17 Men's",
    "U-17W": "U-17 Women's",
    "Open-M": "Open Men's",
    "Open-W": "Open Women's",
    "40+M": "40+ Men's",
    "40+W": "40+ Women's",
    "60+M": "60+ Men's",
    "60+W": "60+ Women's",
  };
  return categoryMap[category] || category;
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

    // Fetch all sold players for this captain
    const soldPlayers = await prisma.player.findMany({
      where: {
        currentState: "SOLD",
        soldToCaptainId: captain.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Add category information to players
    const playersWithCategories = soldPlayers.map((player) => ({
      ...player,
      category: getPlayerCategory(player.gender, player.age),
    }));

    // Group players by category
    const playersByCategory: { [key: string]: any[] } = {};
    const categoryOrder = [
      "U-17M",
      "U-17W",
      "Open-M",
      "Open-W",
      "40+M",
      "40+W",
      "60+M",
      "60+W",
    ];

    // Initialize all categories with empty arrays
    categoryOrder.forEach((category) => {
      playersByCategory[category] = [];
    });

    // Group players into their respective categories
    playersWithCategories.forEach((player) => {
      const category = player.category;
      if (playersByCategory[category]) {
        playersByCategory[category].push(player);
      }
    });

    // Convert to the format expected by frontend
    const teamData = categoryOrder.map((category) => ({
      category: getCategoryDisplayName(category),
      players: playersByCategory[category],
    }));

    // Calculate total spending
    const totalSpent = soldPlayers.reduce(
      (sum, player) => sum + (player.soldPrice || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        captain: {
          name: captain.name,
          username: captain.username,
          remainingBudget: captain.remainingBudget,
          totalSpent: totalSpent,
        },
        teamData: teamData,
        totalPlayers: soldPlayers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching team data:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
