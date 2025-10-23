import React from "react";
import CompletPlayerList from "@/app/components/CompletePlayerListComponent";

function AlternateLeftBar() {
  return (
    <div className="flex flex-row gap-5 w-175 h-186">
      <CompletPlayerList />
    </div>
  );
}

export default AlternateLeftBar;
