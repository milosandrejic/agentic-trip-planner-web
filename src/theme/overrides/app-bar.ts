import type { ThemeComponents } from "@/theme/overrides/types";

export const appBarOverrides: ThemeComponents["MuiAppBar"] = {
  defaultProps: {
    color: "transparent",
    elevation: 0,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      backgroundImage: "none",
      borderBottom: `1px solid ${theme.palette.divider}`,
    }),
  },
};
