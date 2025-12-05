/**
 * GPS VERIFICATION UTILITIES
 * 
 * Handles location permissions and proximity verification for beacons.
 * Privacy-first: only used when beacon requires GPS verification.
 */

/**
 * Request location permission from the user
 * Returns true if granted, false otherwise
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return false;
    }

    // Try to check current permission state
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (result.state === 'granted') {
          return true;
        }
        
        if (result.state === 'denied') {
          return false;
        }
      } catch (e) {
        // Some browsers don't support permissions.query for geolocation
        console.log('Permissions API not available, requesting directly');
      }
    }
    
    // Request permission by getting position
    await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000, // Use cached position if less than 1 min old
      });
    });
    
    return true;
  } catch (error: any) {
    console.error('Location permission error:', error);
    
    // Check error code
    if (error?.code === 1) {
      // PERMISSION_DENIED
      return false;
    }
    
    // Other errors (timeout, unavailable) - treat as denied
    return false;
  }
}

/**
 * Verify user is within specified distance of beacon coordinates
 * 
 * @param beaconLat - Beacon latitude
 * @param beaconLng - Beacon longitude
 * @param maxDistanceMeters - Maximum distance in meters (default: 100m)
 * @returns true if within range, false otherwise
 */
export async function verifyProximity(
  beaconLat: number | null | undefined,
  beaconLng: number | null | undefined,
  maxDistanceMeters: number = 100
): Promise<boolean> {
  // If no coordinates, bypass GPS check
  if (!beaconLat || !beaconLng) {
    return true;
  }

  try {
    // Get current position with high accuracy
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Don't use cached position for proximity check
      });
    });
    
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(userLat, userLng, beaconLat, beaconLng);
    
    console.log(`Distance to beacon: ${distance.toFixed(0)}m (max: ${maxDistanceMeters}m)`);
    
    return distance <= maxDistanceMeters;
  } catch (error) {
    console.error('GPS verification error:', error);
    return false;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Get user's current coordinates (if permission granted)
 * Returns null if permission denied or error
 */
export async function getCurrentCoordinates(): Promise<{ lat: number; lng: number } | null> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
    });
    
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (error) {
    console.error('Get coordinates error:', error);
    return null;
  }
}
