"use client";

import Navbar from "@/app/components/Navbar";
import React from "react";
import LeftBar from "./components/LeftBar";
import CenterBar from "@/app/components/CenterBar";
import RightBar from "./components/RightBar";

function page() {
  const [adminMode, setAdminMode] = React.useState(true);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-400 h-210 flex flex-col gap-5">
        <Navbar adminMode={adminMode} setAdminMode={setAdminMode} />
        <div className="flex flex-row gap-5 h-full">
          <LeftBar />
          <CenterBar clearance="admin" />
          <RightBar />
        </div>
      </div>
    </div>
  );
}

export default page;
