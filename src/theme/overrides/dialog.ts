import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";
import { fontFamilies } from "@/theme/typography";

export const dialogOverrides: Pick<
  ThemeComponents,
  "MuiDialog" | "MuiDialogActions" | "MuiDialogContent" | "MuiDialogTitle"
> = {
  MuiDialog: {
    defaultProps: {
      fullWidth: true,
    },
    styleOverrides: {
      paper: {
        borderRadius: borderRadii.hero,
        backgroundImage: "none",
        boxShadow: "0 32px 80px rgba(24, 49, 83, 0.28)",
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: "24px",
        borderBottom: "1px solid rgba(24, 49, 83, 0.07)",
        fontFamily: fontFamilies.display,
        fontSize: "1.125rem",
        fontWeight: 700,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "24px",
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        gap: 8,
        padding: "0 24px 24px",
      },
    },
  },
};
