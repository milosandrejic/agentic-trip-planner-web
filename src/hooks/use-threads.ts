import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/query-keys";
import { listThreads } from "@/services/threads-service";

import type {
  ThreadSummary,
  ListThreadsResponse,
} from "@/types/api";

interface UseThreadsOptions {
  limit?: number;
}

/**
 * Keyset-paginated thread list backing the recent-trips sidebar.
 *
 * `GET /threads` returns an opaque `next_cursor`, which is null on the last page —
 * normalised to `undefined` so React Query stops paginating.
 */
export function useThreads({ limit }: UseThreadsOptions = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.threads.list({ limit }),
    queryFn: ({ pageParam }) => listThreads({ cursor: pageParam, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: ListThreadsResponse) => lastPage.next_cursor ?? undefined,
    select: (data): ThreadSummary[] => data.pages.flatMap((page) => page.threads),
  });
}
