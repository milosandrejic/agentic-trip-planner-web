import {
  Box,
  Typography,
} from "@mui/material";

import type { WeatherDay } from "@/utils/trip-overview";

import { brandColors } from "@/theme/palette";

interface WeatherPanelProps {
  days: readonly WeatherDay[];
}

export function WeatherPanel({ days }: WeatherPanelProps) {
  if (days.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "6px",
        paddingTop: "10px",
      }}
    >
      {
        days.map((day) => (
          <Box
            key={day.key}
            sx={{
              backgroundColor: brandColors.canvas,
              borderRadius: "10px",
              flex: 1,
              minWidth: 0,
              padding: "8px 4px",
              textAlign: "center",
            }}
          >
            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.4)",
                fontSize: 10,
                lineHeight: "15px",
              }}
            >
              {day.dayOfMonth}
            </Typography>

            <Typography
              component="p"
              sx={{
                fontSize: 18,
                lineHeight: "18px",
                paddingTop: "4px",
              }}
            >
              {day.icon}
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "text.primary",
                fontFamily: "var(--font-manrope)",
                fontSize: 13,
                fontWeight: 700,
                lineHeight: "19.5px",
                paddingTop: "3px",
              }}
            >
              {day.temperature}
            </Typography>
          </Box>
        ))
      }
    </Box>
  );
}
