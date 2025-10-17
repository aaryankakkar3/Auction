import React from "react";

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-5 rounded-2xl p-5 h-fit bg-gradient-to-br from-[#2F3336] to-[#22262B] ${className}`}
    >
      {children}
    </div>
  );
}

export default Section;
