import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";

export const cardOverrides: ThemeComponents["MuiCard"] = {
  styleOverrides: {
    root: {
      border: "1px solid rgba(24, 49, 83, 0.07)",
      borderRadius: borderRadii.card,
      backgroundImage: "none",
      boxShadow: "0 1px 2px rgba(24, 49, 83, 0.04)",
    },
  },
};
