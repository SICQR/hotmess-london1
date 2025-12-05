// HOTMESS LONDON - Navigation Helper
// Converts legacy query-param navigation to RouteId system

import { RouteId } from './routes';

/**
 * Parses legacy ?route= navigation and converts to RouteId
 * Used in pages that still use onNavigate('?route=xxx')
 */
export function parseNavigationRoute(routeString: string): { route: RouteId; params?: Record<string, string> } {
  // Remove leading ? if present
  const cleaned = routeString.startsWith('?') ? routeString.substring(1) : routeString;
  
  // Parse query params
  const urlParams = new URLSearchParams(cleaned);
  const route = urlParams.get('route');
  
  if (!route) {
    // If no ?route param, assume it's a direct RouteId
    return { route: cleaned as RouteId };
  }

  // Convert old route names to new RouteIds
  const routeMap: Record<string, RouteId> = {
    // Legal
    'legal': 'legal',
    'legalTerms': 'legalTerms',
    'legalPrivacy': 'legalPrivacy',
    'legalCookies': 'legalCookies',
    'legalCareDisclaimer': 'legalCareDisclaimer',
    'legal18Plus': 'legal18Plus',
    
    // Data Privacy
    'dataPrivacy': 'dataPrivacy',
    'dataPrivacyDsar': 'dataPrivacyDsar',
    'dataPrivacyDelete': 'dataPrivacyDelete',
    'dataPrivacyExport': 'dataPrivacyExport',
    
    // Support
    'abuseReporting': 'abuseReporting',
    'accessibility': 'accessibility',
    'pressRoom': 'pressRoom',
    'ugcModeration': 'ugcModeration',
    'dmca': 'dmca',
    
    // Main sections
    'care': 'care',
    'shop': 'shop',
    'radio': 'radio',
    'radioSchedule': 'radioSchedule',
    'radioShow': 'radioShow',
    'radioEpisode': 'radioEpisode',
    'community': 'community',
    'affiliate': 'affiliate',
    'hnhMess': 'hnhMess',
    'beacons': 'beacons',
    
    // Shop
    'shopRaw': 'shopRaw',
    'shopHung': 'shopHung',
    'shopHigh': 'shopHigh',
    'shopSuper': 'shopSuper',
    
    // Other
    'home': 'home',
    'account': 'account',
  };

  const mappedRoute = routeMap[route] || route as RouteId;
  
  // Extract any additional params (e.g., slug, id)
  const params: Record<string, string> = {};
  urlParams.forEach((value, key) => {
    if (key !== 'route') {
      params[key] = value;
    }
  });

  return {
    route: mappedRoute,
    params: Object.keys(params).length > 0 ? params : undefined
  };
}

/**
 * Wrapper for onNavigate that handles both old and new styles
 */
export function createNavigationHandler(
  onNavigate: (route: RouteId, params?: Record<string, string>) => void
) {
  return (routeString: string, params?: Record<string, string>) => {
    if (routeString.startsWith('?route=')) {
      const parsed = parseNavigationRoute(routeString);
      onNavigate(parsed.route, parsed.params || params);
    } else {
      onNavigate(routeString as RouteId, params);
    }
  };
}
