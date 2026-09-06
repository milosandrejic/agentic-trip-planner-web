"use client";

import {
  useState,
  type ReactNode,
} from "react";

import { Box } from "@mui/material";

import { isApiError } from "@/api/errors";

import type { Message } from "@/types/api";

const FIELD_LABELS: Record<string, string> = {
  destination: "where you are going",
  duration: "how long for",
  traveler_count: "how many of you",
};

function toFieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field.replace(/_/g, " ");
}

/** 409 means a turn is already in flight, which is a wait rather than an error. */
function isTurnRunning(error: Error): boolean {
  return isApiError(error) && error.status === 409;
}

interface NoticeProps {
  text: string;
  tone: "error" | "info";
}

function Notice({ text, tone }: NoticeProps) {
  return (
    <Box
      role={tone === "error" ? "alert" : "status"}
      sx={{
        backgroundColor: tone === "error" ? "rgba(211, 47, 47, 0.07)" : "rgba(47, 156, 149, 0.07)",
        borderRadius: "10px",
        color: tone === "error" ? "error.main" : "secondary.main",
        fontSize: 12.5,
        lineHeight: "18px",
        marginInline: "20px",
        marginTop: "10px",
        padding: "8px 12px",
      }}
    >
      {text}
    </Box>
  );
}

import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { PlanningProgress } from "./planning-progress";

interface ChatPanelProps {
  action?: ReactNode;
  children?: ReactNode;
  /** Fields the planner still needs, when the last turn asked for more. */
  missingFields?: readonly string[];
  isLoading: boolean;
  messages: readonly Message[];
  onSendMessage: (query: string) => void;
  /** A turn already running (409) is not a failure — it is reported as such. */
  sendError: Error | null;
  threadTitle: string;
}

export function ChatPanel({
  action,
  children,
  isLoading,
  messages,
  missingFields,
  onSendMessage,
  sendError,
  threadTitle,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(): void {
    const trimmed = draft.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setDraft("");
    onSendMessage(trimmed);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <MessageList
          action={action}
          messages={messages}
          threadTitle={threadTitle}
        />

        {
          Boolean(children) &&
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "0 20px 20px",
            }}
          >
            {children}
          </Box>
        }
      </Box>

      {
        isLoading &&
        <PlanningProgress />
      }

      {
        !isLoading && sendError !== null &&
        <Notice
          text={
            isTurnRunning(sendError) ? "That plan is still being worked on. Give it a moment, then try again." : sendError.message
          }
          tone={isTurnRunning(sendError) ? "info" : "error"}
        />
      }

      {
        !isLoading && missingFields !== undefined && missingFields.length > 0 &&
        <Notice
          text={`Still needed: ${missingFields.map(toFieldLabel).join(", ")}`}
          tone="info"
        />
      }

      <ChatInput
        isLoading={isLoading}
        onChange={setDraft}
        onSubmit={handleSubmit}
        placeholder={isLoading ? "Planning in progress…" : "Ask anything about your trip…"}
        value={draft}
      />
    </Box>
  );
}
