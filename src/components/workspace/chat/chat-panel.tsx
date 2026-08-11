"use client";

import { useState } from "react";

import { Box } from "@mui/material";

import type { Message } from "@/types/api";

import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

interface ChatPanelProps {
  isLoading: boolean;
  messages: readonly Message[];
  onSendMessage: (query: string) => void;
  threadTitle: string;
}

export function ChatPanel({ isLoading, messages, onSendMessage, threadTitle }: ChatPanelProps) {
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
          messages={messages}
          threadTitle={threadTitle}
        />
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
