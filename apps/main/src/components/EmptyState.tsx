/**
 * Responsive Empty State Component
 * Shows when lists/grids have no data
 * TYPOGRAPHY: All text uses inline styles (fontSize, fontWeight)
 */

import { ReactNode, createElement, isValidElement } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  // Legacy alias used in some pages
  message?: string;
  // Current simple action props
  actionLabel?: string;
  onAction?: () => void;
  // Legacy action object shapes used in some pages
  action?: { label: string; onClick: () => void } | ReactNode;
  // Legacy CTA prop names used in some admin pages
  primaryCTA?: { label: string; onClick: () => void } | ReactNode;
  secondaryCTA?: { label: string; onClick: () => void } | ReactNode;
  primaryAction?: { label: string; onClick: () => void } | ReactNode;
  secondaryAction?: { label: string; onClick: () => void } | ReactNode;
  supportAction?: { label: string; onClick: () => void } | ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  message,
  actionLabel,
  onAction,
  action,
  primaryCTA,
  secondaryCTA,
  primaryAction,
  secondaryAction,
  supportAction,
}: EmptyStateProps) {
  const body = description ?? message ?? '';
  const resolvedPrimaryAction =
    primaryAction ??
    primaryCTA ??
    action ??
    (actionLabel && onAction ? { label: actionLabel, onClick: onAction } : undefined);

  const resolvedSecondaryAction = secondaryAction ?? secondaryCTA;

  const iconNode = (() => {
    if (!icon) return null;
    if (isValidElement(icon)) return icon;

    // Lucide icons are often `forwardRef` components, which are *objects* (not functions).
    // Render component-like values via createElement rather than returning the raw value.
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
      return createElement(icon as unknown as LucideIcon, {
        size: 64,
        className: 'text-white/20 sm:w-20 sm:h-20',
      });
    }

    return icon;
  })();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6 sm:p-8">
      <div className="text-center max-w-md mx-auto space-y-4 sm:space-y-6">
        <div className="flex justify-center">
          {iconNode}
        </div>
        
        <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>
          {title}
        </h3>
        
        <p className="text-white/60" style={{ fontSize: '14px' }}>
          {body}
        </p>

        {(resolvedPrimaryAction || resolvedSecondaryAction || supportAction) && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {resolvedPrimaryAction &&
              (typeof resolvedPrimaryAction === 'object' &&
              resolvedPrimaryAction !== null &&
              'onClick' in resolvedPrimaryAction &&
              'label' in resolvedPrimaryAction ? (
                <button
                  onClick={(resolvedPrimaryAction as { label: string; onClick: () => void }).onClick}
                  className="px-6 py-3 bg-hot hover:bg-white text-white hover:text-black rounded-xl transition-colors"
                  style={{ fontSize: '14px', fontWeight: 900 }}
                >
                  {(resolvedPrimaryAction as { label: string; onClick: () => void }).label}
                </button>
              ) : (
                resolvedPrimaryAction as ReactNode
              ))}

            {resolvedSecondaryAction &&
              (typeof resolvedSecondaryAction === 'object' &&
              resolvedSecondaryAction !== null &&
              'onClick' in resolvedSecondaryAction &&
              'label' in resolvedSecondaryAction ? (
                <button
                  onClick={(resolvedSecondaryAction as { label: string; onClick: () => void }).onClick}
                  className="px-6 py-3 border border-white/20 hover:border-white/40 text-white rounded-xl transition-colors"
                  style={{ fontSize: '14px', fontWeight: 900 }}
                >
                  {(resolvedSecondaryAction as { label: string; onClick: () => void }).label}
                </button>
              ) : (
                resolvedSecondaryAction as ReactNode
              ))}

            {supportAction &&
              (typeof supportAction === 'object' &&
              supportAction !== null &&
              'onClick' in supportAction &&
              'label' in supportAction ? (
                <button
                  onClick={(supportAction as { label: string; onClick: () => void }).onClick}
                  className="text-white/70 hover:text-white underline underline-offset-4"
                  style={{ fontSize: '14px', fontWeight: 700 }}
                >
                  {(supportAction as { label: string; onClick: () => void }).label}
                </button>
              ) : (
                supportAction as ReactNode
              ))}
          </div>
        )}
      </div>
    </div>
  );
}