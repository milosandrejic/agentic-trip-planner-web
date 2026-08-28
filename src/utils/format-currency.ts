/** Whole-unit money formatting shared by the summary cards, budget panel and dialogs. */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}
