import type {
  Itinerary,
  PlannerResult,
} from "@/types/itinerary";

export type TripStatus = "draft" | "generating" | "ready" | "completed" | "archived";

export interface Trip {
  id: string;
  /** "New trip" until a turn produces an itinerary, then the itinerary's `short_title`. */
  title: string;
  /** Always `trip-<32 hex>`. Opaque; not a lookup key on any endpoint. */
  slug: string;
  /** Null until an itinerary exists. */
  destination: string | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export type ThreadStatus = "pending" | "running" | "ready" | "failed" | "deleted";

/**
 * `country_code`, the dates and `cover_image_url` come from the linked trip and are null
 * until the first turn completes — a thread exists before it has a trip.
 */
export interface ThreadSummary {
  id: string;
  title: string;
  slug: string;
  status: ThreadStatus;
  /** ISO 3166-1 alpha-2, for the flag on a trip card. */
  country_code: string | null;
  start_date: string | null;
  end_date: string | null;
  /** Path for `GET /places/photos/...`; needs a bearer token. */
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** The API returns "human" for user-authored messages, never "user". */
export type MessageRole = "assistant" | "human";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  itinerary: Itinerary | null;
  created_at: string;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export interface CursorPage {
  next_cursor: string | null;
}

export interface CreateTripRequest {
  query: string;
}

export interface CreateTripResponse {
  trip: Trip;
  thread_id: string;
  result: PlannerResult;
}

export interface ListThreadsResponse extends CursorPage {
  threads: ThreadSummary[];
}

export interface GetThreadResponse extends CursorPage {
  thread: ThreadSummary;
  messages: Message[];
}

export interface SendMessageRequest {
  query: string;
}

export interface SendMessageResponse {
  result: PlannerResult;
}

export interface PlacePhotoParams {
  max_width_px?: number;
}
