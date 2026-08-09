import type { ReactNode } from "react";

import { Box } from "@mui/material";

interface MarketingLayoutProps {
  children: ReactNode;
  footer: ReactNode;
  navbar: ReactNode;
}

export function MarketingLayout({ children, footer, navbar }: MarketingLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          minHeight: 62,
          position: "sticky",
          top: 0,
          zIndex: "appBar",
        }}
      >
        {navbar}
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </Box>

      <Box component="footer" sx={{ flexShrink: 0 }}>
        {footer}
      </Box>
    </Box>
  );
}
