import React from "react";

interface PoolOptionProps {
  option: string;
  isSelected: boolean;
  onToggle: (option: string) => void;
}

function PoolOption({ option, isSelected, onToggle }: PoolOptionProps) {
  return (
    <div className="flex flex-row justify-between">
      <p className="">{option}</p>
      <button
        className={`w-5 h-5 rounded-full hover:cursor-pointer ${
          isSelected ? "bg-accent1" : "bg-text2"
        }`}
        onClick={() => onToggle(option)}
      />
    </div>
  );
}

export default PoolOption;
