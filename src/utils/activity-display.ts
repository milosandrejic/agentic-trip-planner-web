import type { Activity } from "@/types/itinerary";

/**
 * Coarse activity classification derived from Google place `categories`.
 *
 * Drives the timeline icon and marker colour; the API has no explicit type field.
 */
export type ActivityKind = "attraction" | "dining" | "lodging" | "transport";

/**
 * The API returns human-readable categories ("Art museum", "Food market"), not the
 * snake_case Google place types API.md documents — so these match on words, loosely.
 */
const kindKeywords: readonly (readonly [ActivityKind, readonly string[]])[] = [
  ["lodging", ["hotel", "hostel", "lodging", "resort", "accommodation", "guest house"]],
  ["transport", ["airport", "station", "transit", "train", "metro", "bus", "transfer", "car rental"]],
  ["dining", ["dining", "restaurant", "food", "cafe", "coffee", "bar", "bistro", "nightlife", "tapas", "bakery"]],
];

export function getActivityKind(activity: Activity): ActivityKind {
  const categories = activity.categories.map((category) => category.toLowerCase());

  for (const [kind, keywords] of kindKeywords) {
    const isMatch = categories.some((category) =>
      keywords.some((keyword) => category.includes(keyword)),
    );

    if (isMatch) {
      return kind;
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
