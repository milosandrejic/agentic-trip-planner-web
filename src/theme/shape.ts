import type { ShapeOptions } from "@mui/material/styles";

export const borderRadii = {
  small: 8,
  medium: 10,
  large: 14,
  card: 16,
  feature: 18,
  hero: 20,
  pill: 100,
} as const;

export const spacingUnit = 8;

export const spacingTokens = {
  hairline: 2,
  compact: 4,
  inline: 8,
  control: 12,
  content: 16,
  panel: 24,
  pageGutter: 36,
  section: 96,
} as const;

export const shape: ShapeOptions = {
  borderRadius: borderRadii.medium,
};
