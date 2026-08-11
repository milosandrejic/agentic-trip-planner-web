"use client";

import {
  Box, Button, Typography,
} from "@mui/material";

import { Logo } from "@/components/logo/logo";

import { UserMenu } from "./user-menu";

const MOCK_TRIPS = [
  { dates: "Oct 12–19", flag: "🇮🇹", title: "Rome & Florence" },
  { dates: "Mar 3–17", flag: "🇯🇵", title: "Japan Spring" },
  { dates: "Jul 20–27", flag: "🇳🇴", title: "Norway Fjords" },
];

function RecentTripItem({ trip }: { trip: (typeof MOCK_TRIPS)[number] }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        borderRadius: "10px",
        display: "flex",
        gap: "8px",
        padding: "9px 11px",
        "&:hover": {
          backgroundColor: "rgba(24, 49, 83, 0.04)",
        },
      }}
    >
      <Typography component="span" sx={{ fontSize: 16, lineHeight: 1.5 }}>
        {trip.flag}
      </Typography>

      <Box>
        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.55)",
            fontSize: 12.5,
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {trip.title}
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.38)",
            fontSize: 11,
            lineHeight: 1.5,
            marginTop: "2px",
          }}
        >
          {trip.dates}
        </Typography>
      </Box>
    </Box>
  );
}

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

      <Box
        component="nav"
        aria-label="Recent trips"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: "3px",
          marginTop: "10px",
          overflowY: "auto",
        }}
      >
        {
          MOCK_TRIPS.map((trip) => (
            <RecentTripItem
              key={trip.title}
              trip={trip}
            />
          ))
        }
      </Box>

      <UserMenu />
    </Box>
  );
}
