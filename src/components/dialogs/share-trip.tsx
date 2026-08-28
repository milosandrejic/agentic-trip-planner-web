"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  MailOutlined,
  CloseRounded,
  CheckRounded,
  ContentCopyRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { brandColors } from "@/theme/palette";

const COPIED_RESET_MS = 2000;

const fieldStyles = {
  backgroundColor: brandColors.control,
  borderRadius: "10px",
  flex: 1,
  minWidth: 0,
  padding: "10px 14px",
} as const;

interface SectionLabelProps {
  text: string;
}

function SectionLabel({ text }: SectionLabelProps) {
  return (
    <Typography
      component="p"
      sx={{
        color: "rgba(24, 49, 83, 0.4)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.96px",
        lineHeight: "18px",
        textTransform: "uppercase",
      }}
    >
      {text}
    </Typography>
  );
}

interface ShareTripDialogProps {
  onClose: () => void;
  threadId: string;
  title: string;
}

/**
 * There is no share endpoint (see *Deferred / future* in the plan), so this cannot mint
 * a public URL. The link is the in-app trip route, which only signed-in members of the
 * trip can open — the copy says so rather than implying the design's public link.
 *
 * Email uses a `mailto:` compose so it works with no backend; the design's QR section
 * is omitted because generating one needs a dependency the plan does not include.
 */
export function ShareTripDialog({ onClose, threadId, title }: ShareTripDialogProps) {
  const [recipient, setRecipient] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  // The dialog only ever renders from a click, so window is available; no effect needed.
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const tripUrl = `${origin}/trips/${threadId}`;

  useEffect(() => {
    if (!hasCopied) {
      return undefined;
    }

    const timer = window.setTimeout(() => setHasCopied(false), COPIED_RESET_MS);

    return () => window.clearTimeout(timer);
  }, [hasCopied]);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(tripUrl);
      setHasCopied(true);
    } catch (error) {
      console.error("Could not copy the trip link.", error);
    }
  }

  function handleEmail(): void {
    const subject = encodeURIComponent(`Trip plan: ${title}`);
    const body = encodeURIComponent(`Here is the plan for ${title}:\n\n${tripUrl}`);

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open
    >
      <DialogTitle
        sx={{
          alignItems: "center",
          display: "flex",
          fontWeight: 800,
          gap: "16px",
          justifyContent: "space-between",
          letterSpacing: "-0.54px",
          padding: "20px 24px",
        }}
      >
        Share Trip

        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            backgroundColor: brandColors.control,
            borderRadius: "8px",
            flexShrink: 0,
            padding: "6px",
          }}
        >
          <CloseRounded sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "20px 24px" }}>
        <SectionLabel text="Trip link" />

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            paddingTop: "8px",
          }}
        >
          <Box sx={fieldStyles}>
            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.6)",
                fontSize: 13,
                lineHeight: "19.5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tripUrl}
            </Typography>
          </Box>

          <Button
            disableElevation
            onClick={handleCopy}
            startIcon={
              hasCopied ? <CheckRounded sx={{ fontSize: 14 }} /> : <ContentCopyRounded sx={{ fontSize: 14 }} />
            }
            sx={{
              backgroundColor: brandColors.control,
              borderRadius: "10px",
              color: "text.primary",
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "19.5px",
              padding: "10px 14px",
              textTransform: "none",
              "& .MuiButton-startIcon": {
                marginLeft: 0,
                marginRight: "7px",
              },
            }}
          >
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </Box>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.4)",
            fontSize: 12,
            lineHeight: "18px",
            paddingTop: "8px",
          }}
        >
          Anyone you send this to needs access to the trip to open it.
        </Typography>

        <Box sx={{ paddingTop: "20px" }}>
          <SectionLabel text="Share by email" />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            paddingTop: "8px",
          }}
        >
          <TextField
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="friend@example.com"
            size="small"
            type="email"
            value={recipient}
            sx={{
              flex: 1,
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                backgroundColor: brandColors.control,
                borderRadius: "10px",
                fontSize: 13,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          />

          <Button
            disableElevation
            onClick={handleEmail}
            startIcon={<MailOutlined sx={{ fontSize: 14 }} />}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "primary.contrastText",
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "19.5px",
              padding: "10px 14px",
              textTransform: "none",
              "& .MuiButton-startIcon": {
                marginLeft: 0,
                marginRight: "7px",
              },
            }}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
