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
