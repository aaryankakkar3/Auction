"use client";

import Navbar from "@/app/components/Navbar";
import React from "react";
import LeftBar from "./components/LeftBar";
import CenterBar from "@/app/components/CenterBar";
import RightBar from "@/app/components/RightBar";

function page() {
  const [mensPoolOptions, setMensPoolOptions] = React.useState({
    "Men's Under 17": false,
    "Men's Open": false,
    "Men's 40+": false,
    "Men's 60+": false,
  });
  const [womensPoolOptions, setWomensPoolOptions] = React.useState({
    "Women's Under 17": false,
    "Women's Open": false,
    "Women's 40+": false,
    "Women's 60+": false,
  });

  const handleMensToggle = (option: string) => {
    setMensPoolOptions({
      ...mensPoolOptions,
      [option]: !mensPoolOptions[option as keyof typeof mensPoolOptions],
    });
  };

  const handleWomensToggle = (option: string) => {
    setWomensPoolOptions({
      ...womensPoolOptions,
      [option]: !womensPoolOptions[option as keyof typeof womensPoolOptions],
    });
  };

  const handleStart = () => {
    console.log("Start button clicked!");
    // Add your start logic here
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-400 h-210 flex flex-col gap-5">
        <Navbar />
        <div className="flex flex-row gap-5 ">
          <LeftBar
            mensPoolOptions={mensPoolOptions}
            womensPoolOptions={womensPoolOptions}
            handleMensToggle={handleMensToggle}
            handleWomensToggle={handleWomensToggle}
            onStart={handleStart}
          />
          <CenterBar />
          <RightBar />
        </div>
      </div>
    </div>
  );
}

export default page;
