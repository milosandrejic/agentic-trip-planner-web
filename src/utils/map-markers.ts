import { getActivityKind } from "@/utils/activity-display";

import { brandColors } from "@/theme/palette";

import type { Itinerary } from "@/types/itinerary";

/** The three marker groups the design's legend names. */
export type MapMarkerKind = "attraction" | "hotel" | "restaurant";

export interface MapMarker {
  id: string;
  kind: MapMarkerKind;
  latitude: number;
  longitude: number;
  title: string;
}

export interface MapBounds {
  latitude: number;
  longitude: number;
}

export const mapMarkerColors: Record<MapMarkerKind, string> = {
  attraction: brandColors.navy,
  hotel: brandColors.teal,
  restaurant: brandColors.orange,
};

export const mapMarkerLabels: Record<MapMarkerKind, string> = {
  attraction: "Attraction",
  hotel: "Hotel",
  restaurant: "Restaurant",
};

export const mapMarkerKinds: readonly MapMarkerKind[] = ["hotel", "attraction", "restaurant"];

/** Coordinates default to 0 when the planner has none; (0, 0) is not a real place here. */
function hasCoordinates(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }

  return latitude !== 0 || longitude !== 0;
}

export function buildMapMarkers(itinerary: Itinerary): MapMarker[] {
  const markers: MapMarker[] = [];

  for (const hotel of itinerary.hotels) {
    if (hasCoordinates(hotel.latitude, hotel.longitude)) {
      markers.push({
        id: `hotel-${hotel.id}`,
        kind: "hotel",
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        title: hotel.name,
      });
    }
  }

  for (const day of itinerary.days) {
    for (const activity of day.activities) {
      if (!hasCoordinates(activity.latitude, activity.longitude)) {
        continue;
      }

      const activityKind = getActivityKind(activity);

      markers.push({
        id: `activity-${activity.id}`,
        kind: activityKind === "dining" ? "restaurant" : "attraction",
        latitude: activity.latitude,
        longitude: activity.longitude,
        title: activity.description,
      });
    }
  }

  return markers;
}

export function getMapCenter(markers: readonly MapMarker[]): MapBounds | null {
  if (markers.length === 0) {
    return null;
  }

  const total = markers.reduce(
    (accumulator, marker) => ({
      latitude: accumulator.latitude + marker.latitude,
      longitude: accumulator.longitude + marker.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: total.latitude / markers.length,
    longitude: total.longitude / markers.length,
  };
}

/**
 * The design's pin: a 36px teardrop in the marker colour with a white rim.
 *
 * Returned as an inline SVG data URI so Google Maps can use it as a marker icon.
 */
export function createMarkerIcon(kind: MapMarkerKind): string {
  const color = mapMarkerColors[kind];
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">',
    `<path d="M18 1.5C9.44 1.5 2.5 8.44 2.5 17c0 11.1 13.02 25.2 14.06 26.3a1.98 1.98 0 0 0 2.88 0C20.48 42.2 33.5 28.1 33.5 17c0-8.56-6.94-15.5-15.5-15.5z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>`,
    '<circle cx="18" cy="17" r="5.5" fill="#ffffff" opacity="0.9"/>',
    "</svg>",
  ].join("");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
