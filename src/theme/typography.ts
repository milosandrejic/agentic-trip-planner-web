import type { TypographyVariantsOptions } from "@mui/material/styles";

export const fontFamilies = {
  body: "var(--font-inter)",
  display: "var(--font-manrope)",
} as const;

export const typography: TypographyVariantsOptions = {
  fontFamily: fontFamilies.body,
  fontSize: 14,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: "3.625rem",
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: 0,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: "3rem",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: "1.75rem",
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontSize: "1.375rem",
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: 0,
  },
  h5: {
    fontFamily: fontFamilies.display,
    fontSize: "1.125rem",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: fontFamilies.display,
    fontSize: "1rem",
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.65,
    letterSpacing: 0,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0,
    textTransform: "none",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0.08em",
  },
};
