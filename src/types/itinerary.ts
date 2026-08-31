export interface Source {
  title: string;
  url: string;
}

/**
 * Drives the timeline icon and the map pin colour.
 *
 * Replaces the keyword matching we previously ran over `categories`, which is unreliable
 * (empty for transfers and check-ins) and not a stable key.
 */
export type ActivityType =
  | "cafe"
  | "church"
  | "class"
  | "drinks"
  | "flight"
  | "hotel"
  | "landmark"
  | "meal"
  | "museum"
  | "nature"
  | "nightlife"
  | "other"
  | "shopping"
  | "train"
  | "transfer"
  | "viewpoint"
  | "walk";

/**
 * Only `id`, `description` and `activity_type` are guaranteed. Prices in particular are
 * absent far more often than present — build the empty case as the default.
 */
export interface Activity {
  id: string;
  /** 24-hour `HH:MM`, or null. */
  time: string | null;
  activity_type: ActivityType;
  description: string;
  /** The specific place, e.g. "Da Enzo al 29". */
  venue_name: string | null;
  /** One short tip, e.g. "Book tickets in advance". */
  note: string | null;
  duration_hours: number | null;
  /** Per person, unlike every other price in the contract. */
  price_eur: number | null;
  /** Always true when `price_eur` is set — no provider prices activities. */
  price_is_estimated: boolean;
  /** Venue website, else a ticket search. */
  ticket_url: string | null;
  /** Path for `GET /places/photos/...`; needs a bearer token. */
  photo_url: string | null;
  place_id: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  /** Google's 0–5 place rating. Unrelated to hotel ratings. */
  rating: number | null;
  user_rating_count: number | null;
  price_level: string | null;
  website_url: string | null;
  phone: string | null;
  business_status: string | null;
  editorial_summary: string | null;
  google_maps_url: string | null;
  opening_hours: string[];
  categories: string[];
  sources: Source[];
}

/** Null beyond the ~16-day forecast horizon — which means null on *every* day of such a trip. */
export interface DayWeather {
  condition: string | null;
  /** WMO code — a stable key for icon selection. */
  weather_code: number | null;
  temp_max_c: number | null;
  temp_min_c: number | null;
}

export interface Day {
  day: number;
  date: string | null;
  /** e.g. "Arrival & Trastevere". Falls back to `location`. */
  title: string | null;
  location: string;
  weather: DayWeather | null;
  activities: Activity[];
}

export interface Flight {
  id: string;
  airline: string;
  stops: number;
  /** IATA, e.g. "LHR" → "FCO". */
  origin: string | null;
  destination: string | null;
  /** ISO datetimes for the outbound leg; arrival is the last segment's. */
  departs_at: string | null;
  arrives_at: string | null;
  duration_min: number | null;
  /** For the whole party. */
  price: number | null;
  currency: string | null;
  outbound_date: string;
  return_date: string | null;
  /** A constructed search link, not a checkout link. */
  booking_url: string | null;
  sources: Source[];
}

export interface Hotel {
  id: string;
  name: string;
  area: string | null;
  /** Property class, 0–5. */
  star_rating: number | null;
  /** Guest review score, 0–10 — the ★8.9 figure in the design. */
  guest_rating: number | null;
  /** For the whole party. */
  nightly_price: number | null;
  total_price: number | null;
  /** `nightly_price` is an estimate rather than a quoted rate. */
  is_estimated: boolean;
  currency: string | null;
  latitude: number | null;
  longitude: number | null;
  /** A constructed search link, not a checkout link. */
  booking_url: string | null;
  /** Absolute provider URL — not the photo proxy. */
  photo_url: string | null;
  sources: Source[];
}

export interface Itinerary {
  destination: string;
  total_days: number;
  /** 2–3 words; becomes the trip and thread title. */
  short_title: string;
  summary: string;
  /** ISO 3166-1 alpha-2, resolved from the destination. */
  country_code: string | null;
  /** IANA, e.g. "Europe/Rome". */
  timezone: string | null;
  start_date: string | null;
  end_date: string | null;
  /** Party size every price above is for. */
  traveler_count: number | null;
  /** What the user stated. The planner reports against it but does not enforce it. */
  budget_eur: number | null;
  /** Cheapest flight + cheapest hotel stay + priced activities. An estimate, never a total. */
  estimated_spend_eur: number | null;
  /** Photo path for the destination; needs a bearer token. */
  cover_image_url: string | null;
  days: Day[];
  flights: Flight[];
  hotels: Hotel[];
  sources: Source[];
}

export interface ItineraryPlannerResult {
  type: "itinerary";
  itinerary: Itinerary;
}

/** Drawn from `destination` · `duration` · `traveler_count`. Budget is asked for but never blocks. */
export type ClarificationField = "destination" | "duration" | "traveler_count";

export interface Clarification {
  message: string;
  missing_fields: ClarificationField[];
}

export interface ClarificationPlannerResult {
  type: "clarification";
  clarification: Clarification;
}

export type PlannerResult = ItineraryPlannerResult | ClarificationPlannerResult;
