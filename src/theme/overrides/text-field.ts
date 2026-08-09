import type { ThemeComponents } from "@/theme/overrides/types";

import { borderRadii } from "@/theme/shape";

export const textFieldOverrides: Pick<
  ThemeComponents,
  "MuiInputLabel" | "MuiOutlinedInput" | "MuiTextField"
> = {
  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      variant: "outlined",
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
        fontSize: "0.875rem",
        fontWeight: 600,
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: borderRadii.medium,
        backgroundColor: theme.palette.background.default,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(47, 156, 149, 0.35)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.secondary.main,
          borderWidth: 1,
        },
      }),
      input: {
        padding: "15px 16px",
      },
    },
  },
};
