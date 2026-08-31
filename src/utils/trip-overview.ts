import dayjs from "dayjs";

import type { Itinerary } from "@/types/itinerary";

/** One column of the weather strip, derived from a day's free-text `weather_summary`. */
export interface WeatherDay {
  dayOfMonth: string;
  icon: string;
  key: number;
  temperature: string;
}

/**
 * Where the hero image comes from (gap #5 — the API has no trip image field).
 *
 * Hotel `photo_url` is a plain URL and renders directly; an activity `photo_url` is a
 * Google Places reference that must go through `PlacePhoto`.
 */
export type HeroPhoto =
  | { kind: "fallback" }
  | { kind: "reference"; reference: string }
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

/** "Sep 12 – Sep 19" across the itinerary's first and last dated day. */
export function formatDateRange(itinerary: Itinerary): string {
  const dates = itinerary.days.map((day) => day.date).filter(Boolean);

  if (dates.length === 0) {
    return "—";
  }

  const start = dayjs(dates[0]);
  const end = dayjs(dates[dates.length - 1]);

  if (dates.length === 1) {
    return start.format("MMM D");
  }

  return `${start.format("MMM D")} – ${end.format("MMM D")}`;
}

export function getHeroPhoto(itinerary: Itinerary): HeroPhoto {
  const hotelPhoto = itinerary.hotels.find((hotel) => Boolean(hotel.photo_url));

  if (hotelPhoto?.photo_url) {
    return {
      kind: "url",
      url: hotelPhoto.photo_url,
    };
  }

  for (const day of itinerary.days) {
    const activityPhoto = day.activities.find((activity) => Boolean(activity.photo_url));

    if (activityPhoto?.photo_url) {
      return {
        kind: "reference",
        reference: activityPhoto.photo_url,
      };
    }
  }

  return { kind: "fallback" };
}
