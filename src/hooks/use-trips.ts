import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/api/query-keys";
import { createTrip } from "@/services/trips-service";

import type { CreateTripRequest } from "@/types/api";

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTripRequest) => createTrip(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });
}
