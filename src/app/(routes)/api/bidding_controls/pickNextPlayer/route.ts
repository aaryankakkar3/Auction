import { PrismaClient } from "../../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedPools, includeUnsold } = body;

    // Check if there's an incomplete auction session
    const existingSession = await prisma.auctionSession.findFirst();

    if (existingSession && existingSession.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete the current auction session before starting a new one.",
          error: "INCOMPLETE_SESSION_EXISTS",
        },
        { status: 400 }
      );
    }

    // Build age and gender filters based on selected pools
    const ageGenderFilters = [];

    if (selectedPools["Men's Under 17"]) {
      ageGenderFilters.push({ gender: "MALE" as const, age: { lte: 16 } });
    }
    if (selectedPools["Men's Open"]) {
      ageGenderFilters.push({
        gender: "MALE" as const,
        age: { gte: 17, lte: 39 },
      });
    }
    if (selectedPools["Men's 40+"]) {
      ageGenderFilters.push({
        gender: "MALE" as const,
        age: { gte: 40, lte: 59 },
      });
    }
    if (selectedPools["Men's 60+"]) {
      ageGenderFilters.push({ gender: "MALE" as const, age: { gte: 60 } });
    }
    if (selectedPools["Women's Under 17"]) {
      ageGenderFilters.push({ gender: "FEMALE" as const, age: { lte: 16 } });
    }
    if (selectedPools["Women's Open"]) {
      ageGenderFilters.push({
        gender: "FEMALE" as const,
        age: { gte: 17, lte: 39 },
      });
    }
    if (selectedPools["Women's 40+"]) {
      ageGenderFilters.push({
        gender: "FEMALE" as const,
        age: { gte: 40, lte: 59 },
      });
    }
    if (selectedPools["Women's 60+"]) {
      ageGenderFilters.push({ gender: "FEMALE" as const, age: { gte: 60 } });
    }

    if (ageGenderFilters.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No pools selected. Please select at least one pool.",
          error: "NO_POOLS_SELECTED",
        },
        { status: 400 }
      );
    }

    // Build current state filter
    const currentStateFilter = includeUnsold
      ? ["UNAUCTIONED" as const, "UNSOLD" as const]
      : ["UNAUCTIONED" as const];

    // Query players matching criteria
    const eligiblePlayers = await prisma.player.findMany({
      where: {
        AND: [
          {
            OR: ageGenderFilters,
          },
          {
            currentState: {
              in: currentStateFilter,
            },
          },
        ],
      },
    });

    if (eligiblePlayers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No eligible players found matching the selected criteria.",
          error: "NO_ELIGIBLE_PLAYERS",
        },
        { status: 404 }
      );
    }

    // Randomly pick one player
    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    const selectedPlayer = eligiblePlayers[randomIndex];

    // Delete existing auction session and create a fresh one
    if (existingSession) {
      await prisma.auctionSession.delete({
        where: {
          id: existingSession.id,
        },
      });
      console.log("Previous auction session deleted");
    }

    // Create fresh auction session with clean data
    const auctionSession = await prisma.auctionSession.create({
      data: {
        currentPlayerId: selectedPlayer.id,
        status: "WAITING",
        lastBidAt: null,
        bidPrice: null,
        biddingCaptainId: null,
      },
      include: {
        currentPlayer: true,
      },
    });

    console.log("Auction session created/updated for:", selectedPlayer.name);

    return NextResponse.json({
      success: true,
      message: `Auction started for ${selectedPlayer.name}`,
      auctionSession: auctionSession,
      eligiblePlayersCount: eligiblePlayers.length,
      selectedCriteria: {
        pools: selectedPools,
        includeUnsold,
        currentStateFilter,
      },
    });
  } catch (error) {
    console.error("Error picking next player:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to pick next player",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
