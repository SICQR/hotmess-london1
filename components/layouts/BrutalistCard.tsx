// components/layouts/BrutalistCard.tsx
// Reusable brutalist card component

"use client";

import * as React from "react";
import { cards, cn } from "@/lib/design-system";

interface BrutalistCardProps {
  children: React.ReactNode;
  variant?: "base" | "interactive" | "section" | "error";
  className?: string;
  onClick?: () => void;
  as?: "div" | "article" | "section";
}

export function BrutalistCard({
  children,
  variant = "base",
  className,
  onClick,
  as: Component = "div",
}: BrutalistCardProps) {
  const baseClasses = cards[variant];
  
  return (
    <Component
      className={cn(baseClasses, className)}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
