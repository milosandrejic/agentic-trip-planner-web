import type { PaletteOptions } from "@mui/material/styles";

export const brandColors = {
  navy: "#183153",
  teal: "#2f9c95",
  orange: "#ff8a3d",
  canvas: "#faf8f5",
  workspace: "#f7f5f2",
  white: "#ffffff",
} as const;

export const statusColors = {
  active: {
    foreground: brandColors.teal,
    background: "rgba(47, 156, 149, 0.1)",
  },
  planning: {
    foreground: brandColors.orange,
    background: "rgba(255, 138, 61, 0.1)",
  },
  completed: {
    foreground: "rgba(24, 49, 83, 0.45)",
    background: "rgba(24, 49, 83, 0.08)",
  },
  archived: {
    foreground: "rgba(24, 49, 83, 0.35)",
    background: "rgba(24, 49, 83, 0.06)",
  },
} as const;

export const palette: PaletteOptions = {
  mode: "light",
  primary: {
    main: brandColors.navy,
    contrastText: brandColors.white,
  },
  secondary: {
    main: brandColors.teal,
    contrastText: brandColors.white,
  },
  warning: {
    main: brandColors.orange,
    contrastText: brandColors.navy,
  },
  background: {
    default: brandColors.canvas,
    paper: brandColors.white,
  },
  text: {
    primary: brandColors.navy,
    secondary: "rgba(24, 49, 83, 0.55)",
    disabled: "rgba(24, 49, 83, 0.35)",
  },
  divider: "rgba(24, 49, 83, 0.07)",
};
