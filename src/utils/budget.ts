import type { Itinerary } from "@/types/itinerary";

/**
 * What the budget panel renders.
 *
 * `spend` is the API's own `estimated_spend_eur` — an estimate, never a quoted total —
 * and `budget` is what the user stated. The planner reports against a budget but does
 * not enforce one, so the two must never be presented as "fits" or "over".
 *
 * The ✈ / 🏨 split stays client-side: the API returns totals, not a breakdown. It is
 * composed the same way `estimated_spend_eur` is — cheapest flight, cheapest hotel stay,
 * and every priced activity — so the parts stay consistent with the whole.
 */
export interface BudgetSummary {
  activitiesTotal: number | null;
  budget: number | null;
  currency: string;
  flightsTotal: number | null;
  hotelsTotal: number | null;
  spend: number | null;
}

const DEFAULT_CURRENCY = "EUR";

function getCheapest(values: readonly (number | null)[]): number | null {
  return values.reduce<number | null>((cheapest, value) => {
    if (value !== null && (cheapest === null || value < cheapest)) {
      return value;
    }

    return cheapest;
  }, null);
}

function sumActivityPrices(itinerary: Itinerary): number | null {
  const prices = itinerary.days.flatMap((day) =>
    day.activities.map((activity) => activity.price_eur).filter((price) => price !== null),
  );

  if (prices.length === 0) {
    return null;
  }

  return prices.reduce((total, price) => total + price, 0);
}

export function buildBudgetSummary(itinerary: Itinerary): BudgetSummary {
  const flightsTotal = getCheapest(itinerary.flights.map((flight) => flight.price));
  const hotelsTotal = getCheapest(itinerary.hotels.map((hotel) => hotel.total_price));
  const activitiesTotal = sumActivityPrices(itinerary);

  const parts = [flightsTotal, hotelsTotal, activitiesTotal].filter((part) => part !== null);

  // Older itineraries are snapshots taken before `estimated_spend_eur` existed, but they
  // still carry priced flights and hotels — so the same sum is computed locally rather
  // than discarding real prices. Both forms are estimates and are labelled as such.
  const fallbackSpend = parts.length > 0 ? parts.reduce((total, part) => total + part, 0) : null;

  return {
    activitiesTotal,
    budget: itinerary.budget_eur,
    currency: itinerary.flights[0]?.currency ?? itinerary.hotels[0]?.currency ?? DEFAULT_CURRENCY,
    flightsTotal,
    hotelsTotal,
    spend: itinerary.estimated_spend_eur ?? fallbackSpend,
  };
}

/** True when there is nothing worth showing — the panel omits itself entirely. */
export function isBudgetEmpty(summary: BudgetSummary): boolean {
  return summary.budget === null && summary.spend === null;
}
