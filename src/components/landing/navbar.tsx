"use client";

import { useState } from "react";

import {
  MenuRounded,
  CloseRounded,
} from "@mui/icons-material";
import {
  Box,
  Link,
  AppBar,
  Button,
  Drawer,
  ButtonBase,
  IconButton,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";
import { useRequireAuth } from "@/hooks/use-require-auth";

import { focusTripPrompt } from "@/utils/focus-trip-prompt";

import { Logo } from "@/components/logo/logo";

interface NavigationLink {
  href: string;
  label: string;
}

const navigationLinks: readonly NavigationLink[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#how-it-works",
    label: "How it Works",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
];

const navigationLinkStyles = {
  color: "rgba(24, 49, 83, 0.65)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "21px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  "&:hover": {
    color: "text.primary",
  },
} as const;

const startPlanningButtonStyles = {
  borderRadius: "100px",
  fontSize: 13.5,
  height: 39,
  lineHeight: "20.25px",
  minHeight: 39,
  minWidth: 131,
  padding: "9px 20px",
} as const;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openAuthDialog } = useAuth();
  const requireAuth = useRequireAuth();

  function closeMenu(): void {
    setIsMenuOpen(false);
  }

  function handleSignIn(): void {
    closeMenu();
    openAuthDialog();
  }

  function handleStartPlanning(): void {
    closeMenu();
    requireAuth(focusTripPrompt);
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(250, 248, 245, 0.9)",
        borderBottomColor: "rgba(24, 49, 83, 0.05)",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: 62,
          marginInline: "auto",
          maxWidth: 1280,
          paddingInline: { xs: "20px", sm: "36px" },
          width: "100%",
        }}
      >
        <Link
          href="/"
          aria-label="Agentic Trip Planner home"
          color="inherit"
          underline="none"
          sx={{ display: "inline-flex" }}
        >
          <Logo />
        </Link>

        <Box
          component="nav"
          aria-label="Primary navigation"
          sx={{
            alignItems: "center",
            display: { xs: "none", md: "flex" },
            flex: 1,
            gap: "32px",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          {
            navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                sx={navigationLinkStyles}
              >
                {link.label}
              </Link>
            ))
          }
        </Box>

        <Box
          sx={{
            alignItems: "center",
            display: { xs: "none", md: "flex" },
            gap: "16px",
          }}
        >
          <ButtonBase
            onClick={handleSignIn}
            sx={navigationLinkStyles}
          >
            Sign in
          </ButtonBase>

          <Button
            variant="contained"
            onClick={handleStartPlanning}
            sx={startPlanningButtonStyles}
          >
            Start Planning
          </Button>
        </Box>

        <IconButton
          aria-label="Open navigation menu"
          onClick={() => setIsMenuOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            marginLeft: "auto",
          }}
        >
          <MenuRounded />
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "background.default",
              padding: "20px",
              width: "min(300px, 86vw)",
            },
          },
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Logo />

          <IconButton
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <CloseRounded />
          </IconButton>
        </Box>

        <Box
          component="nav"
          aria-label="Mobile navigation"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "32px",
          }}
        >
          {
            navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                sx={{
                  ...navigationLinkStyles,
                  paddingBlock: "10px",
                }}
              >
                {link.label}
              </Link>
            ))
          }
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto",
            paddingTop: "32px",
          }}
        >
          <Button
            variant="text"
            onClick={handleSignIn}
          >
            Sign in
          </Button>

          <Button
            variant="contained"
            onClick={handleStartPlanning}
            sx={{ borderRadius: "100px" }}
          >
            Start Planning
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
