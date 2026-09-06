import {
  Box,
  Typography,
} from "@mui/material";

import type { BudgetSummary } from "@/utils/budget";
import { formatCurrency } from "@/utils/format-currency";

import { brandColors } from "@/theme/palette";

interface BudgetFootnoteProps {
  amount: number | null;
  currency: string;
  icon: string;
}

function BudgetFootnote({ amount, currency, icon }: BudgetFootnoteProps) {
  if (amount === null) {
    return null;
  }

  return (
    <Typography
      component="span"
      sx={{
        color: "rgba(24, 49, 83, 0.4)",
        fontSize: 11,
        lineHeight: "16.5px",
      }}
    >
      {icon} {formatCurrency(amount, currency)}
    </Typography>
  );
}

interface BudgetPanelProps {
  summary: BudgetSummary;
}

/**
 * Three shapes, depending on what the planner captured:
 *
 * - budget and spend → spend against the stated budget, with a consumption bar
 * - spend only → the estimate alone, with a composition bar
 * - budget only → the budget alone, no bar (a bar reading zero would be a placeholder)
 */
export function BudgetPanel({ summary }: BudgetPanelProps) {
  const {
    activitiesTotal,
    budget,
    currency,
    flightsTotal,
    hotelsTotal,
    spend,
  } = summary;

  const headline = spend ?? budget;
  const hasBoth = budget !== null && spend !== null;
  const spendShare = hasBoth && budget > 0 ? Math.min(100, (spend / budget) * 100) : 0;

  const total = (flightsTotal ?? 0) + (hotelsTotal ?? 0) + (activitiesTotal ?? 0);
  const share = (part: number | null): number => {
    if (part === null || total <= 0) {
      return 0;
    }

    return (part / total) * 100;
  };

  if (headline === null) {
    return null;
  }

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
          {formatCurrency(headline, currency)}
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
          {
            hasBoth ? `of ${formatCurrency(budget, currency)} budget` : (spend === null ? "Your budget" : "Estimated")
          }
        </Typography>
      </Box>

      {
        spend !== null &&
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
          {
            hasBoth &&
            <Box
              sx={{
                background: `linear-gradient(to right, ${brandColors.teal}, ${brandColors.navy})`,
                width: `${spendShare}%`,
              }}
            />
          }

          {
            !hasBoth &&
            <>
              <Box sx={{ backgroundColor: "secondary.main", width: `${share(flightsTotal)}%` }} />

              <Box sx={{ backgroundColor: "primary.main", width: `${share(hotelsTotal)}%` }} />

              <Box
                sx={{
                  backgroundColor: "rgba(24, 49, 83, 0.35)",
                  width: `${share(activitiesTotal)}%`,
                }}
              />
            </>
          }
        </Box>
      }

      {
        (flightsTotal !== null || hotelsTotal !== null) &&
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            paddingTop: "6px",
          }}
        >
          <BudgetFootnote
            amount={flightsTotal}
            currency={currency}
            icon="✈"
          />

          <BudgetFootnote
            amount={hotelsTotal}
            currency={currency}
            icon="🏨"
          />
        </Box>
      }
    </Box>
  );
}
