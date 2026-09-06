import {
  Chip,
  type ChipProps,
} from "@mui/material";

import { statusColors } from "@/theme/palette";

export type StatusChipStatus =
  | "archived"
  | "completed"
  | "deleted"
  | "draft"
  | "failed"
  | "generating"
  | "pending"
  | "ready"
  | "running";

type StatusChipVariant = "active" | "archived" | "completed" | "planning";

interface StatusPresentation {
  label: string;
  variant: StatusChipVariant;
}

const statusPresentation: Record<StatusChipStatus, StatusPresentation> = {
  archived: { label: "Archived", variant: "archived" },
  completed: { label: "Completed", variant: "completed" },
  deleted: { label: "Archived", variant: "archived" },
  draft: { label: "Planning", variant: "planning" },
  failed: { label: "Failed", variant: "archived" },
  generating: { label: "Planning", variant: "planning" },
  pending: { label: "Planning", variant: "planning" },
  ready: { label: "Active", variant: "active" },
  running: { label: "Planning", variant: "planning" },
};

/** The status accent, for surfaces where the chip's translucent fill has no contrast. */
export function getStatusColor(status: StatusChipStatus): string {
  return statusColors[statusPresentation[status].variant].foreground;
}

interface StatusChipProps extends Omit<ChipProps, "label" | "variant"> {
  status: StatusChipStatus;
}

export function StatusChip({ status, ...props }: StatusChipProps) {
  const presentation = statusPresentation[status];

  return (
    <Chip
      {...props}
      label={presentation.label}
      variant={presentation.variant}
    />
  );
}
