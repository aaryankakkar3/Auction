import React from "react";
import Button from "./ui/Button";

function Navbar() {
  return (
    <div className="w-full h-fit flex flex-row justify-between p-5 rounded-2xl bg-gradient-to-br from-[#2F3336] to-[#22262B]">
      <h1 className="text-[32px]">GBL</h1>
      <div className="flex flex-row gap-5 items-center">
        <p className="">Admin</p>
        <div className="flex flex-row gap-0 bg-bg1 rounded-[8px]">
          <Button className="bg-accent1 px-5 py-2.5">Admin</Button>
          <Button className="bg-accent2 px-5 py-2.5">Captain</Button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
