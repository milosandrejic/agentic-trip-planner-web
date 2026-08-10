"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Box,
  Dialog,
  ButtonBase,
  IconButton,
  Typography,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";

import authClose from "@/assets/auth-close.svg";

import { Logo } from "@/components/logo/logo";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

type AuthMode = "sign-in" | "sign-up";

interface ModeCopy {
  description: string;
  title: string;
}

const modeCopy: Record<AuthMode, ModeCopy> = {
  "sign-in": {
    description: "Sign in to continue planning your trip.",
    title: "Welcome back",
  },
  "sign-up": {
    description: "Free forever. Your trips are always saved.",
    title: "Create your account",
  },
};

interface AuthModeButtonProps {
  activeMode: AuthMode;
  label: string;
  mode: AuthMode;
  onSelect: (mode: AuthMode) => void;
}

function AuthModeButton({ activeMode, label, mode, onSelect }: AuthModeButtonProps) {
  const isActive = activeMode === mode;

  return (
    <ButtonBase
      id={`${mode}-tab`}
      role="tab"
      aria-controls={`${mode}-panel`}
      aria-selected={isActive}
      onClick={() => onSelect(mode)}
      sx={{
        borderRadius: "9px",
        boxShadow: isActive ? "0 1px 2px rgba(24, 49, 83, 0.1)" : "none",
        color: isActive ? "text.primary" : "rgba(24, 49, 83, 0.5)",
        flex: 1,
        fontSize: 14,
        fontWeight: 600,
        height: 39,
        backgroundColor: isActive ? "background.paper" : "transparent",
      }}
    >
      {label}
    </ButtonBase>
  );
}

export function AuthDialog() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const {
    closeAuthDialog,
    isAuthDialogOpen,
    isLoading,
  } = useAuth();
  const copy = modeCopy[mode];

  function handleClose(): void {
    if (isLoading) {
      return;
    }

    closeAuthDialog();
  }

  return (
    <Dialog
      open={isAuthDialogOpen}
      onClose={handleClose}
      maxWidth={false}
      aria-labelledby="auth-dialog-title"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(24, 49, 83, 0.5)",
          },
        },
        paper: {
          sx: {
            borderRadius: "24px",
            margin: { xs: "16px", sm: "24px" },
            maxHeight: "calc(100dvh - 32px)",
            maxWidth: 440,
            minHeight: mode === "sign-up" ? { sm: 750 } : undefined,
            overflowX: "hidden",
            width: "calc(100% - 32px)",
          },
        },
      }}
    >
      <Box
        sx={{
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "space-between",
          padding: "28px 28px 0",
        }}
      >
        <Box>
          <Logo variant="auth" />

          <Typography
            id="auth-dialog-title"
            component="h2"
            sx={{
              fontFamily: "var(--font-manrope)",
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.2,
              marginTop: "20px",
            }}
          >
            {copy.title}
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.5)",
              fontSize: 14.5,
              lineHeight: 1.5,
              marginTop: "6px",
            }}
          >
            {copy.description}
          </Typography>
        </Box>

        <IconButton
          aria-label="Close authentication dialog"
          disabled={isLoading}
          onClick={handleClose}
          sx={{
            backgroundColor: "#f0eeeb",
            borderRadius: "8px",
            height: 32,
            width: 32,
            "&:hover": {
              backgroundColor: "#e8e5e1",
            },
          }}
        >
          <Image
            src={authClose}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </IconButton>
      </Box>

      <Box sx={{ padding: "24px 28px 0" }}>
        <Box
          role="tablist"
          aria-label="Authentication mode"
          sx={{
            backgroundColor: "#f7f5f2",
            borderRadius: "12px",
            display: "flex",
            height: 47,
            padding: "4px",
          }}
        >
          <AuthModeButton
            activeMode={mode}
            label="Sign In"
            mode="sign-in"
            onSelect={setMode}
          />

          <AuthModeButton
            activeMode={mode}
            label="Create Account"
            mode="sign-up"
            onSelect={setMode}
          />
        </Box>
      </Box>

      {
        mode === "sign-in" &&
        <Box
          id="sign-in-panel"
          role="tabpanel"
          aria-labelledby="sign-in-tab"
        >
          <SignInForm />
        </Box>
      }

      {
        mode === "sign-up" &&
        <Box
          id="sign-up-panel"
          role="tabpanel"
          aria-labelledby="sign-up-tab"
        >
          <SignUpForm />
        </Box>
      }
    </Dialog>
  );
}
