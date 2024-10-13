"use client";

import React, { ButtonHTMLAttributes } from "react";

interface CallToActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  disabled?: boolean;
}

const CallToActionButton: React.FC<CallToActionButtonProps> = ({
  children,
  className = "",
  variant = "default",
  disabled = false,
  ...props
}) => {
  const baseClasses = "px-4 py-2 transition-all duration-500 ease-in-out relative overflow-hidden";
  const gradientClasses = "text-black bg-gradient-to-b from-[#1CFF17] via-[#26E915] via-[#2CC912] to-[#0E9713]";
  const hoverOverlayClasses =
    "absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-500 ease-in-out";
  const outlineClasses = "text-[#1CFF17] border-2 border-[#1CFF17] hover:text-black hover:bg-[#1CFF17]";

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

export default CallToActionButton;
