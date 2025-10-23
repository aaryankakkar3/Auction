"use client";

import CenterBar from "@/app/components/CenterBar";
import Navbar from "@/app/components/Navbar";
import RightBar from "./components/RightBar";
import React from "react";
import LeftBar from "./components/LeftBar";
import AlternateLeftBar from "./components/AlternateLeftBar";

function page({ params }: { params: Promise<{ captain: string }> }) {
  const [personalMode, setPersonalMode] = React.useState(true);
  const resolvedParams = React.use(params);
  const [captainView, setCaptainView] = React.useState(resolvedParams.captain);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-400 h-210 flex flex-col gap-5">
        <Navbar
          captainUsername={resolvedParams.captain}
          personalMode={personalMode}
          setPersonalMode={setPersonalMode}
        />
        <div className="flex flex-row gap-5 h-full">
          {personalMode && (
            <LeftBar
              captainView={captainView}
              setCaptainView={setCaptainView}
              pageOwnerCaptain={resolvedParams.captain}
            />
          )}
          {!personalMode && <AlternateLeftBar />}
          <CenterBar clearance="captain" />
          <RightBar captainView={captainView} />
        </div>
      </div>
    </div>
  );
}

export default page;
