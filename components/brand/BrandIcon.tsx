"use client";

import { Zap } from "lucide-react";

type BrandIconProps = {
  size?: "sm" | "md";
  variant?: "solid" | "glass";
  className?: string;
};

const sizes = {
  sm: { wrapper: "w-8 h-8 rounded-lg", icon: 16 },
  md: { wrapper: "w-10 h-10 rounded-xl", icon: 20 },
};

export default function BrandIcon({
  size = "md",
  variant = "solid",
  className = "",
}: BrandIconProps) {
  const current = sizes[size];
  const variantClassName =
    variant === "glass" ? "bg-white/20 backdrop-blur-sm" : "bg-green-600 shadow-sm";

  return (
    <div className={`${current.wrapper} ${variantClassName} flex items-center justify-center ${className}`.trim()}>
      <Zap size={current.icon} className="text-white" />
    </div>
  );
}
