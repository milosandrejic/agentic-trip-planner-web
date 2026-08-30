import type {
  Itinerary,
  PlannerResult,
} from "@/types/itinerary";

export type TripStatus = "draft" | "generating" | "ready" | "completed" | "archived";

export interface Trip {
  id: string;
  title: string;
  slug: string;
  destination: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export type ThreadStatus = "pending" | "running" | "ready" | "failed" | "deleted";

export interface ThreadSummary {
  id: string;
  title: string;
  slug: string;
  status: ThreadStatus;
  created_at: string;
  updated_at: string;
}

/** The API returns "human" for user-authored messages, not "user". */
export type MessageRole = "assistant" | "human" | "user";

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
