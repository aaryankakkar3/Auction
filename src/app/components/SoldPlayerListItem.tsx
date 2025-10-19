import React from "react";

function SoldPlayerListItem({
  index,
  name,
  captain,
  gender,
  age,
  price,
}: {
  index: number;
  name: string;
  captain: string;
  gender: string;
  age: number;
  price: number;
}) {
  return (
    <div
      className={`w-full p-5 flex flex-row text-left ${
        index % 2 == 0 && "bg-bg3"
      } rounded-[8px]`}
    >
      <p className="w-[10%] ">{index}</p>
      <p className="w-[30%] ">{name}</p>
      <p className="w-[30%] ">{captain}</p>
      <p className="w-[10%] ">
        {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
      </p>
      <p className="w-[10%] ">{age}</p>
      <p className="w-[10%] ">{price}</p>
    </div>
  );
}

export default SoldPlayerListItem;
