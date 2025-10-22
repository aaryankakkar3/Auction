import React, { useEffect, useState } from "react";
import AveragesStats from "../../../../../components/AveragesStats";
import PlayersBreakdown from "../../../../../components/PlayersBreakdown";
import AveragesStats2 from "@/app/components/AverageStats2";
import { useSocket } from "@/hooks/useSocket";

function RightBar({ captainView }: { captainView: string }) {
  const [statsData, setStatsData] = useState<any>(null);
  const { socket, isConnected } = useSocket();

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/getStats?captain=${captainView}`);
      const result = await response.json();

      if (result.success) {
        setStatsData(result.data);
        console.log("Stats data updated:", result.data);
      } else {
        console.error("Failed to fetch stats:", result.message);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (captainView) {
      fetchStats();
    }
  }, [captainView]);

  // Socket.IO listener for player updates
  useEffect(() => {
    if (socket && isConnected) {
      console.log("🎧 RightBar setting up Socket.IO listeners");

      // Listen for player updates and refresh stats
      socket.on("playerUpdate", (data: any) => {
        console.log(
          "📢 RightBar received playerUpdate, refreshing stats:",
          data
        );
        fetchStats();
      });

      // Cleanup listeners
      return () => {
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for RightBar listener");
    }
  }, [socket, isConnected]);

  return (
    <div className="flex flex-col gap-5 w-80 h-full">
      <AveragesStats captainView={captainView} statsData={statsData} />
      <AveragesStats2 captainView={captainView} statsData={statsData} />
      <PlayersBreakdown />
    </div>
  );
}

export default RightBar;
