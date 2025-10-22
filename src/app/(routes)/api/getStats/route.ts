import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const captainUsername = url.searchParams.get("captain");

    // Fetch all captains with their budgets
    const allCaptains = await prisma.captain.findMany();

    // Fetch all players with their sold information
    const allPlayers = await prisma.player.findMany({
      include: {
        soldToCaptain: true,
      },
    });

    // Calculate basic statistics
    const soldPlayers = allPlayers.filter(
      (player) => player.currentState === "SOLD"
    );
    const remainingPlayers = allPlayers.filter(
      (player) =>
        player.currentState === "UNAUCTIONED" ||
        player.currentState === "UNSOLD"
    );

    // Calculate total money spent by all teams
    const totalMoneySpent = soldPlayers.reduce(
      (sum, player) => sum + (player.soldPrice || 0),
      0
    );

    // Calculate total remaining budget of all captains
    const totalRemainingBudget = allCaptains.reduce(
      (sum, captain) => sum + captain.remainingBudget,
      0
    );

    // Calculate total budget of all captains (spent + remaining)
    const totalBudget = totalMoneySpent + totalRemainingBudget;

    // Combined average player cost = total money spent by all teams / total number of players sold
    const combinedAveragePlayerCost =
      soldPlayers.length > 0 ? totalMoneySpent / soldPlayers.length : 0;

    // Your average player cost presently (only if captain is specified)
    let yourAveragePlayerCost = 0;
    if (captainUsername) {
      const captain = allCaptains.find((c) => c.username === captainUsername);
      if (captain) {
        const yourSoldPlayers = soldPlayers.filter(
          (player) => player.soldToCaptainId === captain.id
        );
        const yourTotalSpent = yourSoldPlayers.reduce(
          (sum, player) => sum + (player.soldPrice || 0),
          0
        );
        yourAveragePlayerCost =
          yourSoldPlayers.length > 0
            ? yourTotalSpent / yourSoldPlayers.length
            : 0;
      }
    }

    // Combined average player cost for remaining players = total money left combined by all captains / total players left
    const combinedAverageRemainingPlayerCost =
      remainingPlayers.length > 0
        ? totalRemainingBudget / remainingPlayers.length
        : 0;

    // Ideal average player cost = total budget of all captains combined / total players (sold and unsold)
    const idealAveragePlayerCost =
      allPlayers.length > 0 ? totalBudget / allPlayers.length : 0;

    return NextResponse.json({
      success: true,
      data: {
        combinedAveragePlayerCost: Math.round(combinedAveragePlayerCost),
        yourAveragePlayerCost: Math.round(yourAveragePlayerCost),
        combinedAverageRemainingPlayerCost: Math.round(
          combinedAverageRemainingPlayerCost
        ),
        idealAveragePlayerCost: Math.round(idealAveragePlayerCost),
        totalPlayers: allPlayers.length,
        soldPlayers: soldPlayers.length,
        remainingPlayers: remainingPlayers.length,
        totalMoneySpent,
        totalRemainingBudget,
        totalBudget,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch stats",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
