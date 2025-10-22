import React from "react";

function RemainingPlayerListItem({
  index,
  name,
  gender,
  age,
  category,
}: {
  index: number;
  name: string;
  gender: string;
  age: number;
  category: string;
}) {
  return (
    <div
      className={`w-full p-5 flex flex-row text-left ${
        index % 2 == 0 && "bg-bg3"
      } rounded-[8px]`}
    >
      <p className="w-[17.5%] ">{index}</p>
      <p className="w-[30%] ">{name}</p>
      <p className="w-[17.5%] ">
        {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
      </p>
      <p className="w-[17.5%] ">{age}</p>
      <p className="w-[17.5%] ">{category}</p>
    </div>
  );
}

export default RemainingPlayerListItem;
