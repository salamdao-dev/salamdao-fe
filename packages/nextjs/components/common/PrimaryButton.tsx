"use client";

import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className = "",
  variant = "default",
  disabled = false,
  ...props
}) => {
  const baseClasses = "px-4 py-2 transition-all duration-200 ease-in-out relative overflow-hidden";
  const gradientClasses = "text-black bg-gradient-to-b from-[#FF3217] via-[#E92E15] to-[#C92712]";
  const hoverOverlayClasses =
    "absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-500 ease-in-out";
  const outlineClasses = "text-[#FF3217] border-2 border-[#FF3217] hover:text-white hover:bg-[#FF3217]";

  const variantClasses = variant === "outline" ? outlineClasses : gradientClasses;
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${disabledClasses} salamGreyBox ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className={hoverOverlayClasses}></span>
      {children}
    </button>
  );
};

export default PrimaryButton;
