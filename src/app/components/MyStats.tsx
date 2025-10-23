import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import { useSocket } from "@/hooks/useSocket";

function MyStats({ captainView }: { captainView: string }) {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchCaptainStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getCaptainStats?captain=${captainView}`
      );
      const result = await response.json();

      if (result.success) {
        setStatsData(result.data);
        console.log("Captain stats updated:", result.data);
      } else {
        console.error("Failed to fetch captain stats:", result.message);
      }
    } catch (error) {
      console.error("Error fetching captain stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (captainView) {
      fetchCaptainStats();
    }
  }, [captainView]);

  // Socket.IO listener for player updates
  useEffect(() => {
    if (socket && isConnected) {
      console.log("🎧 MyStats setting up Socket.IO listeners");

      // Listen for player updates and refresh stats
      socket.on("playerUpdate", (data: any) => {
        console.log(
          "📢 MyStats received playerUpdate, refreshing stats:",
          data
        );
        fetchCaptainStats();
      });

      // Cleanup listeners
      return () => {
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for MyStats listener");
    }
  }, [socket, isConnected]);

  if (loading || !statsData) {
    return (
      <Section>
        <div className="flex flex-col gap-2.5">
          <p className="text-[40px]">Loading...</p>
          <p className="text-text2">Fetching stats</p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex flex-col gap-2.5">
        <p className="text-[40px]">
          ${statsData.captain?.remainingBudget?.toLocaleString() || "0"}
        </p>
        <p className="text-text2">
          Starting balance ${statsData.startingBalance?.toLocaleString() || "0"}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[40px]">{statsData.totalPlayers || 0} players</p>
        <p className="text-text2">
          Minimum needed players: {statsData.minimumPlayers || 0}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[40px]">
          {statsData.averagePlayerCost && statsData.averagePlayerCost > 0
            ? `$${statsData.averagePlayerCost.toLocaleString()} / player`
            : "No players yet"}
        </p>
        <p className="text-text2">Your average player cost</p>
      </div>
    </Section>
  );
}

export default MyStats;
