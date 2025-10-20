// Google Maps Configuration
// Get your API key from: https://console.cloud.google.com/google/maps-apis
// Enable Maps JavaScript API and Places API
// Restrict by HTTP referrer for security

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

export const MAP_CONFIG = {
  defaultCenter: { lat: 20, lng: 0 },
  defaultZoom: 2,
  minZoom: 2,
  maxZoom: 18,
  
  // Map styling options
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#1a1a2e" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a1a2e" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#8b92a8" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0f1629" }]
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#2d3748" }]
    }
  ]
};
