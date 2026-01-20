"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const LampContainer = ({
  children,
  className,
  mode = "dark"
}: {
  children?: React.ReactNode;
  className?: string;
  mode?: "dark" | "light";
}) => {
  const isLight = mode === "light";

  return (
    <div
      className={cn(
        "relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden w-full z-0 py-20 md:py-32",
        isLight ? "bg-[#e3ebf2]" : "bg-[#010816]",
        className
      )}
    >
      <div className="relative z-50 flex flex-col items-center px-8 md:px-12 w-full">
        {children}
      </div>
    </div>
  );
};
