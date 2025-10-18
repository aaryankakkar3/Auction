"use client";

import Navbar from "@/app/components/Navbar";
import React from "react";
import LeftBar from "./components/LeftBar";
import CenterBar from "@/app/components/CenterBar";
import RightBar from "@/app/components/RightBar";

function page() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-400 h-210 flex flex-col gap-5">
        <Navbar />
        <div className="flex flex-row gap-5 ">
          <LeftBar />
          <CenterBar />
          <RightBar />
        </div>
      </div>
    </div>
  );
}

export default page;
