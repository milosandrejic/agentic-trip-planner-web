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

const weatherIcons: readonly (readonly [RegExp, string])[] = [
  [/thunder|storm/i, "⛈"],
  [/snow|sleet/i, "❄️"],
  [/rain|shower|drizzle/i, "🌧"],
  [/fog|mist|haze/i, "🌫️"],
  [/partly|partial|mostly sunny/i, "🌤"],
  [/cloud|overcast/i, "⛅"],
  [/sun|clear|fair/i, "☀️"],
];

function getWeatherIcon(summary: string | null): string {
  if (!summary) {
    return "🌡️";
  }

  for (const [pattern, icon] of weatherIcons) {
    if (pattern.test(summary)) {
      return icon;
    }
  }

  return "🌡️";
}

/** Pulls the first temperature out of strings like "Sunny, 24°C". */
function getTemperature(summary: string | null): string {
  const match = summary?.match(/(-?\d+)\s*°/);

  if (!match) {
    return "—";
  }

  return `${match[1]}°`;
}

export function getWeatherDays(itinerary: Itinerary): WeatherDay[] {
  return itinerary.days
    .filter((day) => Boolean(day.weather_summary))
    .slice(0, WEATHER_DAY_LIMIT)
    .map((day) => ({
      dayOfMonth: day.date ? dayjs(day.date).format("D") : String(day.day),
      icon: getWeatherIcon(day.weather_summary),
      key: day.day,
      temperature: getTemperature(day.weather_summary),
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
