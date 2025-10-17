import Section from "@/app/components/ui/Section";
import React from "react";
import PoolOption from "./PoolOption";
import Button from "@/app/components/ui/Button";

function PickNextPoolComponent({
  mensPoolOptions,
  womensPoolOptions,
  handleMensToggle,
  handleWomensToggle,
  onStart,
}: {
  mensPoolOptions: { [key: string]: boolean };
  womensPoolOptions: { [key: string]: boolean };
  handleMensToggle: (option: string) => void;
  handleWomensToggle: (option: string) => void;
  onStart: () => void;
}) {
  return (
    <Section className="w-full">
      <p className="text-center font-semibold">Pick next pool</p>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(mensPoolOptions).map(([option, isSelected]) => (
            <PoolOption
              key={option}
              option={option}
              isSelected={isSelected}
              onToggle={handleMensToggle}
            />
          ))}
        </div>
        <div className="h-full w-[1px] bg-text2"></div>
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(womensPoolOptions).map(([option, isSelected]) => (
            <PoolOption
              key={option}
              option={option}
              isSelected={isSelected}
              onToggle={handleWomensToggle}
            />
          ))}
        </div>
      </div>
      <Button className="bg-accent1 px-5 py-2.5 m-auto" onClick={onStart}>
        Start
      </Button>
    </Section>
  );
}

export default PickNextPoolComponent;
