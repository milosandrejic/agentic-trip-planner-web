"use client";

import Image from "next/image";
import {
  useRef, useState,
} from "react";

import {
  Box, Typography,
} from "@mui/material";

import { useRequireAuth } from "@/hooks/use-require-auth";

import lockIcon from "@/assets/hero-lock-icon.svg";
import heroImage from "@/assets/hero-santorini.jpg";
import badgeIcon from "@/assets/hero-badge-icon.svg";

import { PromptBox } from "@/components/landing/prompt-box";

const MIN_QUERY_LENGTH = 10;
const PROMPT_PLACEHOLDER =
  "Plan a 7-day trip to Japan with a $2,500 budget, cherry blossom season, mix of Tokyo and Kyoto...";

interface Suggestion {
  emoji: string;
  label: string;
  query: string;
}

const suggestions: readonly Suggestion[] = [
  {
    emoji: "🏛",
    label: "Romantic Rome",
    query: "A romantic 5-day trip to Rome for a couple, mid-range budget, historic center.",
  },
  {
    emoji: "🌸",
    label: "Japan in Spring",
    query: "A 7-day trip to Japan during cherry blossom season, mix of Tokyo and Kyoto.",
  },
  {
    emoji: "🏖",
    label: "Greek Islands",
    query: "A 10-day island-hopping trip across the Greek Islands, relaxed pace, sea views.",
  },
  {
    emoji: "🍷",
    label: "Tuscany Wine Tour",
    query: "A 6-day wine-tasting trip through Tuscany, countryside stays, food-focused.",
  },
  {
    emoji: "🏔",
    label: "Norway Road Trip",
    query: "A 9-day road trip through Norway's fjords, scenic drives, hiking stops.",
  },
];

function handleCreateTrip(): void {
  // TODO(6.1): call useCreateTrip and navigate to the resulting thread.
}

export function Hero() {
  const [prompt, setPrompt] = useState("");
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const requireAuth = useRequireAuth();
  const canSubmit = prompt.trim().length >= MIN_QUERY_LENGTH;

  function handleSubmit(): void {
    if (!canSubmit) {
      return;
    }

    requireAuth(handleCreateTrip);
  }

  function handleSuggestionClick(suggestion: Suggestion): void {
    setPrompt(suggestion.query);
    promptRef.current?.focus();
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          inset: 0,
          position: "absolute",
        }}
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          aria-hidden="true"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <Box
          sx={{
            background:
              "linear-gradient(90deg, #faf8f5 0%, #faf8f5 18%, rgba(250, 248, 245, 0.94) 28%, rgba(250, 248, 245, 0.72) 38%, rgba(250, 248, 245, 0.32) 52%, rgba(250, 248, 245, 0.08) 66%, rgba(250, 248, 245, 0) 80%)",
            display: { xs: "none", md: "block" },
            inset: 0,
            position: "absolute",
          }}
        />

        <Box
          sx={{
            background: "linear-gradient(180deg, rgba(250, 248, 245, 0) 0%, #faf8f5 100%)",
            bottom: 0,
            display: { xs: "none", md: "block" },
            height: "22%",
            left: 0,
            position: "absolute",
            width: "100%",
          }}
        />

        <Box
          sx={{
            backgroundColor: "rgba(250, 248, 245, 0.85)",
            display: { md: "none" },
            inset: 0,
            position: "absolute",
          }}
        />
      </Box>

      <Box
        sx={{
          marginInline: "auto",
          maxWidth: 1280,
          paddingBlock: { xs: "48px", md: "96px" },
          paddingInline: { xs: "20px", md: "67px" },
          position: "relative",
        }}
      >
        <Box sx={{ maxWidth: 540 }}>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(24, 49, 83, 0.1)",
              borderRadius: "100px",
              boxShadow: "0px 1px 8px 0px rgba(24, 49, 83, 0.07)",
              display: "inline-flex",
              gap: "7px",
              padding: "6px 14px",
            }}
          >
            <Image
              src={badgeIcon}
              alt=""
              width={11}
              height={11}
              aria-hidden="true"
            />

            <Typography
              component="span"
              sx={{
                color: "rgba(24, 49, 83, 0.65)",
                fontSize: 12.5,
                fontWeight: 500,
                letterSpacing: "0.125px",
                whiteSpace: "nowrap",
              }}
            >
              AI-powered travel planning
            </Typography>
          </Box>

          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4.358rem" },
              letterSpacing: "-2.44px",
              lineHeight: 1.06,
              marginTop: "22px",
            }}
          >
            Plan unforgettable journeys with AI
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.65)",
              fontSize: 17,
              lineHeight: 1.65,
              marginTop: "22px",
              maxWidth: 430,
            }}
          >
            Describe your dream trip in your own words. Our AI creates flights, hotels, day-by-day plans and local
            recommendations — in minutes.
          </Typography>

          <Box sx={{ marginTop: "36px" }}>
            <PromptBox
              id="trip-prompt"
              inputRef={promptRef}
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              placeholder={PROMPT_PLACEHOLDER}
            />
          </Box>

          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              gap: "6px",
              marginTop: "14px",
            }}
          >
            <Image
              src={lockIcon}
              alt=""
              width={13}
              height={13}
              aria-hidden="true"
            />

            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.46)",
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              {"Planning requires a "}

              <Box
                component="span"
                sx={{
                  color: "rgba(24, 49, 83, 0.62)",
                  fontWeight: 600,
                }}
              >
                free account
              </Box>

              . Your trips are automatically saved and can be continued anytime.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 12px",
              marginTop: "28px",
            }}
          >
            {
              suggestions.map((suggestion) => (
                <Box
                  key={suggestion.label}
                  component="button"
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid rgba(24, 49, 83, 0.11)",
                    borderRadius: "100px",
                    boxShadow: "0px 1px 6px 0px rgba(24, 49, 83, 0.07)",
                    cursor: "pointer",
                    display: "flex",
                    gap: "7px",
                    padding: "8px 15px",
                    "&:hover": {
                      backgroundColor: "background.paper",
                    },
                  }}
                >
                  <Box component="span" sx={{ fontSize: 15 }}>
                    {suggestion.emoji}
                  </Box>

                  <Typography
                    component="span"
                    sx={{
                      color: "text.primary",
                      fontSize: 13.5,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {suggestion.label}
                  </Typography>
                </Box>
              ))
            }
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
