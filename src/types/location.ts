/**
 * Location Types for Map and Location Features
 */

// Map region for displaying on maps
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Property marker for map display
export interface PropertyMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  type: 'apartment' | 'house' | 'villa';
  isAvailable: boolean;
}

// Location permission status
export type LocationPermission = 'granted' | 'denied' | 'undetermined';

// User location coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Distance filter options
export interface DistanceFilter {
  maxDistance: number; // in kilometers
  label: string;
}

// Location-based search parameters
export interface LocationSearchParams {
  centerLat: number;
  centerLon: number;
  radiusKm: number;
}
