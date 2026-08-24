import type { Itinerary } from "@/types/itinerary";

/**
 * Client-side cost estimate for a trip.
 *
 * The API exposes no budget target, so there is no "remaining" figure to report — only
 * what the planned trip is estimated to cost. Flights and hotels are alternatives rather
 * than additive line items, so the cheapest of each is used; activities all happen, so
 * their `price_eur` values are summed.
 */
export interface BudgetEstimate {
  activitiesTotal: number;
  currency: string;
  flightsTotal: number;
  hotelsTotal: number;
  total: number;
}

const DEFAULT_CURRENCY = "EUR";

export function estimateBudget(itinerary: Itinerary): BudgetEstimate {
  const cheapestFlight = itinerary.flights.reduce<number | null>((cheapest, flight) => {
    if (cheapest === null || flight.price < cheapest) {
      return flight.price;
    }

    return cheapest;
  }, null);

  const cheapestHotel = itinerary.hotels.reduce<number | null>((cheapest, hotel) => {
    if (cheapest === null || hotel.total_price < cheapest) {
      return hotel.total_price;
    }

    return cheapest;
  }, null);

  const activitiesTotal = itinerary.days.reduce((dayTotal, day) => {
    const dayActivities = day.activities.reduce(
      (total, activity) => total + (activity.price_eur || 0),
      0,
    );

    return dayTotal + dayActivities;
  }, 0);

  const flightsTotal = cheapestFlight ?? 0;
  const hotelsTotal = cheapestHotel ?? 0;

  return {
    activitiesTotal,
    currency: itinerary.flights[0]?.currency ?? itinerary.hotels[0]?.currency ?? DEFAULT_CURRENCY,
    flightsTotal,
    hotelsTotal,
    total: flightsTotal + hotelsTotal + activitiesTotal,
  };
}

export function formatBudgetAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}
