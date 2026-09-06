"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import { useThreads } from "@/hooks/use-threads";

import { getFlagEmoji } from "@/utils/country";
import { formatDateRange } from "@/utils/format-date-range";

import { brandColors } from "@/theme/palette";

import { StatusChip } from "@/components/status-chip/status-chip";
import { PlacePhoto } from "@/components/place-photo/place-photo";

import type { ThreadSummary } from "@/types/api";

const THREADS_PAGE_SIZE = 20;
const THUMBNAIL_HEIGHT = 70;

interface RecentTripItemProps {
  isActive: boolean;
  thread: ThreadSummary;
}

/**
 * The design's trip card, now that `GET /threads` carries a cover image, country and
 * dates. Each is independently optional — a thread has no trip until its first turn
 * completes — so the thumbnail collapses to its navy panel and the flag and date row
 * omit themselves rather than leaving gaps.
 */
function RecentTripItem({ isActive, thread }: RecentTripItemProps) {
  const flag = getFlagEmoji(thread.country_code);
  const dateRange = formatDateRange(thread.start_date, thread.end_date);

  return (
    <Box
      aria-current={isActive ? "page" : undefined}
      component={NextLink}
      href={`/trips/${thread.id}`}
      sx={{
        backgroundColor: isActive ? "background.paper" : "transparent",
        border: "1.5px solid",
        borderColor: isActive ? "rgba(24, 49, 83, 0.15)" : "transparent",
        borderRadius: "14px",
        boxShadow: isActive ? "0 4px 16px rgba(24, 49, 83, 0.1)" : "none",
        display: "block",
        overflow: "hidden",
        textDecoration: "none",
        transition: "background-color 120ms ease, border-color 120ms ease",
        "&:hover": {
          backgroundColor: isActive ? "background.paper" : "rgba(24, 49, 83, 0.04)",
        },
      }}
    >
      {
        thread.cover_image_url &&
        <Box
          sx={{
            backgroundColor: brandColors.overlay,
            height: THUMBNAIL_HEIGHT,
            position: "relative",
            width: "100%",
          }}
        >
          <PlacePhoto
            alt=""
            maxWidthPx={480}
            photoReference={thread.cover_image_url}
            style={{
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
              width: "100%",
            }}
          />

          <Box
            sx={{
              background: "linear-gradient(to bottom, rgba(24, 49, 83, 0), rgba(24, 49, 83, 0.45))",
              inset: 0,
              position: "absolute",
            }}
          />

          {
            flag !== null &&
            <Typography
              component="span"
              sx={{
                fontSize: 15,
                lineHeight: "22.5px",
                position: "absolute",
                right: 12,
                top: 6,
              }}
            >
              {flag}
            </Typography>
          }
        </Box>
      }

      <Box sx={{ padding: "9px 12px 11px" }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          {
            flag !== null && !thread.cover_image_url &&
            <Typography
              component="span"
              sx={{
                flexShrink: 0,
                fontSize: 14,
                lineHeight: "19.5px",
              }}
            >
              {flag}
            </Typography>
          }

          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-manrope)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.195px",
              lineHeight: "19.5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {thread.title}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <StatusChip
            status={thread.status}
            sx={{
              flexShrink: 0,
              height: 19,
              "& .MuiChip-label": {
                fontSize: 10,
                lineHeight: "15px",
                paddingInline: "7px",
              },
            }}
          />
        </Box>

        {
          dateRange !== null &&
          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.4)",
              fontSize: 12,
              lineHeight: "18px",
              paddingTop: "2px",
            }}
          >
            {dateRange}
          </Typography>
        }
      </Box>
    </Box>
  );
}

interface RecentTripsMessageProps {
  text: string;
}

function RecentTripsMessage({ text }: RecentTripsMessageProps) {
  return (
    <Typography
      component="p"
      sx={{
        color: "rgba(24, 49, 83, 0.38)",
        fontSize: 11.5,
        lineHeight: 1.5,
        paddingInline: "11px",
      }}
    >
      {text}
    </Typography>
  );
}

export function RecentTrips() {
  const pathname = usePathname();
  const {
    data,
    isError,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useThreads({ limit: THREADS_PAGE_SIZE });

  const threads = data ?? [];

  return (
    <Box
      component="nav"
      aria-label="Recent trips"
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: "3px",
        marginTop: "10px",
        overflowY: "auto",
      }}
    >
      {
        isPending &&
        <RecentTripsMessage text="Loading trips…" />
      }

      {
        isError &&
        <RecentTripsMessage text="Couldn't load your trips." />
      }

      {
        !isPending && !isError && threads.length === 0 &&
        <RecentTripsMessage text="No trips yet." />
      }

      {
        threads.map((thread) => (
          <RecentTripItem
            key={thread.id}
            isActive={pathname === `/trips/${thread.id}`}
            thread={thread}
          />
        ))
      }

      {
        hasNextPage &&
        <Button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          variant="text"
          sx={{
            alignSelf: "flex-start",
            color: "secondary.main",
            fontSize: 11.5,
            fontWeight: 600,
            minWidth: 0,
            padding: "4px 11px",
            textTransform: "none",
          }}
        >
          {isFetchingNextPage ? "Loading…" : "Show more"}
        </Button>
      }
    </Box>
  );
}
