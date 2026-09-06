import type { Hotel } from "@/types/itinerary";

const MAX_STARS = 5;

/**
 * Property-class stars, distinct from the guest review score.
 *
 * `star_rating` is a 0–5 class and `guest_rating` a 0–10 review score — the design's
 * ★8.9 badge is the latter. Rounded, since the row renders whole stars.
 */
export function getStarCount(starRating: number | null): number {
  if (starRating === null || !Number.isFinite(starRating) || starRating <= 0) {
    return 0;
  }

  return Math.min(MAX_STARS, Math.round(starRating));
}

/** Nights are not a field, but they fall out of `total_price` / `nightly_price`. */
export function getNightCount(hotel: Hotel): number | null {
  if (!hotel.nightly_price || !hotel.total_price) {
    return null;
  }

  const nights = Math.round(hotel.total_price / hotel.nightly_price);

  return nights > 0 ? nights : null;
}

export function getStayNights(hotels: readonly Hotel[]): number | null {
  for (const hotel of hotels) {
    const nights = getNightCount(hotel);

    if (nights !== null) {
      return nights;
    }
  }

  return null;
}
