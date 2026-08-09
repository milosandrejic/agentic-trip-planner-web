import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";
import { statusColors } from "@/theme/palette";

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    active: true;
    planning: true;
    completed: true;
    archived: true;
  }
}

export const chipOverrides: ThemeComponents["MuiChip"] = {
  styleOverrides: {
    root: {
      height: 24,
      borderRadius: borderRadii.pill,
      fontSize: "0.75rem",
      fontWeight: 600,
    },
    label: {
      paddingInline: 10,
    },
  },
  variants: [
    {
      props: { variant: "active" },
      style: {
        color: statusColors.active.foreground,
        backgroundColor: statusColors.active.background,
      },
    },
    {
      props: { variant: "planning" },
      style: {
        color: statusColors.planning.foreground,
        backgroundColor: statusColors.planning.background,
      },
    },
    {
      props: { variant: "completed" },
      style: {
        color: statusColors.completed.foreground,
        backgroundColor: statusColors.completed.background,
      },
    },
    {
      props: { variant: "archived" },
      style: {
        color: statusColors.archived.foreground,
        backgroundColor: statusColors.archived.background,
      },
    },
  ],
};
