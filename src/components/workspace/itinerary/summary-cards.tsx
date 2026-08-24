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

import { brandColors } from "@/theme/palette";

type SummaryCardTone = "muted" | "navy" | "teal";

interface SummaryCardTheme {
  backgroundColor: string;
  color: string;
}

const toneStyles: Record<SummaryCardTone, SummaryCardTheme> = {
  muted: {
    backgroundColor: "rgba(24, 49, 83, 0.07)",
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
        backgroundColor: brandColors.surface,
        border: "1px solid rgba(24, 49, 83, 0.07)",
        borderRadius: "16px",
        boxShadow: "0 1px 2px rgba(24, 49, 83, 0.04)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "18px 20px",
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
          gap: "8px",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: tile.backgroundColor,
            borderRadius: "9px",
            color: tile.color,
            display: "flex",
            flexShrink: 0,
            height: 32,
            justifyContent: "center",
            width: 32,
          }}
        >
          <Icon sx={{ fontSize: 16 }} />
        </Box>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.4)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.88px",
            lineHeight: "16.5px",
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
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.66px",
          lineHeight: "22px",
          marginTop: "12px",
        }}
      >
        {entry.value}
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.55)",
          fontSize: 13,
          lineHeight: "18.2px",
          marginTop: "3px",
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
            gap: "5px",
            marginTop: "14px",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "19.5px",
            }}
          >
            {action}
          </Typography>

          <ArrowForwardRounded sx={{ fontSize: 13 }} />
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
        gap: "10px",
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
