import type { ComponentType } from "react";

import {
  Box,
  Button,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material";
import {
  MapOutlined,
  RefreshRounded,
  IosShareRounded,
  FileDownloadOutlined,
} from "@mui/icons-material";

import { brandColors } from "@/theme/palette";

interface QuickAction {
  icon: ComponentType<SvgIconProps>;
  isPrimary: boolean;
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onExport: () => void;
  onOpenMap: () => void;
  onRegenerate: () => void;
  onShare: () => void;
}

export function QuickActions({
  onExport,
  onOpenMap,
  onRegenerate,
  onShare,
}: QuickActionsProps) {
  const actions: readonly QuickAction[] = [
    {
      icon: FileDownloadOutlined,
      isPrimary: true,
      label: "Export PDF",
      onClick: onExport,
    },
    {
      icon: MapOutlined,
      isPrimary: false,
      label: "Open Map",
      onClick: onOpenMap,
    },
    {
      icon: IosShareRounded,
      isPrimary: false,
      label: "Share Trip",
      onClick: onShare,
    },
    {
      icon: RefreshRounded,
      isPrimary: false,
      label: "Regenerate",
      onClick: onRegenerate,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        paddingTop: "10px",
      }}
    >
      {
        actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              disableElevation
              onClick={action.onClick}
              startIcon={<Icon sx={{ fontSize: 14 }} />}
              sx={{
                backgroundColor: action.isPrimary ? "primary.main" : brandColors.control,
                borderRadius: "10px",
                color: action.isPrimary ? "primary.contrastText" : "text.primary",
                fontSize: 13.5,
                fontWeight: 600,
                justifyContent: "flex-start",
                lineHeight: "20.25px",
                padding: "9px 14px",
                textTransform: "none",
                "& .MuiButton-startIcon": {
                  marginLeft: 0,
                  marginRight: "7px",
                },
                "&:hover": {
                  backgroundColor: action.isPrimary ? "primary.dark" : "rgba(24, 49, 83, 0.09)",
                },
              }}
            >
              {action.label}
            </Button>
          );
        })
      }
    </Box>
  );
}
