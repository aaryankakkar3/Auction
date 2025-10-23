import React from "react";
import AveragesStats from "../../../../../components/AveragesStats";
import PlayersBreakdown from "../../../../../components/PlayersBreakdown";
import MyTeam from "@/app/components/MyTeam";
import ChooseProfile from "@/app/components/ChooseProfile";
import MyStats from "@/app/components/MyStats";
import TeamStrengthGraph from "@/app/components/TeamStrengthGraph";

function LeftBar({
  captainView,
  setCaptainView,
  pageOwnerCaptain,
}: {
  captainView: string;
  setCaptainView: React.Dispatch<React.SetStateAction<string>>;
  pageOwnerCaptain: string;
}) {
  return (
    <div className="flex flex-row gap-5 w-175 h-186">
      <div className="flex flex-col gap-5 w-80 h-full">
        <ChooseProfile
          captainView={captainView}
          setCaptainView={setCaptainView}
          pageOwnerCaptain={pageOwnerCaptain}
        />
        <MyStats captainView={captainView} />
        <TeamStrengthGraph captainView={captainView} />
      </div>
      <MyTeam captainView={captainView} />
    </div>
  );
}

export default LeftBar;
