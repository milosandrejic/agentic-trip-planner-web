import type { ReactNode } from "react";

import { Button } from "@mui/material";

interface BookingButtonProps {
  href: string | null;
  label: string;
  startIcon?: ReactNode;
  sx?: Record<string, unknown>;
}

/**
 * The planner often returns no `booking_url`, so the action degrades to a disabled
 * button rather than an anchor that navigates nowhere.
 */
export function BookingButton({ href, label, startIcon, sx }: BookingButtonProps) {
  const baseStyles = {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
    fontWeight: 600,
    textTransform: "none",
    whiteSpace: "nowrap",
    "&.Mui-disabled": {
      backgroundColor: "rgba(24, 49, 83, 0.12)",
      color: "rgba(24, 49, 83, 0.4)",
    },
    ...sx,
  };

  if (!href) {
    return (
      <Button
        disabled
        disableElevation
        startIcon={startIcon}
        variant="contained"
        sx={baseStyles}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      component="a"
      disableElevation
      href={href}
      rel="noopener noreferrer"
      startIcon={startIcon}
      target="_blank"
      variant="contained"
      sx={baseStyles}
    >
      {label}
    </Button>
  );
}
