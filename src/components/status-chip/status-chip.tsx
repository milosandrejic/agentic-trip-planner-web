// prettier-ignore
import {
  Chip,
  type ChipProps,
} from "@mui/material";

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

interface StatusChipProps extends Omit<ChipProps, "label" | "variant"> {
  status: StatusChipStatus;
}

export function StatusChip({ status, ...props }: StatusChipProps) {
  const presentation = statusPresentation[status];

  return (
    // prettier-ignore
    <Chip
      {...props}
      label={presentation.label}
      variant={presentation.variant}
    />
  );
}
