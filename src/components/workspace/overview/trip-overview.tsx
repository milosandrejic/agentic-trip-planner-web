"use client";

import type { ReactNode } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import {
  isBudgetEmpty,
  buildBudgetSummary,
} from "@/utils/budget";
import {
  getHeroPhoto,
  getWeatherDays,
  formatTravelers,
  formatItineraryDateRange,
} from "@/utils/trip-overview";

import { brandColors } from "@/theme/palette";

import { PlacePhoto } from "@/components/place-photo/place-photo";
import { BudgetPanel } from "@/components/workspace/overview/budget-panel";
import { QuickActions } from "@/components/workspace/overview/quick-actions";
import { WeatherPanel } from "@/components/workspace/overview/weather-panel";
import {
  StatusChip,
  getStatusColor,
  type StatusChipStatus,
} from "@/components/status-chip/status-chip";

import type { Itinerary } from "@/types/itinerary";

const HERO_HEIGHT = 160;

interface OverviewSectionProps {
  children: ReactNode;
  hasDivider: boolean;
  title: string;
}

function OverviewSection({ children, hasDivider, title }: OverviewSectionProps) {
  return (
    <Box
      sx={{
        borderBottom: hasDivider ? "1px solid rgba(24, 49, 83, 0.07)" : "none",
        marginBottom: hasDivider ? "14px" : 0,
        paddingBottom: hasDivider ? "14px" : 0,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: "rgba(24, 49, 83, 0.35)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.99px",
          lineHeight: "16.5px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

interface MetaRowProps {
  icon: string;
  label: string;
  value: string;
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        justifyContent: "space-between",
        paddingBlock: "5px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          color: "rgba(24, 49, 83, 0.5)",
          display: "flex",
          fontSize: 13,
          gap: "6px",
          lineHeight: "19.5px",
        }}
      >
        <Typography
          component="span"
          sx={{ fontSize: "inherit", lineHeight: "inherit" }}
        >
          {icon}
        </Typography>

        <Typography
          component="span"
          sx={{ fontSize: "inherit", lineHeight: "inherit" }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        component="span"
        sx={{
          color: "text.primary",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "19.5px",
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

interface TripOverviewProps {
  itinerary: Itinerary;
  onExport: () => void;
  onOpenMap: () => void;
  onRegenerate: () => void;
  onShare: () => void;
  status: StatusChipStatus;
  title: string;
}

export function TripOverview({
  itinerary,
  onExport,
  onOpenMap,
  onRegenerate,
  onShare,
  status,
  title,
}: TripOverviewProps) {
  const heroPhoto = getHeroPhoto(itinerary);
  const weatherDays = getWeatherDays(itinerary);
  const budget = buildBudgetSummary(itinerary);
  const dateRange = formatItineraryDateRange(itinerary);
  const travelers = formatTravelers(itinerary.traveler_count);

  const heroImageStyles = {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  } as const;

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: brandColors.overlay,
          height: HERO_HEIGHT,
          position: "relative",
          width: "100%",
        }}
      >
        {
          heroPhoto.kind === "path" &&
          <PlacePhoto
            alt={itinerary.destination}
            maxWidthPx={600}
            photoReference={heroPhoto.path}
            style={heroImageStyles}
          />
        }

        {
          heroPhoto.kind === "url" &&
          <Box
            alt={itinerary.destination}
            component="img"
            src={heroPhoto.url}
            sx={heroImageStyles}
          />
        }

        <Box
          sx={{
            background: [
              "linear-gradient(to top,",
              "rgba(10, 18, 30, 0.92) 0%,",
              "rgba(10, 18, 30, 0.55) 38%,",
              "rgba(10, 18, 30, 0) 78%)",
            ].join(" "),
            inset: 0,
            position: "absolute",
          }}
        />

        <Box
          sx={{
            bottom: 14,
            left: 14,
            position: "absolute",
            right: 14,
          }}
        >
          <Typography
            component="p"
            sx={{
              color: brandColors.white,
              fontFamily: "var(--font-manrope)",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "-0.4px",
              lineHeight: "24px",
              overflow: "hidden",
              textShadow: "0 1px 3px rgba(10, 18, 30, 0.55)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ marginTop: "6px" }}>
            <StatusChip
              status={status}
              sx={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(10, 18, 30, 0.55)",
                color: brandColors.white,
                "&::before": {
                  backgroundColor: getStatusColor(status),
                  borderRadius: "50%",
                  content: '""',
                  flexShrink: 0,
                  height: 6,
                  marginLeft: "10px",
                  width: 6,
                },
                "& .MuiChip-label": {
                  paddingLeft: "6px",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ padding: "14px 16px" }}>
        <OverviewSection
          hasDivider
          title="Trip details"
        >
          {
            dateRange !== null &&
            <MetaRow
              icon="📅"
              label="Dates"
              value={dateRange}
            />
          }

          <MetaRow
            icon="🗓"
            label="Duration"
            value={`${itinerary.total_days} days`}
          />

          {
            travelers !== null &&
            <MetaRow
              icon="👥"
              label="Travellers"
              value={travelers}
            />
          }

          <MetaRow
            icon="📍"
            label="Destination"
            value={itinerary.destination}
          />
        </OverviewSection>

        {
          weatherDays.length > 0 &&
          <OverviewSection
            hasDivider
            title="Weather forecast"
          >
            <WeatherPanel days={weatherDays} />
          </OverviewSection>
        }

        {
          !isBudgetEmpty(budget) &&
          <OverviewSection
            hasDivider
            title="Budget"
          >
            <BudgetPanel summary={budget} />
          </OverviewSection>
        }

        <OverviewSection
          hasDivider={false}
          title="Quick actions"
        >
          <QuickActions
            onExport={onExport}
            onOpenMap={onOpenMap}
            onRegenerate={onRegenerate}
            onShare={onShare}
          />
        </OverviewSection>
      </Box>
    </Box>
  );
}
