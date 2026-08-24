"use client";

import type { ReactNode } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import { estimateBudget } from "@/utils/budget";
import {
  getHeroPhoto,
  getWeatherDays,
  formatDateRange,
} from "@/utils/trip-overview";

import { brandColors } from "@/theme/palette";
import heroFallback from "@/assets/hero-santorini.jpg";

import { PlacePhoto } from "@/components/place-photo/place-photo";
import { BudgetPanel } from "@/components/workspace/overview/budget-panel";
import { QuickActions } from "@/components/workspace/overview/quick-actions";
import { WeatherPanel } from "@/components/workspace/overview/weather-panel";
import {
  StatusChip,
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
  const budget = estimateBudget(itinerary);

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
          heroPhoto.kind === "reference" &&
          <PlacePhoto
            alt={itinerary.destination}
            fallbackSrc={heroFallback.src}
            maxWidthPx={600}
            photoReference={heroPhoto.reference}
            style={heroImageStyles}
          />
        }

        {
          heroPhoto.kind !== "reference" &&
          <Box
            alt={itinerary.destination}
            component="img"
            src={heroPhoto.kind === "url" ? heroPhoto.url : heroFallback.src}
            sx={heroImageStyles}
          />
        }

        <Box
          sx={{
            background: "linear-gradient(to top, rgba(24, 49, 83, 0.72), rgba(24, 49, 83, 0) 55%)",
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
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ marginTop: "5px" }}>
            <StatusChip status={status} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ padding: "14px 16px" }}>
        <OverviewSection
          hasDivider
          title="Trip details"
        >
          <MetaRow
            icon="📅"
            label="Dates"
            value={formatDateRange(itinerary)}
          />

          <MetaRow
            icon="🗓"
            label="Duration"
            value={`${itinerary.total_days} days`}
          />

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

        <OverviewSection
          hasDivider
          title="Budget"
        >
          <BudgetPanel estimate={budget} />
        </OverviewSection>

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
