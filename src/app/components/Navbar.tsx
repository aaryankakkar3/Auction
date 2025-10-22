import React from "react";
import Button from "./ui/Button";

function Navbar({
  captainUsername,
  personalMode,
  setPersonalMode,
  adminMode,
  setAdminMode,
}: {
  captainUsername?: string;
  personalMode?: boolean;
  setPersonalMode?: React.Dispatch<React.SetStateAction<boolean>>;
  adminMode?: boolean;
  setAdminMode?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full h-fit flex flex-row justify-between p-5 rounded-2xl bg-gradient-to-br from-[#2F3336] to-[#22262B]">
      <h1 className="text-[32px]">GBL</h1>
      <div className="flex flex-row gap-5 items-center">
        <p className="">{captainUsername || "Admin"}</p>
        {!captainUsername && (
          <div className={`flex flex-row gap-0 bg-bg1 rounded-[8px]`}>
            <Button
              className={`px-5 py-2.5 ${adminMode ? "bg-accent1" : "bg-bg1"}`}
              onClick={() => setAdminMode?.(true)}
            >
              Admin
            </Button>
            <Button
              className={`px-5 py-2.5 ${!adminMode ? "bg-accent1" : "bg-bg1"}`}
              onClick={() => setAdminMode?.(false)}
            >
              Captain
            </Button>
          </div>
        )}
        {captainUsername && (
          <div className="flex flex-row gap-0 bg-bg1 rounded-[8px]">
            <Button
              className={`px-5 py-2.5 ${
                personalMode ? "bg-accent1" : "bg-bg1"
              }`}
              onClick={() => setPersonalMode?.(true)}
            >
              Personal
            </Button>
            <Button
              className={`px-5 py-2.5 ${
                !personalMode ? "bg-accent1" : "bg-bg1"
              }`}
              onClick={() => setPersonalMode?.(false)}
            >
              Player List
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
