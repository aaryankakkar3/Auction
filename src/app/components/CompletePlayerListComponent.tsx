"use client";

import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import Button from "./ui/Button";
import SoldPlayerListItem from "./SoldPlayerListItem";
import RemainingPlayerListItem from "./RemainingPlayerListItem";

function CompletePlayerListComponent() {
  const [soldPlayers, setSoldPlayers] = useState<any[]>([]);
  const [remainingPlayers, setRemainingPlayers] = useState<any[]>([]);
  const [listType, setListType] = useState<"SOLD" | "REMAINING">("REMAINING");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/getAllPlayers");
        const result = await response.json();

        if (result.success) {
          const { soldPlayers, remainingPlayers } = result.data;
          setSoldPlayers(soldPlayers);
          setRemainingPlayers(remainingPlayers);
          console.log("Sold players:", soldPlayers);
          console.log("Remaining players:", remainingPlayers);
        } else {
          console.error("Failed to fetch players:", result.message);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <Section className="h-full overflow-hidden">
      <div className="flex flex-row justify-between">
        <p className="font-semibold">Players</p>
        <div className="flex flex-row gap-0 rounded-[8px] bg-bg1">
          <Button
            className={`px-5 py-1.25 ${
              listType === "REMAINING" && "bg-accent1"
            }`}
            onClick={() => setListType("REMAINING")}
          >
            Remaining
          </Button>
          <Button
            className={`px-5 py-1.25 ${listType === "SOLD" && "bg-accent1"}`}
            onClick={() => setListType("SOLD")}
          >
            Sold
          </Button>
        </div>
      </div>
      {listType == "SOLD" && (
        <div className="flex flex-col gap-0 overflow-auto h-full max-h-91.5">
          <div className="w-full p-5 flex flex-row text-left font-semibold bg-bg3 rounded-[8px]">
            <p className="w-[10%] ">No.</p>
            <p className="w-[30%] ">Name</p>
            <p className="w-[30%] ">Captain</p>
            <p className="w-[10%] ">Gender</p>
            <p className="w-[10%] ">Age</p>
            <p className="w-[10%] ">Price</p>
          </div>
          {soldPlayers.map((player, index) => (
            <SoldPlayerListItem
              key={player.id}
              index={index + 1}
              name={player.name}
              captain={player.soldToCaptain?.name || "N/A"}
              gender={player.gender}
              age={player.age}
              price={player.soldPrice || 0}
            />
          ))}
        </div>
      )}
      {listType == "REMAINING" && (
        <div className="flex flex-col gap-0 overflow-auto h-full max-h-91.5">
          <div className="w-full p-5 flex flex-row text-left font-semibold bg-bg3 rounded-[8px]">
            <p className="w-[20%] ">No.</p>
            <p className="w-[40%] ">Name</p>
            <p className="w-[20%] ">Gender</p>
            <p className="w-[20%] ">Age</p>
          </div>
          {remainingPlayers.map((player, index) => (
            <RemainingPlayerListItem
              key={player.id}
              index={index + 1}
              name={player.name}
              gender={player.gender}
              age={player.age}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

export default CompletePlayerListComponent;
