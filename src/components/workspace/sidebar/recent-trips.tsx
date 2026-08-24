"use client";

import dayjs from "dayjs";
import NextLink from "next/link";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import { useThreads } from "@/hooks/use-threads";

import { StatusChip } from "@/components/status-chip/status-chip";

import type { ThreadSummary } from "@/types/api";

const THREADS_PAGE_SIZE = 20;

interface RecentTripItemProps {
  thread: ThreadSummary;
}

/**
 * `GET /threads` exposes only title, slug, status and timestamps (gap #4) — the flag
 * and date range in the design would each need a per-thread fetch, so the row shows
 * title, status and the last-updated date instead.
 */
function RecentTripItem({ thread }: RecentTripItemProps) {
  return (
    <Box
      component={NextLink}
      href={`/trips/${thread.id}`}
      sx={{
        borderRadius: "10px",
        display: "block",
        padding: "9px 11px",
        textDecoration: "none",
        "&:hover": {
          backgroundColor: "rgba(24, 49, 83, 0.04)",
        },
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.55)",
          fontSize: 12.5,
          fontWeight: 500,
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {thread.title}
      </Typography>

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: "6px",
          marginTop: "4px",
        }}
      >
        <StatusChip status={thread.status} />

        <Typography
          component="span"
          sx={{
            color: "rgba(24, 49, 83, 0.38)",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {dayjs(thread.updated_at).format("MMM D")}
        </Typography>
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
