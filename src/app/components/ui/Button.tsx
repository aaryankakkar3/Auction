import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${className} h-fit w-fit rounded-[8px] hover:cursor-pointer hover:opacity-80`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
