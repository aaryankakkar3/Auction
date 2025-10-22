import React from "react";
import Section from "./ui/Section";

function AveragesStats({
  captainView,
  statsData,
}: {
  captainView: string;
  statsData: any;
}) {
  if (!statsData) {
    return (
      <Section className="gap-5 h-full text-[20px]">
        <p>Loading stats...</p>
      </Section>
    );
  }

  return (
    <Section className="gap-5 h-full text-[20px]">
      <p className="">
        Combined average player cost for remaining players: $
        {statsData.combinedAverageRemainingPlayerCost}
      </p>
      <p className="">
        Ideal average player cost: ${statsData.idealAveragePlayerCost}
      </p>
    </Section>
  );
}

export default AveragesStats;
