/**
 * ICON LOADER
 * Dynamic lucide-react icon loader for beacon types
 */

import React from 'react';
import {
  QrCode,
  MapPin,
  Users,
  Ticket,
  ShoppingBag,
  Play,
  HeartHandshake,
  Activity,
  BadgeInfo,
  Lock,
  LocateFixed,
  ShieldAlert,
  Share2,
  Bookmark,
  HelpCircle,
} from 'lucide-react';
import { IconName } from './beaconTypes';

// Map of icon names to lucide-react components
const ICON_MAP = {
  QrCode,
  MapPin,
  Users,
  Ticket,
  ShoppingBag,
  Play,
  HeartHandshake,
  Activity,
  BadgeInfo,
  Lock,
  LocateFixed,
  ShieldAlert,
  Share2,
  Bookmark,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, className, style }: IconProps) {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <HelpCircle size={size} className={className} style={style} />;
  }

  return <IconComponent size={size} className={className} style={style} />;
}