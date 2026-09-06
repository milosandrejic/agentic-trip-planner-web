import type { Flight } from "@/types/itinerary";

/** Renders `duration_min` the way the design does: "2h 45m", "45m", "3h". */
export function formatFlightDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatStops(stops: number): string {
  if (stops <= 0) {
    return "Non-stop";
  }

  if (stops === 1) {
    return "1 stop";
  }

  return `${stops} stops`;
}

/**
 * Reads the clock portion straight out of the ISO string instead of parsing it.
 *
 * Airline times are local to their own airport — a departure board in London shows
 * 07:15 regardless of where you are reading it. Passing the value through a
 * timezone-aware parser would shift it to the viewer's zone, which is wrong.
 */
export function formatFlightTime(value: string | null): string {
  if (!value) {
    return "";
  }

  const match = value.match(/T(\d{2}:\d{2})/);

  return match ? match[1] : "";
}

/** "LHR → FCO", or empty when either code is missing. */
export function formatFlightRoute(
  origin: string | null,
  destination: string | null,
): string {
  if (!origin || !destination) {
    return "";
  }

  return `${origin} → ${destination}`;
}

/** Id of the cheapest flight, which carries the "BEST VALUE" chip. */
export function getBestValueFlightId(flights: readonly Flight[]): string | null {
  const cheapest = flights.reduce<Flight | null>((best, flight) => {
    if (flight.price === null) {
      return best;
    }

    if (best === null || best.price === null || flight.price < best.price) {
      return flight;
    }

    return best;
  }, null);

  return cheapest?.id ?? null;
}
