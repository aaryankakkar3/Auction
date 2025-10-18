import React from "react";

function RemainingPlayerListItem({
  index,
  name,
  gender,
  age,
}: {
  index: number;
  name: string;
  gender: string;
  age: number;
}) {
  return (
    <div
      className={`w-full p-5 flex flex-row text-left ${
        index % 2 == 0 && "bg-bg3"
      } rounded-[8px]`}
    >
      <p className="w-[20%] ">{index}</p>
      <p className="w-[40%] ">{name}</p>
      <p className="w-[20%] ">{gender}</p>
      <p className="w-[20%] ">{age}</p>
    </div>
  );
}

export default RemainingPlayerListItem;
