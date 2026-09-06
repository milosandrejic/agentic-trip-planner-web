"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import { brandColors } from "@/theme/palette";

/**
 * A planning turn runs synchronously for up to 120 seconds with no streaming and no
 * polling endpoint, so the only honest thing to show is what the planner is working
 * through. A bare spinner for two minutes reads as a hang.
 *
 * The stages are narration, not telemetry — the API reports no progress — so they
 * advance on a timer and hold on the last one rather than pretending to finish.
 */
const STAGES: readonly string[] = [
  "Reading your request…",
  "Searching flights…",
  "Comparing places to stay…",
  "Finding things to do…",
  "Building your day-by-day plan…",
  "Almost there — putting it together…",
];

const STAGE_DURATION_MS = 14000;

export function PlanningProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStageIndex((current) => Math.min(current + 1, STAGES.length - 1));
    }, STAGE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Box
      aria-live="polite"
      sx={{
        alignItems: "center",
        display: "flex",
        gap: "10px",
        padding: "10px 20px 0",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(47, 156, 149, 0.15)",
          borderRadius: "50%",
          flexShrink: 0,
          height: 8,
          position: "relative",
          width: 8,
          "&::after": {
            animation: "planning-pulse 1.4s ease-in-out infinite",
            backgroundColor: brandColors.teal,
            borderRadius: "50%",
            content: '""',
            inset: 0,
            position: "absolute",
          },
          "@keyframes planning-pulse": {
            "0%, 100%": { opacity: 0.35, transform: "scale(0.7)" },
            "50%": { opacity: 1, transform: "scale(1)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            "&::after": {
              animation: "none",
              opacity: 0.8,
            },
          },
        }}
      />

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.55)",
          fontSize: 13,
          lineHeight: "19.5px",
        }}
      >
        {STAGES[stageIndex]}
      </Typography>
    </Box>
  );
}
