import { Property } from '../types';
import { MapRegion } from '../types/location';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted string (e.g., "2.5 km" or "500 m")
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Calculate map region to fit all properties
 * @param properties Array of properties to fit
 * @param padding Padding factor (0.1 = 10% padding)
 * @returns MapRegion to display all properties
 */
export const getRegionForProperties = (
  properties: Property[],
  padding: number = 0.1
): MapRegion => {
  if (properties.length === 0) {
    // Default to Jakarta if no properties
    return {
      latitude: -6.2088,
      longitude: 106.8456,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  // Find min and max coordinates
  let minLat = properties[0].latitude;
  let maxLat = properties[0].latitude;
  let minLon = properties[0].longitude;
  let maxLon = properties[0].longitude;

  properties.forEach((property) => {
    minLat = Math.min(minLat, property.latitude);
    maxLat = Math.max(maxLat, property.latitude);
    minLon = Math.min(minLon, property.longitude);
    maxLon = Math.max(maxLon, property.longitude);
  });

  // Calculate center and deltas
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;
  const latDelta = (maxLat - minLat) * (1 + padding);
  const lonDelta = (maxLon - minLon) * (1 + padding);

  return {
    latitude: centerLat,
    longitude: centerLon,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum delta
    longitudeDelta: Math.max(lonDelta, 0.01),
  };
};

/**
 * Sort properties by distance from a location
 * @param properties Array of properties
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @returns Sorted array of properties
 */
export const sortPropertiesByDistance = (
  properties: Property[],
  userLat: number,
  userLon: number
): Property[] => {
  return [...properties].sort((a, b) => {
    const distanceA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
    const distanceB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
};

/**
 * Filter properties within a certain radius
 * @param properties Array of properties
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Filtered properties within radius
 */
export const filterPropertiesByRadius = (
  properties: Property[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): Property[] => {
  return properties.filter((property) => {
    const distance = calculateDistance(
      centerLat,
      centerLon,
      property.latitude,
      property.longitude
    );
    return distance <= radiusKm;
  });
};

/**
 * Get nearby properties sorted by distance
 * @param properties Array of properties
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param maxDistance Maximum distance in km
 * @returns Nearby properties sorted by distance
 */
export const getNearbyProperties = (
  properties: Property[],
  userLat: number,
  userLon: number,
  maxDistance: number = 10
): Property[] => {
  const nearby = filterPropertiesByRadius(properties, userLat, userLon, maxDistance);
  return sortPropertiesByDistance(nearby, userLat, userLon);
};

/**
 * Check if coordinates are valid
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !isNaN(lat) &&
    !isNaN(lon)
  );
};

/**
 * Get distance category for display
 */
export const getDistanceCategory = (distance: number): string => {
  if (distance < 1) return 'Sangat Dekat';
  if (distance < 3) return 'Dekat';
  if (distance < 5) return 'Cukup Dekat';
  if (distance < 10) return 'Sedang';
  return 'Jauh';
};
