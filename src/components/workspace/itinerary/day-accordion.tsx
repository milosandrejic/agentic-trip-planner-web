import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Box,
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";

import { brandColors } from "@/theme/palette";

import type { Day } from "@/types/itinerary";

import { ActivityItem } from "./activity-item";

interface DayAccordionProps {
  day: Day;
  isExpanded: boolean;
  onToggle: (dayNumber: number) => void;
}

export function DayAccordion({ day, isExpanded, onToggle }: DayAccordionProps) {
  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => onToggle(day.day)}
      sx={{ backgroundColor: brandColors.surface }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRounded sx={{ color: "text.disabled", fontSize: 14 }} />}
        sx={{ paddingInline: "16px" }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: isExpanded ? "primary.main" : "rgba(24, 49, 83, 0.07)",
              borderRadius: "9px",
              color: isExpanded ? "primary.contrastText" : "text.disabled",
              display: "flex",
              flexShrink: 0,
              fontFamily: "var(--font-manrope)",
              fontSize: 12,
              fontWeight: 800,
              height: 32,
              justifyContent: "center",
              lineHeight: "18px",
              width: 32,
            }}
          >
            {day.day}
          </Box>

          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-manrope)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.14px",
              lineHeight: "21px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Day {day.day} — {day.location}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: "0 16px 16px 20px" }}>
        {
          day.activities.length === 0 &&
          <Typography
            component="p"
            sx={{
              color: "text.disabled",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            No activities planned for this day yet.
          </Typography>
        }

        {
          day.activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === day.activities.length - 1}
            />
          ))
        }
      </AccordionDetails>
    </Accordion>
  );
}
