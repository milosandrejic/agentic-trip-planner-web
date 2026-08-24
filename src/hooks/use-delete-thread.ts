import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/api/query-keys";
import { deleteThread } from "@/services/threads-service";

/**
 * Soft-deletes a thread and clears it from the cache.
 *
 * The detail key carries pagination params, so the cached entries are removed by
 * prefix rather than by an exact key match.
 */
export function useDeleteThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => deleteThread(threadId),
    onSuccess: (_result, threadId) => {
      queryClient.removeQueries({ queryKey: [...queryKeys.threads.details(), threadId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.lists() });
    },
  });
}
