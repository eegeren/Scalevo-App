"use client";

import Image from "next/image";

type BrandIconProps = {
  size?: "sm" | "md";
  variant?: "solid" | "glass";
  className?: string;
};

const sizes = {
  sm: {
    wrapper: "w-8 h-8 rounded-lg",
    image: 16,
  },
  md: {
    wrapper: "w-10 h-10 rounded-xl",
    image: 20,
  },
};

export default function BrandIcon({
  size = "md",
  variant = "solid",
  className = "",
}: BrandIconProps) {
  const current = sizes[size];
  const variantClassName =
    variant === "glass"
      ? "bg-white/20 backdrop-blur-sm"
      : "bg-green-600 shadow-sm";

  return (
    <div
      className={`${current.wrapper} ${variantClassName} flex items-center justify-center ${className}`.trim()}
    >
      <Image
        src="/icon.svg"
        alt="Scalevo logo"
        width={current.image}
        height={current.image}
        priority
      />
    </div>
  );
}
