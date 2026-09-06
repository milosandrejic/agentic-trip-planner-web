import type { ReactNode } from "react";

import {
  Box, Typography,
} from "@mui/material";

import type { Message } from "@/types/api";

import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  action?: ReactNode;
  messages: readonly Message[];
  threadTitle: string;
}

export function MessageList({ action, messages, threadTitle }: MessageListProps) {
  // Anchored to the message that actually produced a plan, rather than to a fixed
  // position — a thread that only ever got clarifications shows no banner at all.
  const tripCreatedIndex = messages.findIndex((message) => message.itinerary !== null);
  const createdItinerary = tripCreatedIndex === -1 ? null : messages[tripCreatedIndex].itinerary;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          borderBottom: "1px solid rgba(24, 49, 83, 0.07)",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          paddingBottom: "14px",
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: 14.5,
            fontWeight: 700,
            letterSpacing: "-0.29px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {threadTitle}
        </Typography>

        {action}
      </Box>

      {
        messages.map((message, index) => (
          <Box key={message.id}>
            {
              index === tripCreatedIndex && createdItinerary !== null &&
              <Box
                sx={{
                  backgroundColor: "rgba(47, 156, 149, 0.07)",
                  border: "1px solid rgba(47, 156, 149, 0.18)",
                  borderRadius: "12px",
                  marginBottom: "14px",
                  padding: "10px 16px",
                  textAlign: "center",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    color: "secondary.main",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Trip created — {createdItinerary.destination}
                </Typography>

                <Typography
                  component="p"
                  sx={{
                    color: "rgba(24, 49, 83, 0.5)",
                    fontSize: 12,
                    lineHeight: "18px",
                    paddingTop: "2px",
                  }}
                >
                  {createdItinerary.total_days}-day itinerary
                </Typography>
              </Box>
            }

            <MessageBubble message={message} />
          </Box>
        ))
      }
    </Box>
  );
}
