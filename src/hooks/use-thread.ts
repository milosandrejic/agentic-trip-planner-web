import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/api/query-keys";
import {
  getThread,
  sendMessage,
} from "@/services/threads-service";

import type {
  PaginationParams,
  SendMessageRequest,
} from "@/types/api";

export function useThread(threadId: string, params: PaginationParams = {}) {
  return useQuery({
    queryFn: () => getThread(threadId, params),
    queryKey: queryKeys.threads.detail(threadId, params),
  });
}

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendMessageRequest) => sendMessage(threadId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) });
    },
  });
}
