// components/ui/sonner.tsx
// Vite/React-friendly Sonner wrapper (no next-themes dependency)

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(15, 15, 16, 0.9)",
          "--normal-text": "rgba(255, 255, 255, 0.92)",
          "--normal-border": "rgba(255, 255, 255, 0.10)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
