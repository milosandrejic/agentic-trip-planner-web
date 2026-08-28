import type { Hotel } from "@/types/itinerary";

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
