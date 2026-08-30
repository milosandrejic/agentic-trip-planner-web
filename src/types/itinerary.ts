export interface Source {
  title: string;
  url: string;
}

/** Clock time such as "09:30" — the API returns times, not the buckets API.md documents. */
export type ActivityTime = string;

export interface Activity {
  id: string;
  time: ActivityTime;
  description: string;
  duration_hours: number | null;
  place_id: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  rating: number | null;
  user_rating_count: number | null;
  opening_hours: string[];
  price_level: string | null;
  price_eur: number | null;
  ticket_url: string | null;
  photo_url: string | null;
  website_url: string | null;
  phone: string | null;
  business_status: string | null;
  categories: string[];
  editorial_summary: string | null;
  google_maps_url: string | null;
  sources: Source[];
}

export interface Day {
  day: number;
  date: string;
  location: string;
  weather_summary: string | null;
  activities: Activity[];
}

export interface Flight {
  id: string;
  airline: string;
  stops: number;
  duration_min: number;
  price: number;
  currency: string;
  outbound_date: string;
  return_date: string;
  booking_url: string | null;
  sources: Source[];
}

export interface Hotel {
  id: string;
  name: string;
  area: string;
  rating: number | null;
  nightly_price: number;
  is_estimated: boolean;
  total_price: number;
  currency: string;
  latitude: number | null;
  longitude: number | null;
  booking_url: string | null;
  photo_url: string | null;
  sources: Source[];
}

export interface Itinerary {
  destination: string;
  short_title: string;
  total_days: number;
  summary: string;
  days: Day[];
  flights: Flight[];
  hotels: Hotel[];
  sources: Source[];
}

export interface ItineraryPlannerResult {
  type: "itinerary";
  itinerary: Itinerary;
}

export interface Clarification {
  message: string;
  missing_fields: string[];
}

export interface ClarificationPlannerResult {
  type: "clarification";
  clarification: Clarification;
}

export type PlannerResult = ItineraryPlannerResult | ClarificationPlannerResult;
