"use client";

import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import { useSocket } from "@/hooks/useSocket";

function PlayersBreakdown() {
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [totals, setTotals] = useState({ total: 0, sold: 0 });
  const { socket, isConnected } = useSocket();

  // Map short category names to extended forms
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      "U-17M": "Men's Under-17",
      "U-17W": "Women's Under-17",
      "Open-M": "Men's Open",
      "Open-W": "Women's Open",
      "40+M": "Men's 40+",
      "40+W": "Women's 40+",
      "60+M": "Men's 60+",
      "60+W": "Women's 60+",
    };
    return categoryMap[category] || category;
  };

  const fetchAndProcessData = async () => {
    try {
      const response = await fetch("/api/getAllPlayers");
      const result = await response.json();

      if (result.success) {
        const { soldPlayers, remainingPlayers } = result.data;

        // Combine all players
        const allPlayers = [...soldPlayers, ...remainingPlayers];

        // Group by category
        const categoryStats: {
          [key: string]: { total: number; sold: number };
        } = {};

        allPlayers.forEach((player) => {
          const category = player.category;
          if (!categoryStats[category]) {
            categoryStats[category] = { total: 0, sold: 0 };
          }
          categoryStats[category].total++;
          if (player.currentState === "SOLD") {
            categoryStats[category].sold++;
          }
        });

        // Convert to array with display names and sort by predefined order
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
        const breakdown = categoryOrder
          .filter((category) => categoryStats[category]) // Only include categories that have players
          .map((category) => ({
            category: getCategoryDisplayName(category),
            total: categoryStats[category].total,
            sold: categoryStats[category].sold,
          }));

        setCategoryBreakdown(breakdown);

        // Calculate totals
        const totalPlayers = allPlayers.length;
        const totalSold = soldPlayers.length;
        setTotals({ total: totalPlayers, sold: totalSold });

        console.log("Category breakdown updated:", breakdown);
      } else {
        console.error("Failed to fetch players:", result.message);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAndProcessData();
  }, []);

  // Socket.IO listener for player updates
  useEffect(() => {
    if (socket && isConnected) {
      console.log("🎧 PlayersBreakdown setting up Socket.IO listeners");

      // Listen for player updates and refresh the breakdown
      socket.on("playerUpdate", (data: any) => {
        console.log(
          "📢 PlayersBreakdown received playerUpdate, refreshing breakdown:",
          data
        );
        fetchAndProcessData();
      });

      // Cleanup listeners
      return () => {
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for PlayersBreakdown listener");
    }
  }, [socket, isConnected]);

  function ListComponent({
    category,
    total,
    sold,
  }: {
    category: string;
    total: number;
    sold: number;
  }) {
    return (
      <div className="flex flex-row w-full ">
        <p className="w-[60%]">{category}</p>
        <p className="w-[20%]">{total}</p>
        <p className="w-[20%]">{sold}</p>
      </div>
    );
  }

  return (
    <Section className="">
      <p className="font-semibold">Category wise total player breakdown:</p>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row w-full font-semibold">
          <p className="w-[60%]">Category</p>
          <p className="w-[20%]">Total</p>
          <p className="w-[20%]">Sold</p>
        </div>
        {categoryBreakdown.map((item, index) => (
          <ListComponent
            key={index}
            category={item.category}
            total={item.total}
            sold={item.sold}
          />
        ))}
        <div className="w-full h-[1px] bg-text2"></div>
        <ListComponent
          category="Total"
          total={totals.total}
          sold={totals.sold}
        />
      </div>
    </Section>
  );
}

export default PlayersBreakdown;
