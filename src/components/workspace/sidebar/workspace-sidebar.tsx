"use client";

import {
  Box, Button, Typography,
} from "@mui/material";

import { Logo } from "@/components/logo/logo";

import { UserMenu } from "./user-menu";
import { RecentTrips } from "./recent-trips";

export function WorkspaceSidebar() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 12px",
      }}
    >
      <Box sx={{ paddingLeft: "8px" }}>
        <Logo variant="workspace" />
      </Box>

      <Box sx={{ marginTop: "22px" }}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            borderStyle: "dashed",
            justifyContent: "center",
          }}
        >
          New Trip
        </Button>
      </Box>

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.38)",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.945px",
          marginTop: "22px",
          paddingInline: "8px",
          textTransform: "uppercase",
        }}
      >
        Trips
      </Typography>

      <RecentTrips />

      <UserMenu />
    </Box>
  );
}
