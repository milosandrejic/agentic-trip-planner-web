import type { ReactNode } from "react";

import { Box } from "@mui/material";

interface WorkspaceLayoutProps {
  children: ReactNode;
  overview: ReactNode;
  sidebar: ReactNode;
}

export function WorkspaceLayout({ children, overview, sidebar }: WorkspaceLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "background.default",
        display: "grid",
        gridTemplateAreas: {
          xs: '"sidebar" "content" "overview"',
          md: '"sidebar content" "sidebar overview"',
          lg: '"sidebar content overview"',
        },
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "240px minmax(0, 1fr)",
          lg: "264px minmax(0, 1fr) 292px",
        },
        gridTemplateRows: {
          xs: "auto auto auto",
          md: "auto auto",
          lg: "minmax(100dvh, auto)",
        },
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <Box
        component="aside"
        sx={{
          bgcolor: "background.paper",
          borderBottom: { xs: 1, md: 0 },
          borderColor: "divider",
          borderRight: { xs: 0, md: 1 },
          gridArea: "sidebar",
          height: { md: "100dvh" },
          minWidth: 0,
          overflowY: { md: "auto" },
          position: { md: "sticky" },
          top: { md: 0 },
        }}
      >
        {sidebar}
      </Box>

      <Box
        sx={{
          gridArea: "content",
          minWidth: 0,
        }}
      >
        {children}
      </Box>

      <Box
        component="aside"
        sx={{
          bgcolor: "background.paper",
          borderColor: "divider",
          borderLeft: { lg: 1 },
          borderTop: { xs: 1, lg: 0 },
          gridArea: "overview",
          height: { lg: "100dvh" },
          minWidth: 0,
          overflowY: { lg: "auto" },
          position: { lg: "sticky" },
          top: { lg: 0 },
        }}
      >
        {overview}
      </Box>
    </Box>
  );
}
