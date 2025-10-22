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

// Function to get category sort order for consistent ordering
function getCategorySortOrder(category: string): number {
  const order = [
    "U-17M",
    "U-17W",
    "Open-M",
    "Open-W",
    "40+M",
    "40+W",
    "60+M",
    "60+W",
  ];
  const index = order.indexOf(category);
  return index === -1 ? 999 : index;
}

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

    // Add category information to all players
    const playersWithCategories = allPlayers.map((player) => ({
      ...player,
      category: getPlayerCategory(player.gender, player.age),
    }));

    // Separate players into sold and remaining categories
    const soldPlayers = playersWithCategories
      .filter((player) => player.currentState === "SOLD")
      .sort((a, b) => {
        const categoryCompare =
          getCategorySortOrder(a.category) - getCategorySortOrder(b.category);
        return categoryCompare !== 0
          ? categoryCompare
          : a.name.localeCompare(b.name);
      });

    const remainingPlayers = playersWithCategories
      .filter(
        (player) =>
          player.currentState === "UNAUCTIONED" ||
          player.currentState === "UNSOLD"
      )
      .sort((a, b) => {
        const categoryCompare =
          getCategorySortOrder(a.category) - getCategorySortOrder(b.category);
        return categoryCompare !== 0
          ? categoryCompare
          : a.name.localeCompare(b.name);
      });

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
