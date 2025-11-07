export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export const LOCATION_COORDINATES: Record<string, LocationCoordinates> = {
  'Downtown Toronto': { lat: 43.6532, lng: -79.3832 },
  'North York': { lat: 43.7615, lng: -79.4111 },
  'Scarborough': { lat: 43.7731, lng: -79.2577 },
  'Markham': { lat: 43.8561, lng: -79.3370 },
  'Mississauga': { lat: 43.5890, lng: -79.6441 },
  'Etobicoke': { lat: 43.6205, lng: -79.5132 },
  'Richmond Hill': { lat: 43.8828, lng: -79.4403 },
};

export function getLocationCoordinates(locationName: string): LocationCoordinates | null {
  if (LOCATION_COORDINATES[locationName]) {
    return LOCATION_COORDINATES[locationName];
  }
  
  const lowerName = locationName.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (key.toLowerCase() === lowerName) {
      return coords;
    }
  }
  
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  return LOCATION_COORDINATES['Downtown Toronto'];
}

export function getCenterPoint(from: LocationCoordinates, to: LocationCoordinates): LocationCoordinates {
  return {
    lat: (from.lat + to.lat) / 2,
    lng: (from.lng + to.lng) / 2,
  };
}

export function calculateZoom(from: LocationCoordinates, to: LocationCoordinates): number {
  const latDiff = Math.abs(from.lat - to.lat);
  const lngDiff = Math.abs(from.lng - to.lng);
  const maxDiff = Math.max(latDiff, lngDiff);
  
  if (maxDiff > 0.3) return 9;
  if (maxDiff > 0.15) return 10;
  if (maxDiff > 0.08) return 11;
  if (maxDiff > 0.04) return 12;
  return 13;
}

