// lib/beaconActions.ts
// Beacon action sheet CTA mapping
// Determines primary action for each beacon type

import { buildPath } from "@/lib/routes";

export interface BeaconCTA {
  label: string;
  href: string;
  variant?: "default" | "outline" | "destructive";
}

export interface BeaconData {
  id: string;
  type: string;
  target_slug?: string | null;
  name?: string;
}

/**
 * Get primary CTA for a beacon based on its type
 * Includes Records/SoundCloud routing
 */
export function getBeaconPrimaryCTA(beacon: BeaconData): BeaconCTA {
  switch (beacon.type) {
    case "ticket":
      return {
        label: "View Tickets",
        href: buildPath("ticketsBeacon", { beaconId: beacon.id }),
      };

    case "product_drop":
    case "content_release":
      // Records: beacon stores release slug in target_slug
      if (beacon.target_slug) {
        return {
          label: "View Release",
          href: buildPath("recordsRelease", { slug: beacon.target_slug }),
        };
      }
      return {
        label: "Browse Releases",
        href: buildPath("recordsReleases"),
      };

    case "live_radio":
      return {
        label: "Listen Live",
        href: buildPath("radio"),
      };

    case "venue":
      return {
        label: "View on Map",
        href: buildPath("map"),
      };

    case "community_post":
      return {
        label: "View Community",
        href: buildPath("community"),
      };

    case "care_resource":
      return {
        label: "View Resources",
        href: buildPath("care"),
      };

    default:
      return {
        label: "View Beacon",
        href: buildPath("beacons"),
      };
  }
}

/**
 * Get secondary actions for a beacon
 */
export function getBeaconSecondaryActions(beacon: BeaconData): BeaconCTA[] {
  const actions: BeaconCTA[] = [];

  // Map view (all beacons)
  actions.push({
    label: "View on Map",
    href: buildPath("map"),
    variant: "outline",
  });

  // Type-specific actions
  if (beacon.type === "ticket") {
    actions.push({
      label: "My Tickets",
      href: buildPath("myTickets"),
      variant: "outline",
    });
  }

  if (beacon.type === "product_drop" || beacon.type === "content_release") {
    actions.push({
      label: "All Releases",
      href: buildPath("recordsReleases"),
      variant: "outline",
    });
  }

  return actions;
}

/**
 * Check if beacon type requires auth
 */
export function beaconRequiresAuth(beaconType: string): boolean {
  const authRequired = new Set([
    "ticket", // Can't message seller without auth
    "connect", // Dating/hookups require auth
  ]);

  return authRequired.has(beaconType);
}

/**
 * Get beacon type display name
 */
export function getBeaconTypeLabel(beaconType: string): string {
  const labels: Record<string, string> = {
    ticket: "Ticket",
    product_drop: "Product Drop",
    content_release: "Release",
    live_radio: "Radio",
    venue: "Venue",
    community_post: "Community",
    care_resource: "Care",
    connect: "Connect",
  };

  return labels[beaconType] || "Beacon";
}
