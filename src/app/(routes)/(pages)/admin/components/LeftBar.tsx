import React from "react";
import PickNextPoolComponent from "./PickNextPoolComponent";
import CompletePlayerListComponent from "@/app/components/CompletePlayerListComponent";

function LeftBar() {
  return (
    <div className="flex flex-col gap-5 w-175 h-full">
      <PickNextPoolComponent />
      <CompletePlayerListComponent isAdmin={true} />
    </div>
  );
}

export default LeftBar;
