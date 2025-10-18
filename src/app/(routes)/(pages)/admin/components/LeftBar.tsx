import React from "react";
import PickNextPoolComponent from "./PickNextPoolComponent";
import CompletePlayerListComponent from "@/app/components/CompletePlayerListComponent";

interface PoolOptions {
  [key: string]: boolean;
}

function LeftBar() {
  return (
    <div className="flex flex-col gap-5 w-175">
      <PickNextPoolComponent />
      <CompletePlayerListComponent />
    </div>
  );
}

export default LeftBar;
