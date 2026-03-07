"use client";

import Image from "next/image";

type BrandIconProps = {
  size?: "sm" | "md";
  variant?: "solid" | "glass";
  className?: string;
};

export default function BrandIcon({
  size = "md",
  variant = "solid",
  className = "",
}: BrandIconProps) {
  const height = size === "sm" ? 40 : 52;
  const width = Math.round(height * 1.5);

  return (
    <Image
      src="/scalevo_logo.png"
      alt="Scalevo"
      height={height}
      width={width}
      priority
      className={`${variant === "glass" ? "brightness-0 invert" : ""} ${className}`.trim()}
      style={{ objectFit: "contain" }}
    />
  );
}
