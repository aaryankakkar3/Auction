import React from "react";
import PlayersBreakdown from "@/app/components/PlayersBreakdown";

function RightBar() {
  return (
    <div className="flex flex-col gap-5 w-80 h-full">
      {/* <AveragesStats /> */}
      <PlayersBreakdown />
    </div>
  );
}

export default RightBar;
