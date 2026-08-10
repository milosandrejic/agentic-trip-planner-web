import type {
  Ref, KeyboardEvent,
} from "react";

import Image from "next/image";

import {
  Box,
  InputBase,
} from "@mui/material";

import { borderRadii } from "@/theme/shape";
import sendIcon from "@/assets/hero-send-icon.svg";

interface PromptBoxProps {
  canSubmit: boolean;
  id: string;
  inputRef?: Ref<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
}

export function PromptBox({ canSubmit, id, inputRef, onChange, onSubmit, placeholder, value }: PromptBoxProps) {
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
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        border: "1.5px solid rgba(24, 49, 83, 0.1)",
        borderRadius: `${borderRadii.feature}px`,
        boxShadow: "0px 8px 40px 0px rgba(24, 49, 83, 0.12), 0px 1px 4px 0px rgba(24, 49, 83, 0.06)",
        display: "flex",
        gap: "12px",
        padding: "14px 14px 14px 20px",
        width: "100%",
      }}
    >
      <InputBase
        id={id}
        inputRef={inputRef}
        multiline
        minRows={2}
        maxRows={4}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          color: "text.primary",
          flex: 1,
          fontSize: 15,
          letterSpacing: "-0.15px",
          lineHeight: 1.58,
        }}
      />

      <Box
        component="button"
        type="button"
        aria-label="Start planning this trip"
        disabled={!canSubmit}
        onClick={onSubmit}
        sx={{
          alignItems: "center",
          backgroundColor: "rgba(24, 49, 83, 0.13)",
          border: "none",
          borderRadius: "22px",
          cursor: canSubmit ? "pointer" : "not-allowed",
          display: "flex",
          flexShrink: 0,
          height: 44,
          justifyContent: "center",
          opacity: canSubmit ? 1 : 0.5,
          width: 44,
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
  );
}
