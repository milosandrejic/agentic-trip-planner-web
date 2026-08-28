"use client";

import type { ReactNode } from "react";

import { FileDownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogContent,
} from "@mui/material";

import { useExportFlow } from "@/hooks/use-export-flow";

import { brandColors } from "@/theme/palette";

import type { Itinerary } from "@/types/itinerary";

const CARD_WIDTH = 356;

interface ExportScreen {
  action: ReactNode;
  description: string;
  icon: string;
  iconBackground: string;
  title: string;
}

interface ExportActionButtonProps {
  label: string;
  onClick: () => void;
  startIcon?: ReactNode;
}

function ExportActionButton({ label, onClick, startIcon }: ExportActionButtonProps) {
  return (
    <Button
      disableElevation
      onClick={onClick}
      startIcon={startIcon}
      variant="contained"
      sx={{
        backgroundColor: "primary.main",
        borderRadius: "12px",
        color: "primary.contrastText",
        fontSize: 15,
        fontWeight: 600,
        lineHeight: "22.5px",
        padding: "12px 28px",
        textTransform: "none",
        width: "100%",
        "& .MuiButton-startIcon": {
          marginLeft: 0,
          marginRight: "7px",
        },
      }}
    >
      {label}
    </Button>
  );
}

interface ExportDialogProps {
  itinerary: Itinerary;
  onClose: () => void;
  title: string;
}

export function ExportDialog({ itinerary, onClose, title }: ExportDialogProps) {
  const { progress, reset, start, status } = useExportFlow();

  const summary = `${title} — complete itinerary, flights, hotels and attractions.`;

  function handleRetry(): void {
    reset();
    start();
  }

  const screens: Record<typeof status, ExportScreen> = {
    error: {
      action: (
        <ExportActionButton
          label="Try again"
          onClick={handleRetry}
        />
      ),
      description: "Something went wrong while building your travel guide.",
      icon: "⚠️",
      iconBackground: "rgba(255, 138, 61, 0.12)",
      title: "Export failed",
    },
    idle: {
      action: (
        <ExportActionButton
          label="Create travel guide"
          onClick={start}
        />
      ),
      description: `${itinerary.total_days} days in ${itinerary.destination}, exported as a PDF you can take offline.`,
      icon: "📄",
      iconBackground: brandColors.control,
      title: "Export travel guide",
    },
    preparing: {
      action: null,
      description: "Compiling flights, hotels, day-by-day itinerary and local tips…",
      icon: "📄",
      iconBackground: brandColors.control,
      title: "Preparing your travel guide…",
    },
    ready: {
      action: (
        // The export backend is deferred, so this acknowledges and closes rather than
        // producing a file — wiring a real download here is the remaining step.
        <ExportActionButton
          label="Download PDF"
          onClick={onClose}
          startIcon={<FileDownloadOutlined sx={{ fontSize: 14 }} />}
        />
      ),
      description: summary,
      icon: "✅",
      iconBackground: "rgba(47, 156, 149, 0.1)",
      title: "Travel Guide Ready",
    },
  };

  const screen = screens[status];

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open
    >
      <DialogContent sx={{ padding: "32px 32px 28px" }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            marginInline: "auto",
            maxWidth: CARD_WIDTH,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: screen.iconBackground,
              borderRadius: "16px",
              display: "flex",
              fontSize: 24,
              height: 56,
              justifyContent: "center",
              lineHeight: "36px",
              width: 56,
            }}
          >
            {screen.icon}
          </Box>

          <Typography
            component="h2"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-manrope)",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.6px",
              lineHeight: "30px",
              paddingTop: "16px",
              textAlign: "center",
            }}
          >
            {screen.title}
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.55)",
              fontSize: 14,
              lineHeight: "21.7px",
              paddingTop: "8px",
              textAlign: "center",
            }}
          >
            {screen.description}
          </Typography>

          {
            status === "preparing" &&
            <Box sx={{ paddingBlock: "24px", width: "100%" }}>
              <Box
                sx={{
                  backgroundColor: "#f0eee9",
                  borderRadius: "3px",
                  height: 6,
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(to right, ${brandColors.teal}, ${brandColors.navy})`,
                    borderRadius: "3px",
                    height: 6,
                    transition: "width 90ms linear",
                    width: `${progress}%`,
                  }}
                />
              </Box>

              <Typography
                component="p"
                sx={{
                  color: "rgba(24, 49, 83, 0.4)",
                  fontSize: 12,
                  lineHeight: "18px",
                  paddingTop: "8px",
                  textAlign: "center",
                }}
              >
                {progress}%
              </Typography>
            </Box>
          }

          {
            Boolean(screen.action) &&
            <Box sx={{ paddingTop: "24px", width: "100%" }}>
              {screen.action}
            </Box>
          }
        </Box>
      </DialogContent>
    </Dialog>
  );
}
