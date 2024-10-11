"use client";

import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 transition-all duration-300 ease-in-out";
  const gradientClasses =
    "text-black bg-gradient-to-b from-[#FF3217] via-[#E92E15] to-[#C92712] hover:from-[#FF3217] hover:via-[#E92E15] hover:to-[#971D0E]";
  const outlineClasses = "text-[#FF3217] border-2 border-[#FF3217] hover:text-white hover:bg-[#FF3217]";

  const variantClasses = variant === "outline" ? outlineClasses : gradientClasses;

  return (
    <button className={`${baseClasses} ${variantClasses} salamGreyBox This ${className}`} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
