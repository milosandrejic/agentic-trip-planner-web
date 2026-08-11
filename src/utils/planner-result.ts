import type { Message } from "@/types/api";
import type {
  Itinerary,
  PlannerResult,
  ItineraryPlannerResult,
  ClarificationPlannerResult,
} from "@/types/itinerary";

export function isItineraryResult(result: PlannerResult): result is ItineraryPlannerResult {
  return result.type === "itinerary";
}

export function isClarificationResult(result: PlannerResult): result is ClarificationPlannerResult {
  return result.type === "clarification";
}

export function getLatestItinerary(messages: readonly Message[]): Itinerary | null {
  for (let index = messages.length - 1; index >= 0; index--) {
    const { itinerary } = messages[index];

    if (itinerary) {
      return itinerary;
    }
  }

  return null;
}
