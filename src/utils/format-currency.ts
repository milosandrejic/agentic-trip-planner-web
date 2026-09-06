/** Whole-unit money formatting shared by the summary cards, budget panel and dialogs. */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

/** "for 2 travellers", or null when the planner never captured a party size. */
export function formatPartyLabel(travelerCount: number | null): string | null {
  if (travelerCount === null || travelerCount <= 0) {
    return null;
  }

  return travelerCount === 1 ? "for 1 traveller" : `for ${travelerCount} travellers`;
}
