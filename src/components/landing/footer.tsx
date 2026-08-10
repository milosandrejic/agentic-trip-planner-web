import {
  Box,
  Link,
  Typography,
} from "@mui/material";

import { Logo } from "@/components/logo/logo";

interface FooterLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

const footerLinks: readonly FooterLink[] = [
  {
    href: "#about",
    label: "About",
  },
  {
    href: "#privacy",
    label: "Privacy",
  },
  {
    href: "#terms",
    label: "Terms",
  },
  {
    href: "https://github.com/milosandrejic/agentic-trip-planner-web",
    isExternal: true,
    label: "GitHub",
  },
];

export function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        borderColor: "rgba(24, 49, 83, 0.08)",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        padding: { xs: "32px 20px", md: "40px 36px" },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "24px", md: 0 },
          justifyContent: "space-between",
          marginInline: "auto",
          maxWidth: 1280,
          width: "100%",
        }}
      >
        <Logo variant="footer" />

        <Box
          component="nav"
          aria-label="Footer navigation"
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "28px",
            justifyContent: "center",
          }}
        >
          {
            footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noreferrer" : undefined}
                underline="none"
                sx={{
                  color: "rgba(24, 49, 83, 0.46)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  lineHeight: "20.25px",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                {link.label}
              </Link>
            ))
          }
        </Box>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.36)",
            fontSize: 13,
            lineHeight: "19.5px",
            whiteSpace: "nowrap",
          }}
        >
          © 2026 Agentic Trip Planner
        </Typography>
      </Box>
    </Box>
  );
}
