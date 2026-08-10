import { apiClient } from "@/api/axios";

// prettier-ignore
import type {
  CreateTripRequest,
  CreateTripResponse,
} from "@/types/api";

export async function createTrip(request: CreateTripRequest): Promise<CreateTripResponse> {
  const response = await apiClient.post<CreateTripResponse>("/trips", request);

  return response.data;
}
