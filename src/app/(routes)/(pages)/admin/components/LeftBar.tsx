import React from "react";
import PickNextPoolComponent from "./PickNextPoolComponent";
import CompletePlayerListComponent from "@/app/components/CompletePlayerListComponent";

interface PoolOptions {
  [key: string]: boolean;
}

interface LeftBarProps {
  mensPoolOptions: PoolOptions;
  womensPoolOptions: PoolOptions;
  handleMensToggle: (option: string) => void;
  handleWomensToggle: (option: string) => void;
  onStart: () => void;
}

function LeftBar({
  mensPoolOptions,
  womensPoolOptions,
  handleMensToggle,
  handleWomensToggle,
  onStart,
}: LeftBarProps) {
  return (
    <div className="flex flex-col gap-5 w-175">
      <PickNextPoolComponent
        mensPoolOptions={mensPoolOptions}
        womensPoolOptions={womensPoolOptions}
        handleMensToggle={handleMensToggle}
        handleWomensToggle={handleWomensToggle}
        onStart={onStart}
      />
      <CompletePlayerListComponent />
    </div>
  );
}

export default LeftBar;
