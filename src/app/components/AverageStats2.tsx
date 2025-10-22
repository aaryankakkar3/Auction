import React from "react";
import Section from "./ui/Section";

function AveragesStats2({
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
        Combined average player cost presently: $
        {statsData.combinedAveragePlayerCost}
      </p>
      <p className="">
        Your average player cost presently: ${statsData.yourAveragePlayerCost}
      </p>
    </Section>
  );
}

export default AveragesStats2;
