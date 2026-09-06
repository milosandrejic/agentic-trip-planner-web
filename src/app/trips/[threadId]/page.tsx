"use client";

import {
  useRef,
  useState,
} from "react";
import {
  useRouter,
  useParams,
} from "next/navigation";

import { DeleteOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Tooltip,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  DialogContentText,
} from "@mui/material";

import { useDialog } from "@/hooks/use-dialog";
import { useDeleteThread } from "@/hooks/use-delete-thread";
import {
  useThread,
  useSendMessage,
} from "@/hooks/use-thread";

import { getLatestItinerary } from "@/utils/planner-result";
import { buildItinerarySummary } from "@/utils/itinerary-summary";

import { WorkspaceLayout } from "@/layouts/workspace-layout/workspace-layout";

import { RequireAuth } from "@/components/auth/require-auth";
import { ChatPanel } from "@/components/workspace/chat/chat-panel";
import { TripOverview } from "@/components/workspace/overview/trip-overview";
import { SummaryCards } from "@/components/workspace/itinerary/summary-cards";
import { WorkspaceSidebar } from "@/components/workspace/sidebar/workspace-sidebar";
import { ItineraryTimeline } from "@/components/workspace/itinerary/itinerary-timeline";

function CenteredMessage({ text }: { text: string }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: 4,
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "text.disabled",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function ThreadWorkspace({ threadId }: { threadId: string }) {
  const router = useRouter();
  const itineraryRef = useRef<HTMLDivElement>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const {
    data,
    error,
    isError,
    isPending,
  } = useThread(threadId);

  const sendMessage = useSendMessage(threadId);
  const deleteThread = useDeleteThread();
  const dialog = useDialog();

  function handleSendMessage(query: string): void {
    sendMessage.mutate({ query });
  }

  function scrollToItinerary(): void {
    itineraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** Gap #9 — there is no regenerate endpoint, so this is a follow-up message. */
  function handleRegenerate(): void {
    sendMessage.mutate({ query: "Please regenerate this itinerary with fresh options." });
  }

  function handleConfirmDelete(): void {
    deleteThread.mutate(threadId, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
        router.push("/trips");
      },
    });
  }

  if (isPending) {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "100dvh",
        }}
      >
        <CircularProgress
          size={32}
          sx={{ color: "text.disabled" }}
        />
      </Box>
    );
  }

  if (isError) {
    return <CenteredMessage text={error.message} />;
  }

  // The API returns messages newest-first; the transcript and the latest-itinerary
  // lookup both expect chronological order.
  const messages = [...data.messages].reverse();
  const itinerary = getLatestItinerary(messages);

  const deleteAction = (
    <Tooltip title="Delete trip">
      <IconButton
        aria-label="Delete trip"
        onClick={() => setIsConfirmingDelete(true)}
        size="small"
        sx={{ color: "text.disabled" }}
      >
        <DeleteOutlineRounded sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );

  const overview = itinerary ? (
    <TripOverview
      itinerary={itinerary}
      status={data.thread.status}
      title={data.thread.title}
      onExport={() => dialog.open("export", { itinerary, title: data.thread.title })}
      onOpenMap={() => dialog.open("map", { itinerary })}
      onRegenerate={handleRegenerate}
      onShare={() => dialog.open("share", { threadId, title: data.thread.title })}
    />
  ) : <Box />;

  return (
    <WorkspaceLayout
      overview={overview}
      sidebar={<WorkspaceSidebar />}
    >
      <ChatPanel
        action={deleteAction}
        isLoading={sendMessage.isPending}
        messages={messages}
        onSendMessage={handleSendMessage}
        threadTitle={data.thread.title}
      >
        {
          itinerary !== null &&
          <SummaryCards
            summary={buildItinerarySummary(itinerary)}
            onExplorePlaces={() => dialog.open("map", { itinerary })}
            onViewFlights={() => dialog.open("flights", {
              destination: itinerary.destination,
              flights: itinerary.flights,
              travelerCount: itinerary.traveler_count,
            })}
            onViewHotels={() => dialog.open("hotels", {
              destination: itinerary.destination,
              hotels: itinerary.hotels,
              travelerCount: itinerary.traveler_count,
            })}
            onViewItinerary={scrollToItinerary}
          />
        }

        {
          itinerary !== null &&
          <Box ref={itineraryRef}>
            <ItineraryTimeline days={itinerary.days} />
          </Box>
        }
      </ChatPanel>

      <Dialog
        open={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
      >
        <DialogTitle>Delete this trip?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            “{data.thread.title}” and its messages will be removed. This cannot be undone.
          </DialogContentText>

          {
            deleteThread.isError &&
            <DialogContentText sx={{ color: "error.main", marginTop: 2 }}>
              {deleteThread.error.message}
            </DialogContentText>
          }
        </DialogContent>

        <DialogActions>
          <Button
            disabled={deleteThread.isPending}
            onClick={() => setIsConfirmingDelete(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            disabled={deleteThread.isPending}
            onClick={handleConfirmDelete}
            variant="contained"
          >
            {deleteThread.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </WorkspaceLayout>
  );
}

export default function ThreadPage() {
  const params = useParams<{ threadId: string }>();

  return (
    <RequireAuth>
      <ThreadWorkspace threadId={params.threadId} />
    </RequireAuth>
  );
}
