import type { PaginationParams } from "@/types/api";

const THREADS_KEY = ["threads"] as const;

export const queryKeys = {
  me: ["me"] as const,
  threads: {
    all: THREADS_KEY,
    lists: () => [...THREADS_KEY, "list"] as const,
    list: (params: PaginationParams = {}) => [...THREADS_KEY, "list", params] as const,
    details: () => [...THREADS_KEY, "detail"] as const,
    detail: (threadId: string, params: PaginationParams = {}) =>
      [...THREADS_KEY, "detail", threadId, params] as const,
  },
} as const;
