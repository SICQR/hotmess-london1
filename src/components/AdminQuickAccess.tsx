/**
 * Admin Quick Access - Floating button for dev/admin mode
 * Includes dev bypass toggles for testing
 */

import { RouteId } from '../lib/routes';

interface AdminQuickAccessProps {
  onNavigate: (route: RouteId) => void;
}

export function AdminQuickAccess({ onNavigate }: AdminQuickAccessProps) {
  void onNavigate;
  return null;
}