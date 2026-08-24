"use client";

import type { ComponentType } from "react";

import type { SvgIconProps } from "@mui/material";
import {
  Box,
  ButtonBase,
  Typography,
} from "@mui/material";
import {
  ApartmentRounded,
  LocationOnOutlined,
  ArrowForwardRounded,
  CalendarMonthRounded,
  FlightTakeoffRounded,
} from "@mui/icons-material";

import type {
  ItinerarySummary,
  ItinerarySummaryEntry,
} from "@/utils/itinerary-summary";

type SummaryCardTone = "muted" | "navy" | "teal";

interface SummaryCardTheme {
  backgroundColor: string;
  color: string;
}

const toneStyles: Record<SummaryCardTone, SummaryCardTheme> = {
  muted: {
    backgroundColor: "rgba(24, 49, 83, 0.06)",
    color: "text.primary",
  },
  navy: {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },
  teal: {
    backgroundColor: "secondary.main",
    color: "secondary.contrastText",
  },
};

interface SummaryCardProps {
  action: string;
  entry: ItinerarySummaryEntry;
  icon: ComponentType<SvgIconProps>;
  label: string;
  onOpen: () => void;
  tone: SummaryCardTone;
}

function SummaryCard({ action, entry, icon: Icon, label, onOpen, tone }: SummaryCardProps) {
  const tile = toneStyles[tone];

  return (
    <ButtonBase
      disabled={!entry.isAvailable}
      onClick={onOpen}
      aria-label={`${action} — ${entry.value}`}
      sx={{
        alignItems: "stretch",
        backgroundColor: "background.paper",
        border: "1px solid rgba(24, 49, 83, 0.07)",
        borderRadius: "16px",
        boxShadow: "0 1px 2px rgba(24, 49, 83, 0.04)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "18px 20px 20px",
        textAlign: "left",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          borderColor: "rgba(24, 49, 83, 0.14)",
          boxShadow: "0 4px 14px rgba(24, 49, 83, 0.06)",
        },
        "&.Mui-disabled": {
          opacity: 0.6,
        },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: tile.backgroundColor,
            borderRadius: "10px",
            color: tile.color,
            display: "flex",
            flexShrink: 0,
            height: 34,
            justifyContent: "center",
            width: 34,
          }}
        >
          <Icon sx={{ fontSize: 17 }} />
        </Box>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.45)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "1.1px",
            lineHeight: 1.4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        component="p"
        sx={{
          color: "text.primary",
          fontFamily: "var(--font-manrope)",
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-0.62px",
          lineHeight: 1.15,
          marginTop: "16px",
        }}
      >
        {entry.value}
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.5)",
          fontSize: 13,
          lineHeight: 1.5,
          marginTop: "5px",
        }}
      >
        {entry.caption}
      </Typography>

      {
        entry.isAvailable &&
        <Box
          sx={{
            alignItems: "center",
            color: "secondary.main",
            display: "flex",
            gap: "6px",
            marginTop: "16px",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {action}
          </Typography>

          <ArrowForwardRounded sx={{ fontSize: 15 }} />
        </Box>
      }
    </ButtonBase>
  );
}

interface SummaryCardsProps {
  onExplorePlaces: () => void;
  onViewFlights: () => void;
  onViewHotels: () => void;
  onViewItinerary: () => void;
  summary: ItinerarySummary;
}

export function SummaryCards({
  onExplorePlaces,
  onViewFlights,
  onViewHotels,
  onViewItinerary,
  summary,
}: SummaryCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
        },
      }}
    >
      <SummaryCard
        action="View Flights"
        entry={summary.flights}
        icon={FlightTakeoffRounded}
        label="Flights found"
        onOpen={onViewFlights}
        tone="navy"
      />

      <SummaryCard
        action="View Hotels"
        entry={summary.hotels}
        icon={ApartmentRounded}
        label="Hotels"
        onOpen={onViewHotels}
        tone="teal"
      />

      <SummaryCard
        action="View Itinerary"
        entry={summary.itinerary}
        icon={CalendarMonthRounded}
        label="Itinerary ready"
        onOpen={onViewItinerary}
        tone="muted"
      />

      <SummaryCard
        action="Explore Places"
        entry={summary.places}
        icon={LocationOnOutlined}
        label="Places"
        onOpen={onExplorePlaces}
        tone="muted"
      />
    </Box>
  );
}
