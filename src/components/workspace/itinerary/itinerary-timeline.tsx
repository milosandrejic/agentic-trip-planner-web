"use client";

import { useState } from "react";

import { CalendarMonthRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import type { Day } from "@/types/itinerary";

import { DayAccordion } from "./day-accordion";

interface ItineraryTimelineProps {
  days: readonly Day[];
}

export function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  const [expandedDays, setExpandedDays] = useState<readonly number[]>(() => days.slice(0, 1).map((day) => day.day));

  if (days.length === 0) {
    return null;
  }

  const isEveryDayExpanded = expandedDays.length === days.length;

  function handleToggle(dayNumber: number): void {
    setExpandedDays((current) => {
      if (current.includes(dayNumber)) {
        return current.filter((expanded) => expanded !== dayNumber);
      }

      return [...current, dayNumber];
    });
  }

  function handleToggleAll(): void {
    setExpandedDays(isEveryDayExpanded ? [] : days.map((day) => day.day));
  }

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: "8px",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingInline: "2px",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            color: "rgba(24, 49, 83, 0.45)",
            display: "flex",
            gap: "8px",
            minWidth: 0,
          }}
        >
          <CalendarMonthRounded sx={{ fontSize: 16 }} />

          <Typography
            component="h2"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.84px",
              lineHeight: "18px",
              textTransform: "uppercase",
            }}
          >
            Day-by-Day Itinerary
          </Typography>
        </Box>

        <Button
          onClick={handleToggleAll}
          variant="text"
          sx={{
            color: "secondary.main",
            flexShrink: 0,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            minWidth: 0,
            padding: "2px 6px",
          }}
        >
          {isEveryDayExpanded ? "Collapse all" : "Expand all"}
        </Button>
      </Box>

      {
        days.map((day) => (
          <DayAccordion
            key={day.day}
            day={day}
            isExpanded={expandedDays.includes(day.day)}
            onToggle={handleToggle}
          />
        ))
      }
    </Box>
  );
}
