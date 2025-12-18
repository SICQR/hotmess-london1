// components/layouts/BrutalistButton.tsx
// Reusable brutalist button component

"use client";

import * as React from "react";
import { buttons, cn } from "@/lib/design-system";

interface BrutalistButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "primarySmall" | "secondarySmall";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export function BrutalistButton({
  children,
  variant = "secondary",
  className,
  onClick,
  disabled,
  href,
  icon,
  type = "button",
}: BrutalistButtonProps) {
  const baseClasses = buttons[variant];
  const combinedClasses = cn(baseClasses, className);
  
  const content = (
    <>
      {icon && <span className="inline-flex mr-2">{icon}</span>}
      {children}
    </>
  );
  
  if (href && !disabled) {
    return (
      <a href={href} className={combinedClasses}>
        {content}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
