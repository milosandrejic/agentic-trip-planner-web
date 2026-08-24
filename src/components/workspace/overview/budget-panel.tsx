import {
  Box,
  Typography,
} from "@mui/material";

import { formatBudgetAmount } from "@/utils/budget";
import type { BudgetEstimate } from "@/utils/budget";

interface BudgetPanelProps {
  estimate: BudgetEstimate;
}

/**
 * The design shows a budget target with a "remaining" bar; the API has no target
 * (gap #2), so the headline is the estimated spend and the bar shows what makes it
 * up — flights, hotels, then activities.
 */
export function BudgetPanel({ estimate }: BudgetPanelProps) {
  const {
    activitiesTotal,
    currency,
    flightsTotal,
    hotelsTotal,
    total,
  } = estimate;

  const flightsShare = total > 0 ? (flightsTotal / total) * 100 : 0;
  const hotelsShare = total > 0 ? (hotelsTotal / total) * 100 : 0;
  const activitiesShare = total > 0 ? (activitiesTotal / total) * 100 : 0;

  return (
    <Box>
      <Box
        sx={{
          alignItems: "baseline",
          display: "flex",
          gap: "8px",
          justifyContent: "space-between",
          paddingTop: "10px",
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.66px",
            lineHeight: "33px",
          }}
        >
          {formatBudgetAmount(total, currency)}
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "secondary.main",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "18px",
          }}
        >
          Estimated
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(24, 49, 83, 0.08)",
          borderRadius: "3px",
          display: "flex",
          height: 5,
          marginTop: "8px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "secondary.main",
            width: `${flightsShare}%`,
          }}
        />

        <Box
          sx={{
            backgroundColor: "primary.main",
            width: `${hotelsShare}%`,
          }}
        />

        <Box
          sx={{
            backgroundColor: "rgba(24, 49, 83, 0.35)",
            width: `${activitiesShare}%`,
          }}
        />
      </Box>

      <Box
        sx={{
          color: "rgba(24, 49, 83, 0.4)",
          display: "flex",
          fontSize: 11,
          justifyContent: "space-between",
          lineHeight: "16.5px",
          paddingTop: "6px",
        }}
      >
        <Typography
          component="span"
          sx={{ fontSize: "inherit", lineHeight: "inherit" }}
        >
          ✈ {formatBudgetAmount(flightsTotal, currency)}
        </Typography>

        <Typography
          component="span"
          sx={{ fontSize: "inherit", lineHeight: "inherit" }}
        >
          🏨 {formatBudgetAmount(hotelsTotal, currency)}
        </Typography>
      </Box>
    </Box>
  );
}
