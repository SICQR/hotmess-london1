// components/layouts/PageHeader.tsx
// Brutalist page header component

"use client";

import * as React from "react";
import { typography, spacing } from "@/lib/design-system";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  label,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <header className="space-y-4 md:space-y-5">
      {label && (
        <div className={typography.label + " text-hot"}>
          {label}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          <h1 className={typography.displayMedium}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base opacity-70 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
      
      {children && (
        <div className="pt-2">
          {children}
        </div>
      )}
    </header>
  );
}
