import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";

export const buttonOverrides: ThemeComponents["MuiButton"] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      minHeight: 40,
      paddingInline: 16,
      borderRadius: borderRadii.medium,
    },
    sizeLarge: {
      minHeight: 52,
      paddingInline: 24,
    },
  },
  variants: [
    {
      props: {
        color: "primary",
        variant: "contained",
      },
      style: ({ theme }) => ({
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
    },
    {
      props: {
        color: "secondary",
        variant: "outlined",
      },
      style: ({ theme }) => ({
        borderColor: "rgba(47, 156, 149, 0.25)",
        "&:hover": {
          borderColor: theme.palette.secondary.main,
          backgroundColor: "rgba(47, 156, 149, 0.06)",
        },
      }),
    },
  ],
};
