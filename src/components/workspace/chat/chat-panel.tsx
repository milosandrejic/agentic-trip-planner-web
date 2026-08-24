"use client";

import {
  useState,
  type ReactNode,
} from "react";

import { Box } from "@mui/material";

import type { Message } from "@/types/api";

import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

interface ChatPanelProps {
  action?: ReactNode;
  children?: ReactNode;
  isLoading: boolean;
  messages: readonly Message[];
  onSendMessage: (query: string) => void;
  threadTitle: string;
}

export function ChatPanel({
  action,
  children,
  isLoading,
  messages,
  onSendMessage,
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

      <ChatInput
        isLoading={isLoading}
        onChange={setDraft}
        onSubmit={handleSubmit}
        placeholder="Ask anything about your trip…"
        value={draft}
      />
    </Box>
  );
}
