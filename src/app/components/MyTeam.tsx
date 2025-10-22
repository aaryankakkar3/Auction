"use client";

import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import { useSocket } from "@/hooks/useSocket";

function MyTeam({ captainView }: { captainView: string }) {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [captainInfo, setCaptainInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getMyTeam?captain=${captainView}`);
      const result = await response.json();

      if (result.success) {
        setTeamData(result.data.teamData);
        setCaptainInfo(result.data.captain);
        console.log("Team data updated:", result.data);
      } else {
        console.error("Failed to fetch team data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (captainView) {
      fetchTeamData();
    }
  }, [captainView]);

  // Socket.IO listener for player updates
  useEffect(() => {
    if (socket && isConnected) {
      console.log("🎧 MyTeam setting up Socket.IO listeners");

      // Listen for player updates and refresh team data
      socket.on("playerUpdate", (data: any) => {
        console.log(
          "📢 MyTeam received playerUpdate, refreshing team data:",
          data
        );
        fetchTeamData();
      });

      // Cleanup listeners
      return () => {
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for MyTeam listener");
    }
  }, [socket, isConnected]);

  function ListComponent({
    type,
    name,
    gender,
    age,
    price,
  }: {
    type: 1 | 2;
    name: string;
    gender: string;
    age: number;
    price: number;
  }) {
    return (
      <div
        className={`flex flex-row gap-0 p-5 rounded-[8px] ${
          type === 1 ? "bg-bg3" : ""
        }`}
      >
        <p className="w-[61%]">{name}</p>
        <p className="w-[13%]">{gender === "MALE" ? "M" : "F"}</p>
        <p className="w-[13%]">{age}</p>
        <p className="w-[13%]">${price}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <Section className="gap-7 w-90 h-full">
        <div className="flex justify-center items-center h-full">
          <p>Loading team data...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="gap-7 w-90 h-full overflow-auto">
      {teamData
        .filter((categoryData) => categoryData.players.length > 0)
        .map((categoryData, categoryIndex) => (
          <div key={categoryIndex} className="flex flex-col gap-5">
            <p className="text-center font-medium">{categoryData.category}</p>
            <div className="flex flex-col gap-0">
              {categoryData.players.map((player: any, playerIndex: number) => (
                <ListComponent
                  key={player.id}
                  name={player.name}
                  gender={player.gender}
                  age={player.age}
                  price={player.soldPrice || 0}
                  type={playerIndex % 2 === 0 ? 1 : 2}
                />
              ))}
            </div>
          </div>
        ))}
    </Section>
  );
}

export default MyTeam;
