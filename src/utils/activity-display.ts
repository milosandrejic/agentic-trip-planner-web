import type { Activity } from "@/types/itinerary";

/**
 * Coarse activity classification derived from Google place `categories`.
 *
 * Drives the timeline icon and marker colour; the API has no explicit type field.
 */
export type ActivityKind = "attraction" | "dining" | "lodging" | "transport";

const diningCategories = new Set([
  "bar",
  "cafe",
  "food",
  "bakery",
  "restaurant",
  "meal_delivery",
  "meal_takeaway",
]);

const lodgingCategories = new Set([
  "hotel",
  "lodging",
  "motel",
  "guest_house",
  "resort_hotel",
]);

const transportCategories = new Set([
  "airport",
  "car_rental",
  "bus_station",
  "train_station",
  "subway_station",
  "transit_station",
]);

export function getActivityKind(activity: Activity): ActivityKind {
  for (const category of activity.categories) {
    if (diningCategories.has(category)) {
      return "dining";
    }

    if (lodgingCategories.has(category)) {
      return "lodging";
    }

    if (transportCategories.has(category)) {
      return "transport";
    }
  }

  return "attraction";
}

/** Renders `duration_hours` the way the design does: "45 min", "2h", "1h 30 min". */
export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
    return "";
  }

  const totalMinutes = Math.round(hours * 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes} min`;
}
