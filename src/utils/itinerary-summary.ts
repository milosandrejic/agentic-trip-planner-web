import { formatCurrency } from "@/utils/format-currency";
import { formatFlightRoute } from "@/utils/flight-display";

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

function pluralize(count: number, singular: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  return `${count} ${singular}s`;
}

function getCheapestFlight(flights: readonly Flight[]): Flight | null {
  return flights.reduce<Flight | null>((cheapest, flight) => {
    if (flight.price === null) {
      return cheapest;
    }

    if (cheapest === null || cheapest.price === null || flight.price < cheapest.price) {
      return flight;
    }

    return cheapest;
  }, null);
}

function getCheapestHotel(hotels: readonly Hotel[]): Hotel | null {
  return hotels.reduce<Hotel | null>((cheapest, hotel) => {
    if (hotel.nightly_price === null) {
      return cheapest;
    }

    if (cheapest === null || cheapest.nightly_price === null || hotel.nightly_price < cheapest.nightly_price) {
      return hotel;
    }

    return cheapest;
  }, null);
}

function getBestRating(hotels: readonly Hotel[]): number {
  return hotels.reduce((best, hotel) => Math.max(best, hotel.guest_rating ?? 0), 0);
}

function countActivities(days: readonly Day[]): number {
  return days.reduce((total, day) => total + day.activities.length, 0);
}

/** Categories arrive already human-readable ("Art museum"); just normalise the case. */
function humanizeCategory(category: string): string {
  const trimmed = category.trim();

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
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

/** Captions with the route the design shows, falling back to the airline without codes. */
function buildFlightsEntry(flights: readonly Flight[]): ItinerarySummaryEntry {
  const cheapest = getCheapestFlight(flights);

  if (!cheapest || cheapest.price === null) {
    return {
      caption: "No flights in this plan yet",
      isAvailable: false,
      value: EMPTY_VALUE,
    };
  }

  const route = formatFlightRoute(cheapest.origin, cheapest.destination);

  return {
    caption: `${pluralize(flights.length, "option")} · ${route || cheapest.airline}`,
    isAvailable: true,
    value: `from ${formatCurrency(cheapest.price, cheapest.currency ?? "EUR")}`,
  };
}

function buildHotelsEntry(hotels: readonly Hotel[]): ItinerarySummaryEntry {
  const cheapest = getCheapestHotel(hotels);

  if (!cheapest || cheapest.nightly_price === null) {
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
    value: `from ${formatCurrency(cheapest.nightly_price, cheapest.currency ?? "EUR")}/night`,
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
