import type {
  Day,
  Hotel,
  Flight,
  Itinerary,
} from "@/types/itinerary";

/**
 * Derived, display-ready copy for the workspace summary cards.
 *
 * `isAvailable` is false when the itinerary carries no data for that section, so the
 * card can drop its call to action instead of linking to an empty dialog.
 */
export interface ItinerarySummaryEntry {
  caption: string;
  isAvailable: boolean;
  value: string;
}

export interface ItinerarySummary {
  flights: ItinerarySummaryEntry;
  hotels: ItinerarySummaryEntry;
  itinerary: ItinerarySummaryEntry;
  places: ItinerarySummaryEntry;
}

const EMPTY_VALUE = "Not available";
const PLACE_CATEGORY_LIMIT = 3;

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function pluralize(count: number, singular: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  return `${count} ${singular}s`;
}

function getCheapestFlight(flights: readonly Flight[]): Flight | null {
  return flights.reduce<Flight | null>((cheapest, flight) => {
    if (cheapest === null || flight.price < cheapest.price) {
      return flight;
    }

    return cheapest;
  }, null);
}

function getCheapestHotel(hotels: readonly Hotel[]): Hotel | null {
  return hotels.reduce<Hotel | null>((cheapest, hotel) => {
    if (cheapest === null || hotel.nightly_price < cheapest.nightly_price) {
      return hotel;
    }

    return cheapest;
  }, null);
}

function getBestRating(hotels: readonly Hotel[]): number {
  return hotels.reduce((best, hotel) => Math.max(best, hotel.rating), 0);
}

function countActivities(days: readonly Day[]): number {
  return days.reduce((total, day) => total + day.activities.length, 0);
}

function humanizeCategory(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Most frequent Google place categories across every activity, in descending order. */
function getTopCategories(days: readonly Day[]): string[] {
  const occurrences = new Map<string, number>();

  for (const day of days) {
    for (const activity of day.activities) {
      for (const category of activity.categories) {
        occurrences.set(category, (occurrences.get(category) ?? 0) + 1);
      }
    }
  }

  return Array.from(occurrences.entries())
    .sort(([, left], [, right]) => right - left)
    .slice(0, PLACE_CATEGORY_LIMIT)
    .map(([category]) => humanizeCategory(category));
}

/**
 * The API exposes no airport codes on `Flight`, so the caption names the cheapest
 * airline rather than the "LHR → FCO" route shown in the design.
 */
function buildFlightsEntry(flights: readonly Flight[]): ItinerarySummaryEntry {
  const cheapest = getCheapestFlight(flights);

  if (!cheapest) {
    return {
      caption: "No flights in this plan yet",
      isAvailable: false,
      value: EMPTY_VALUE,
    };
  }

  return {
    caption: `${pluralize(flights.length, "option")} · ${cheapest.airline}`,
    isAvailable: true,
    value: `from ${formatPrice(cheapest.price, cheapest.currency)}`,
  };
}

function buildHotelsEntry(hotels: readonly Hotel[]): ItinerarySummaryEntry {
  const cheapest = getCheapestHotel(hotels);

  if (!cheapest) {
    return {
      caption: "No hotels in this plan yet",
      isAvailable: false,
      value: EMPTY_VALUE,
    };
  }

  const bestRating = getBestRating(hotels);
  const recommended = `${hotels.length} recommended`;

  return {
    caption: bestRating > 0 ? `${recommended} · ★${bestRating.toFixed(1)}` : recommended,
    isAvailable: true,
    value: `from ${formatPrice(cheapest.nightly_price, cheapest.currency)}/night`,
  };
}

function buildItineraryEntry(itinerary: Itinerary): ItinerarySummaryEntry {
  if (itinerary.days.length === 0) {
    return {
      caption: "The day-by-day plan is still being prepared",
      isAvailable: false,
      value: EMPTY_VALUE,
    };
  }

  return {
    caption: "Tap to see full day-by-day plan",
    isAvailable: true,
    value: pluralize(itinerary.total_days, "Day"),
  };
}

function buildPlacesEntry(itinerary: Itinerary): ItinerarySummaryEntry {
  const highlights = countActivities(itinerary.days);

  if (highlights === 0) {
    return {
      caption: "No places in this plan yet",
      isAvailable: false,
      value: EMPTY_VALUE,
    };
  }

  const categories = getTopCategories(itinerary.days);

  return {
    caption: categories.length > 0 ? categories.join(" · ") : itinerary.destination,
    isAvailable: true,
    value: pluralize(highlights, "highlight"),
  };
}

export function buildItinerarySummary(itinerary: Itinerary): ItinerarySummary {
  return {
    flights: buildFlightsEntry(itinerary.flights),
    hotels: buildHotelsEntry(itinerary.hotels),
    itinerary: buildItineraryEntry(itinerary),
    places: buildPlacesEntry(itinerary),
  };
}
