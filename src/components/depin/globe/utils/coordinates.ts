import * as THREE from 'three';

export const GLOBE_RADIUS = 2;

/**
 * Convert latitude and longitude to 3D Cartesian coordinates
 */
export const latLngToVector3 = (
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS
): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
};

/**
 * Parse location string to lat/lng coordinates
 */
export const parseLocation = (location: string): { lat: number; lng: number } | null => {
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'California, USA': { lat: 36.7783, lng: -119.4179 },
    'Texas, USA': { lat: 31.9686, lng: -99.9018 },
    'New York, USA': { lat: 40.7128, lng: -74.0060 },
    'London, UK': { lat: 51.5074, lng: -0.1278 },
    'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
    'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
    'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
    'Mumbai, India': { lat: 19.0760, lng: 72.8777 },
    'São Paulo, Brazil': { lat: -23.5505, lng: -46.6333 },
    'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
  };

  return locationMap[location] || null;
};

/**
 * Get random location coordinates for demo devices
 */
export const getRandomLocation = (): { lat: number; lng: number } => {
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;
  return { lat, lng };
};
