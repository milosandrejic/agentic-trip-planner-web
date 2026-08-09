import type { PropsWithChildren } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export function EmotionCacheProvider({ children }: PropsWithChildren) {
  return <AppRouterCacheProvider options={{ key: "mui" }}>{children}</AppRouterCacheProvider>;
}
