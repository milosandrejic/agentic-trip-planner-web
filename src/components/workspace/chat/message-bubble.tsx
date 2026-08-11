import Image from "next/image";

import {
  Box, Typography,
} from "@mui/material";

import assistantIcon from "@/assets/preview-assistant-icon.svg";

import type { Message } from "@/types/api";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {
        !isUser &&
        <Box
          sx={{
            alignItems: "center",
            background: "linear-gradient(135deg, #183153 0%, #2f9c95 100%)",
            borderRadius: "8px",
            display: "flex",
            flexShrink: 0,
            height: 26,
            justifyContent: "center",
            width: 26,
          }}
        >
          <Image
            src={assistantIcon}
            alt=""
            width={11}
            height={11}
            aria-hidden="true"
          />
        </Box>
      }

      <Box
        sx={{
          backgroundColor: isUser ? "primary.main" : "#f7f5f2",
          borderRadius: isUser ? "16px 16px 3px 16px" : "3px 16px 16px 16px",
          color: isUser ? "primary.contrastText" : "text.primary",
          fontSize: 13.5,
          lineHeight: 1.55,
          maxWidth: "90%",
          padding: "10px 14px",
        }}
      >
        <Typography component="p" sx={{ whiteSpace: "pre-wrap" }}>
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}
