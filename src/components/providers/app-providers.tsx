"use client";

// prettier-ignore
import {
  useState,
  type PropsWithChildren,
} from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// prettier-ignore
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// prettier-ignore
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { theme } from "@/theme";

import { EmotionCacheProvider } from "@/components/providers/emotion-cache";

const QUERY_STALE_TIME_MS = 30 * 1000;
const QUERY_GC_TIME_MS = 5 * 60 * 1000;

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: QUERY_GC_TIME_MS,
        retry: 1,
        staleTime: QUERY_STALE_TIME_MS,
      },
    },
  });
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <EmotionCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <QueryClientProvider client={queryClient}>
          {children}

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
