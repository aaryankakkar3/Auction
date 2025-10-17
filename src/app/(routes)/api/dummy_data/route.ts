import { PrismaClient } from "../../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Dummy player data extracted from your SQL
const dummyPlayers = [
  // Under 17 Males
  {
    name: "Aaryan Kakkar",
    gender: "MALE" as const,
    age: 16,
    preferredHand: "RIGHT" as const,
    bestAchievement: "District Champion",
  },
  {
    name: "Rohan Mehta",
    gender: "MALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Kabir Sharma",
    gender: "MALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Vivaan Gupta",
    gender: "MALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Aditya Singh",
    gender: "MALE",
    age: 15,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Semi-Finalist",
  },
  {
    name: "Arjun Iyer",
    gender: "MALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "State Champion",
  },
  {
    name: "Siddharth Rao",
    gender: "MALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Dhruv Malhotra",
    gender: "MALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },

  // Under 17 Females
  {
    name: "Neha Sharma",
    gender: "FEMALE",
    age: 16,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Ananya Gupta",
    gender: "FEMALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Isha Mehta",
    gender: "FEMALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Sanya Reddy",
    gender: "FEMALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Kiara Singh",
    gender: "FEMALE",
    age: 15,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Aarohi Iyer",
    gender: "FEMALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Semi-Finalist",
  },
  {
    name: "Mira Rao",
    gender: "FEMALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Tanya Malhotra",
    gender: "FEMALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "State Champion",
  },

  // Ages 17-40 Males
  {
    name: "Raghav Kapoor",
    gender: "MALE",
    age: 22,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Vivaan Joshi",
    gender: "MALE",
    age: 30,
    preferredHand: "LEFT",
    bestAchievement: "National Quarterfinalist",
  },
  {
    name: "Krishna Sharma",
    gender: "MALE",
    age: 25,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Arnav Mehta",
    gender: "MALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Dev Malhotra",
    gender: "MALE",
    age: 28,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Shaurya Rao",
    gender: "MALE",
    age: 33,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Advik Singh",
    gender: "MALE",
    age: 29,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Kartik Iyer",
    gender: "MALE",
    age: 24,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },

  // Ages 17-40 Females
  {
    name: "Anika Sharma",
    gender: "FEMALE",
    age: 23,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Riya Gupta",
    gender: "FEMALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Aarohi Mehta",
    gender: "FEMALE",
    age: 27,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Sanya Malhotra",
    gender: "FEMALE",
    age: 30,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Kiara Singh",
    gender: "FEMALE",
    age: 22,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Isha Rao",
    gender: "FEMALE",
    age: 28,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Neha Kapoor",
    gender: "FEMALE",
    age: 33,
    preferredHand: "RIGHT",
    bestAchievement: "National Champion",
  },
  {
    name: "Aanya Joshi",
    gender: "FEMALE",
    age: 26,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Ages 41-60 Males
  {
    name: "Ramesh Kumar",
    gender: "MALE",
    age: 45,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Suresh Singh",
    gender: "MALE",
    age: 50,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Vikram Mehta",
    gender: "MALE",
    age: 42,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Anil Sharma",
    gender: "MALE",
    age: 55,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Rohit Rao",
    gender: "MALE",
    age: 48,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Deepak Iyer",
    gender: "MALE",
    age: 60,
    preferredHand: "LEFT",
    bestAchievement: "National Runner-up",
  },
  {
    name: "Manish Malhotra",
    gender: "MALE",
    age: 53,
    preferredHand: "RIGHT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Rajesh Gupta",
    gender: "MALE",
    age: 47,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Ages 41-60 Females
  {
    name: "Sunita Sharma",
    gender: "FEMALE",
    age: 46,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Pooja Mehta",
    gender: "FEMALE",
    age: 50,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Anjali Rao",
    gender: "FEMALE",
    age: 55,
    preferredHand: "RIGHT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Neelam Singh",
    gender: "FEMALE",
    age: 43,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Kavita Gupta",
    gender: "FEMALE",
    age: 48,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Sangeeta Malhotra",
    gender: "FEMALE",
    age: 60,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Rekha Iyer",
    gender: "FEMALE",
    age: 52,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Maya Joshi",
    gender: "FEMALE",
    age: 47,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },

  // Over 60 Males
  {
    name: "Ram Kumar",
    gender: "MALE",
    age: 65,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Shyam Singh",
    gender: "MALE",
    age: 62,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Raghunath Mehta",
    gender: "MALE",
    age: 68,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Anand Sharma",
    gender: "MALE",
    age: 61,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Vishal Rao",
    gender: "MALE",
    age: 64,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Hari Iyer",
    gender: "MALE",
    age: 63,
    preferredHand: "LEFT",
    bestAchievement: "National Quarterfinalist",
  },
  {
    name: "Devendra Malhotra",
    gender: "MALE",
    age: 66,
    preferredHand: "RIGHT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Ratan Gupta",
    gender: "MALE",
    age: 67,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Over 60 Females
  {
    name: "Sushma Sharma",
    gender: "FEMALE",
    age: 61,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Kiran Mehta",
    gender: "FEMALE",
    age: 64,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Radha Rao",
    gender: "FEMALE",
    age: 65,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Usha Singh",
    gender: "FEMALE",
    age: 63,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Mala Gupta",
    gender: "FEMALE",
    age: 66,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Leela Malhotra",
    gender: "FEMALE",
    age: 62,
    preferredHand: "LEFT",
    bestAchievement: "National Runner-up",
  },
  {
    name: "Indira Iyer",
    gender: "FEMALE",
    age: 68,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Anita Joshi",
    gender: "FEMALE",
    age: 67,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },

  // Random Extras
  {
    name: "Aryan Kapoor",
    gender: "MALE",
    age: 19,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Tara Mehta",
    gender: "FEMALE",
    age: 27,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Veer Sharma",
    gender: "MALE",
    age: 41,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Diya Rao",
    gender: "FEMALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Nikhil Gupta",
    gender: "MALE",
    age: 50,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Sneha Iyer",
    gender: "FEMALE",
    age: 17,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Rajat Malhotra",
    gender: "MALE",
    age: 62,
    preferredHand: "RIGHT",
    bestAchievement: "National Champion",
  },
  {
    name: "Anika Joshi",
    gender: "FEMALE",
    age: 14,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Kabir Singh",
    gender: "MALE",
    age: 33,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Mira Sharma",
    gender: "FEMALE",
    age: 55,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Aditya Rao",
    gender: "MALE",
    age: 45,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Aarohi Gupta",
    gender: "FEMALE",
    age: 29,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Dhruv Iyer",
    gender: "MALE",
    age: 16,
    preferredHand: "RIGHT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Kiara Malhotra",
    gender: "FEMALE",
    age: 61,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },
  {
    name: "Rohan Joshi",
    gender: "MALE",
    age: 38,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
];

export async function GET() {
  try {
    // Check existing players
    const existingPlayers = await prisma.player.findMany();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      existingPlayersCount: existingPlayers.length,
      dummyPlayersReady: dummyPlayers.length,
      existingPlayers: existingPlayers,
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    await prisma.$connect();

    // Clear existing players (optional - remove this if you want to keep existing data)
    await prisma.player.deleteMany();
    console.log("Cleared existing players");

    // Insert all dummy players using createMany for better performance
    const result = await prisma.player.createMany({
      data: dummyPlayers as any,
      skipDuplicates: true, // Skip if any duplicates exist
    });

    // Get the inserted players to verify
    const allPlayers = await prisma.player.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${result.count} players to the database`,
      insertedCount: result.count,
      totalPlayers: allPlayers.length,
      players: allPlayers,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload dummy data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
