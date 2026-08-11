"use client";

import type { KeyboardEvent } from "react";

import Image from "next/image";

import {
  Box,
  InputBase,
} from "@mui/material";

import sendIcon from "@/assets/preview-send-icon.svg";

interface ChatInputProps {
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
}

export function ChatInput({ isLoading, onChange, onSubmit, placeholder, value }: ChatInputProps) {
  const canSubmit = value.trim().length > 0 && !isLoading;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (canSubmit) {
      onSubmit();
    }
  }

  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(24, 49, 83, 0.07)",
        padding: "12px 16px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "#f7f5f2",
          borderRadius: "12px",
          display: "flex",
          gap: "8px",
          padding: "9px 13px",
        }}
      >
        <InputBase
          multiline
          minRows={1}
          maxRows={5}
          value={value}
          placeholder={placeholder}
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            color: "text.primary",
            flex: 1,
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        />

        <Box
          component="button"
          type="button"
          aria-label="Send message"
          disabled={!canSubmit}
          onClick={onSubmit}
          sx={{
            alignItems: "center",
            backgroundColor: canSubmit ? "primary.main" : "rgba(24, 49, 83, 0.13)",
            border: "none",
            borderRadius: "8px",
            cursor: canSubmit ? "pointer" : "not-allowed",
            display: "flex",
            flexShrink: 0,
            height: 28,
            justifyContent: "center",
            opacity: canSubmit ? 1 : 0.5,
            width: 28,
          }}
        >
          <Image
            src={sendIcon}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </Box>
      </Box>
    </Box>
  );
}
