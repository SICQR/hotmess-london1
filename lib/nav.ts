// lib/nav.ts
// Navigation builder - dynamically constructs nav based on user state
// Uses route registry to prevent drift

import { ROUTES, RouteDef, RouteId } from "@/lib/routes";

export interface NavSection {
  primary: RouteDef[];
  utility: RouteDef[];
  admin: RouteDef[];
}

export interface NavBuilderOptions {
  isAuthed: boolean;
  isAdmin: boolean;
}

/**
 * Build navigation sections based on user state
 * Filters routes by auth/admin requirements and nav group
 */
export function buildNav(opts: NavBuilderOptions): NavSection {
  const allRoutes = Object.values(ROUTES);

  const isAllowed = (route: RouteDef): boolean => {
    // Admin routes require admin
    if (route.admin && !opts.isAdmin) return false;

    // Auth routes require auth
    if (route.auth && !opts.isAuthed) return false;

    return true;
  };

  return {
    primary: allRoutes.filter(
      (r) => r.group === "primary" && isAllowed(r)
    ),
    utility: allRoutes.filter(
      (r) => r.group === "utility" && isAllowed(r)
    ),
    admin: allRoutes.filter(
      (r) => r.group === "admin" && isAllowed(r)
    ),
  };
}

/**
 * Get specific route by ID with safety check
 */
export function getNavRoute(id: RouteId): RouteDef | null {
  return ROUTES[id] || null;
}

/**
 * Build breadcrumbs for a given route
 */
export function buildBreadcrumbs(routeId: RouteId): RouteDef[] {
  const route = ROUTES[routeId];
  if (!route) return [];

  const breadcrumbs: RouteDef[] = [];

  // Always start with home (except if already home)
  if (routeId !== "home") {
    breadcrumbs.push(ROUTES.home);
  }

  // Add parent routes based on hierarchy
  const href = route.href;

  if (href.startsWith("/tickets/listing/")) {
    breadcrumbs.push(ROUTES.tickets);
  } else if (href.startsWith("/tickets/") && routeId !== "tickets") {
    breadcrumbs.push(ROUTES.tickets);
  } else if (href.startsWith("/records/releases/") && routeId !== "recordsReleases") {
    breadcrumbs.push(ROUTES.records);
    breadcrumbs.push(ROUTES.recordsReleases);
  } else if (href.startsWith("/records/") && routeId !== "records") {
    breadcrumbs.push(ROUTES.records);
  } else if (href.startsWith("/admin/records")) {
    breadcrumbs.push(ROUTES.admin);
    breadcrumbs.push(ROUTES.adminRecords);
  } else if (href.startsWith("/admin/") && routeId !== "admin") {
    breadcrumbs.push(ROUTES.admin);
  } else if (href.startsWith("/account/") && routeId !== "account") {
    breadcrumbs.push(ROUTES.account);
  } else if (href.startsWith("/shop/") && routeId !== "shop") {
    breadcrumbs.push(ROUTES.shop);
  } else if (href.startsWith("/messmarket/") && routeId !== "messmarket") {
    breadcrumbs.push(ROUTES.messmarket);
  } else if (href.startsWith("/radio/") && routeId !== "radio") {
    breadcrumbs.push(ROUTES.radio);
  } else if (href.startsWith("/community/") && routeId !== "community") {
    breadcrumbs.push(ROUTES.community);
  }

  // Add current route
  breadcrumbs.push(route);

  return breadcrumbs;
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(routeId: RouteId, opts: NavBuilderOptions): boolean {
  const route = ROUTES[routeId];
  if (!route) return false;

  if (route.admin && !opts.isAdmin) return false;
  if (route.auth && !opts.isAuthed) return false;

  return true;
}
