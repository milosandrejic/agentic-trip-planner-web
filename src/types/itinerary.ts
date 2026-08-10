export interface Source {
  title: string;
  url: string;
}

export type ActivityTime = "Morning" | "Afternoon" | "Evening";

export interface Activity {
  id: string;
  time: ActivityTime;
  description: string;
  duration_hours: number;
  place_id: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  user_rating_count: number;
  opening_hours: string[];
  price_level: string;
  price_eur: number;
  ticket_url: string;
  photo_url: string;
  website_url: string;
  phone: string;
  business_status: string;
  categories: string[];
  editorial_summary: string;
  google_maps_url: string;
  sources: Source[];
}

export interface Day {
  day: number;
  date: string;
  location: string;
  weather_summary: string;
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
  booking_url: string;
  sources: Source[];
}

export interface Hotel {
  id: string;
  name: string;
  area: string;
  rating: number;
  nightly_price: number;
  is_estimated: boolean;
  total_price: number;
  currency: string;
  latitude: number;
  longitude: number;
  booking_url: string;
  photo_url: string;
  sources: Source[];
}

export interface Itinerary {
  destination: string;
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
