import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import { categoryRequirements } from "../utils/auctionSpecifics";
import { useSocket } from "@/hooks/useSocket";

function TeamStrengthGraph({ captainView }: { captainView: string }) {
  const [playerCount, setPlayerCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchGraphDetails = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching graph details for captain:", captainView);

      const response = await fetch(
        `/api/getGraphDetails?captain=${captainView}`
      );
      const result = await response.json();

      console.log("📊 Graph API response:", result);

      if (result.success) {
        setPlayerCount(result.data.playerCount);
        console.log("Graph details updated:", result.data.playerCount);
      } else {
        console.error("Failed to fetch graph details:", result.message);
        setPlayerCount({});
      }
    } catch (error) {
      console.error("Error fetching graph details:", error);
      setPlayerCount({});
    } finally {
      console.log("🏁 Setting loading to false");
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log(
      "🎯 TeamStrengthGraph useEffect triggered with captainView:",
      captainView
    );
    if (captainView) {
      fetchGraphDetails();
    } else {
      console.warn("⚠️ No captainView provided, skipping fetch");
      setLoading(false);
    }
  }, [captainView]);

  // Socket.IO listener for player updates
  useEffect(() => {
    if (socket && isConnected) {
      console.log("🎧 TeamStrengthGraph setting up Socket.IO listeners");

      // Listen for player updates and refresh graph data
      socket.on("playerUpdate", (data: any) => {
        console.log(
          "📢 TeamStrengthGraph received playerUpdate, refreshing graph:",
          data
        );
        fetchGraphDetails();
      });

      // Cleanup listeners
      return () => {
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for TeamStrengthGraph listener");
    }
  }, [socket, isConnected]);

  if (loading) {
    return (
      <Section className="h-full">
        <p className="font-semibold">Team strength</p>
        <div className="flex items-center justify-center h-full">
          <p className="text-text2">Loading graph...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="h-full">
      <p className="font-semibold">Team strength</p>
      <div className="flex flex-col gap-2.5 h-full">
        <div className="flex flex-row h-full justify-between ">
          {Object.keys(categoryRequirements).map((category) => (
            <div
              key={category}
              className="flex flex-col h-full justify-end gap-0 w-full items-center"
            >
              {(() => {
                const required =
                  categoryRequirements[
                    category as keyof typeof categoryRequirements
                  ];
                const current =
                  playerCount[category as keyof typeof playerCount] || 0;
                const remaining = Math.max(0, required - current);

                const currentHeight = (current / 6) * 100;
                const remainingHeight = (remaining / 6) * 100;

                return (
                  <>
                    {remaining > 0 && (
                      <div
                        className="w-1 bg-text2"
                        style={{ height: `${remainingHeight}%` }}
                      ></div>
                    )}
                    {current > 0 && (
                      <div
                        className="w-1 bg-accent1"
                        style={{ height: `${currentHeight}%` }}
                      ></div>
                    )}
                  </>
                );
              })()}
            </div>
          ))}
          <div className="flex flex-col justify-between w-full">
            <p className="">6</p>
            <p className="">5</p>
            <p className="">4</p>
            <p className="">3</p>
            <p className="">2</p>
            <p className="">1</p>
            <p className="">0</p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          {Object.keys(categoryRequirements).map((category) => (
            <div
              key={category}
              className="flex flex-col items-center gap-0 w-full text-[12px]"
            >
              <p className="">{category.at(0)}</p>
              <p className="">{category.slice(2)}</p>
            </div>
          ))}
          <div className="w-full"></div>
        </div>
      </div>
    </Section>
  );
}

export default TeamStrengthGraph;
