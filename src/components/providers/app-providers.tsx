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
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { EmotionCacheProvider } from "@/components/providers/emotion-cache";

const theme = createTheme();

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

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
