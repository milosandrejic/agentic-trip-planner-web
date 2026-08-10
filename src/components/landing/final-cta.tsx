"use client";

import Image from "next/image";

import {
  Box, Button, Typography,
} from "@mui/material";

import { useRequireAuth } from "@/hooks/use-require-auth";

import { focusTripPrompt } from "@/utils/focus-trip-prompt";

import checkIcon from "@/assets/cta-check-icon.svg";

const badges: readonly string[] = ["Free to start", "No credit card needed", "Cancel anytime"];

function Badge({ label }: { label: string }) {
  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: "6px" }}>
      <Image
        src={checkIcon}
        alt=""
        width={13}
        height={13}
        aria-hidden="true"
      />

      <Typography
        component="span"
        sx={{
          color: "rgba(24, 49, 83, 0.58)",
          fontSize: 13.5,
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function FinalCta() {
  const requireAuth = useRequireAuth();

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        paddingBlock: { xs: "56px", md: "96px" },
        paddingInline: { xs: "20px", md: "36px" },
      }}
    >
      <Box sx={{ marginInline: "auto", maxWidth: 600, textAlign: "center" }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
          }}
        >
          {
            badges.map((label) => (
              <Badge
                key={label}
                label={label}
              />
            ))
          }
        </Box>

        <Typography
          component="h2"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: { xs: "2.25rem", md: "3.625rem" },
            fontWeight: 800,
            letterSpacing: "-2.03px",
            lineHeight: 1.08,
            marginTop: "36px",
          }}
        >
          Your next adventure starts with one sentence
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.56)",
            fontSize: 17,
            lineHeight: 1.65,
            marginTop: "20px",
          }}
        >
          Join thousands of travelers who plan smarter and explore deeper.
        </Typography>

        <Button
          variant="contained"
          color="warning"
          onClick={() => requireAuth(focusTripPrompt)}
          sx={{
            borderRadius: "100px",
            boxShadow: "0px 8px 16px 0px rgba(255, 138, 61, 0.3)",
            color: "common.white",
            fontFamily: "var(--font-manrope)",
            fontSize: 16.5,
            fontWeight: 700,
            letterSpacing: "-0.33px",
            marginTop: "40px",
            paddingBlock: "17px",
            paddingInline: "40px",
          }}
        >
          Start Planning for Free →
        </Button>
      </Box>
    </Box>
  );
}
