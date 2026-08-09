import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";

export const accordionOverrides: Pick<
  ThemeComponents,
  "MuiAccordion" | "MuiAccordionDetails" | "MuiAccordionSummary"
> = {
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: borderRadii.large,
        backgroundImage: "none",
        "&::before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: 0,
        },
        "& + &": {
          marginTop: 6,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        minHeight: 56,
        paddingInline: 16,
        "&.Mui-expanded": {
          minHeight: 56,
        },
      },
      content: {
        marginBlock: 12,
        "&.Mui-expanded": {
          marginBlock: 12,
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: "0 16px 16px",
      },
    },
  },
};
