import React from "react";
import Section from "./ui/Section";
import Button from "./ui/Button";

function CompletePlayerListComponent() {
  const playerData = [
    { name: "Player 1", captain: "Sold", price: 2500, gender: "M", age: 28 },
    { name: "Player 2", captain: "Unsold", price: 1500, gender: "F", age: 25 },
  ];
  return (
    <Section>
      <div className="flex flex-row justify-between">
        <p className="font-semibold">Players</p>
        <div className="flex flex-row gap-0 rounded-[8px]">
          <Button className="px-5 py-1.25 bg-accent1">Sold</Button>
          <Button className="px-5 py-1.25 bg-bg1">Unsold</Button>
        </div>
      </div>
      <div className="flex flex-col gap-0"></div>
    </Section>
  );
}

export default CompletePlayerListComponent;
