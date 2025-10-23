"use client";

import Navbar from "@/app/components/Navbar";
import React from "react";
import AdminLeftBar from "./components/LeftBar";
import CenterBar from "@/app/components/CenterBar";
import AdminRightBar from "./components/RightBar";
import CaptainLeftBar from "../captain/[captain]/components/LeftBar";
import CaptainRightBar from "../captain/[captain]/components/RightBar";

function page() {
  const [adminMode, setAdminMode] = React.useState(true);
  const [captainView, setCaptainView] = React.useState("");
  const [captainsLoaded, setCaptainsLoaded] = React.useState(false);

  // Fetch first captain when switching to captain mode
  React.useEffect(() => {
    const fetchFirstCaptain = async () => {
      if (!adminMode && !captainsLoaded) {
        try {
          const response = await fetch("/api/getAllCaptains");
          const result = await response.json();

          if (result.success && result.data.length > 0) {
            setCaptainView(result.data[0].username);
            setCaptainsLoaded(true);
            console.log(
              "🎯 Admin captain mode: Set default captain to",
              result.data[0].username
            );
          } else {
            console.error("No captains found for admin captain mode");
          }
        } catch (error) {
          console.error("Error fetching captains for admin mode:", error);
        }
      }
    };

    fetchFirstCaptain();
  }, [adminMode, captainsLoaded]);

  // Reset captain view when switching back to admin mode
  React.useEffect(() => {
    if (adminMode) {
      setCaptainsLoaded(false);
      setCaptainView("");
    }
  }, [adminMode]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-400 h-210 flex flex-col gap-5">
        <Navbar adminMode={adminMode} setAdminMode={setAdminMode} />
        <div className="flex flex-row gap-5 h-full">
          {adminMode && <AdminLeftBar />}
          {!adminMode && captainView && (
            <CaptainLeftBar
              captainView={captainView}
              setCaptainView={setCaptainView}
              pageOwnerCaptain="admin"
            />
          )}
          <CenterBar clearance="admin" />
          {adminMode && <AdminRightBar />}
          {!adminMode && captainView && (
            <CaptainRightBar captainView={captainView} />
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
