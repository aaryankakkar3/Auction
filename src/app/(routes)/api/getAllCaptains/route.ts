import { PrismaClient } from "../../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch all captains
    const captains = await prisma.captain.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: captains,
    });
  } catch (error) {
    console.error("Error fetching captains:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch captains",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
