import dayjs from "dayjs";

import { formatDateRange } from "@/utils/format-date-range";

import type { Itinerary } from "@/types/itinerary";

/** One column of the weather strip, from the day's structured `weather`. */
export interface WeatherDay {
  dayOfMonth: string;
  icon: string;
  key: number;
  temperature: string;
}

/**
 * Where the hero image comes from.
 *
 * `cover_image_url` is a bearer-protected photo path and must go through `PlacePhoto`;
 * a hotel `photo_url` is an absolute provider URL and renders directly. With neither,
 * there is no image — a stock photo of the wrong city is worse than none.
 */
export type HeroPhoto =
  | { kind: "none" }
  | { kind: "path"; path: string }
  | { kind: "url"; url: string };

const WEATHER_DAY_LIMIT = 3;

/**
 * WMO weather codes → an icon. `weather_code` is the stable key the API documents for
 * exactly this purpose, replacing the free-text matching we used before.
 */
function getWeatherIcon(code: number | null): string {
  if (code === null) {
    return "";
  }

  if (code >= 95) {
    return "⛈";
  }

  if (code >= 80) {
    return "🌦";
  }

  if (code >= 71) {
    return "❄️";
  }

  if (code >= 51) {
    return "🌧";
  }

  if (code >= 45) {
    return "🌫️";
  }

  if (code >= 2) {
    return "⛅";
  }

  if (code === 1) {
    return "🌤";
  }

  return "☀️";
}

/**
 * Weather is null beyond the ~16-day forecast horizon, which means null on *every* day of
 * such a trip — so an empty result is the common case, not an edge, and the panel hides.
 */
export function getWeatherDays(itinerary: Itinerary): WeatherDay[] {
  return itinerary.days
    .filter((day) => day.weather !== null)
    .slice(0, WEATHER_DAY_LIMIT)
    .map((day) => ({
      dayOfMonth: day.date ? dayjs(day.date).format("D") : String(day.day),
      icon: getWeatherIcon(day.weather?.weather_code ?? null),
      key: day.day,
      temperature: day.weather?.temp_max_c === null || day.weather?.temp_max_c === undefined ? "" : `${Math.round(day.weather.temp_max_c)}°`,
    }));
}

/**
 * The itinerary's own dates, falling back to the day range for older snapshots that
 * predate `start_date` / `end_date`.
 */
export function formatItineraryDateRange(itinerary: Itinerary): string | null {
  const dayDates = itinerary.days.map((day) => day.date).filter(Boolean);

  return formatDateRange(
    itinerary.start_date ?? dayDates[0] ?? null,
    itinerary.end_date ?? dayDates[dayDates.length - 1] ?? null,
  );
}

export function getHeroPhoto(itinerary: Itinerary): HeroPhoto {
  if (itinerary.cover_image_url) {
    return {
      kind: "path",
      path: itinerary.cover_image_url,
    };
  }

  const hotelPhoto = itinerary.hotels.find((hotel) => Boolean(hotel.photo_url));

  if (hotelPhoto?.photo_url) {
    return {
      kind: "url",
      url: hotelPhoto.photo_url,
    };
  }

  return { kind: "none" };
}

/** "2 people" / "Solo traveller". Null when the planner never captured a count. */
export function formatTravelers(travelerCount: number | null): string | null {
  if (travelerCount === null || travelerCount <= 0) {
    return null;
  }

  if (travelerCount === 1) {
    return "Solo traveller";
  }

  return `${travelerCount} people`;
}
