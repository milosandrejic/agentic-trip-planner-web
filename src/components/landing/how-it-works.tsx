import Image from "next/image";

import {
  Box, Typography,
} from "@mui/material";

import stepOneIcon from "@/assets/how-it-works-step-1.svg";
import stepTwoIcon from "@/assets/how-it-works-step-2.svg";
import stepFourIcon from "@/assets/how-it-works-step-4.svg";
import stepThreeIcon from "@/assets/how-it-works-step-3.svg";

interface Step {
  description: string;
  icon: typeof stepOneIcon;
  title: string;
  variant: "outline" | "solid";
}

const steps: readonly Step[] = [
  {
    description: "Tell us what you have in mind in your own words.",
    icon: stepOneIcon,
    title: "1. Describe your trip",
    variant: "solid",
  },
  {
    description: "We find the best flights, hotels, places and experiences.",
    icon: stepTwoIcon,
    title: "2. AI Plans Everything",
    variant: "solid",
  },
  {
    description: "Chat with AI and adjust until everything is perfect.",
    icon: stepThreeIcon,
    title: "3. Refine Together",
    variant: "outline",
  },
  {
    description: "Save, share or book when you're ready to go.",
    icon: stepFourIcon,
    title: "4. Enjoy Your Trip",
    variant: "outline",
  },
];

interface StepIconProps {
  icon: Step["icon"];
  variant: Step["variant"];
}

function StepIcon({ icon, variant }: StepIconProps) {
  const isSolid = variant === "solid";

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: isSolid ? "primary.main" : "background.paper",
        border: isSolid ? "none" : "1.5px solid rgba(24, 49, 83, 0.12)",
        borderRadius: "28px",
        boxShadow: "0px 2px 6px 0px rgba(24, 49, 83, 0.08)",
        display: "flex",
        height: 56,
        justifyContent: "center",
        width: 56,
      }}
    >
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
      />
    </Box>
  );
}

export function HowItWorks() {
  return (
    <Box
      id="how-it-works"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "28px 28px 0 0",
        boxShadow: "0px -4px 16px 0px rgba(24, 49, 83, 0.06)",
        paddingBlock: { xs: "56px", md: "80px 96px" },
        paddingInline: { xs: "20px", md: "36px" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          marginInline: "auto",
          maxWidth: 1280,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.7px",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          How it works
        </Typography>

        <Box
          sx={{
            marginTop: { xs: "40px", md: "60px" },
            position: "relative",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, rgba(47, 156, 149, 0.2) 0%, rgba(47, 156, 149, 0.4) 50%, rgba(47, 156, 149, 0.2) 100%)",
              display: { xs: "none", md: "block" },
              height: "1px",
              left: "12.5%",
              position: "absolute",
              top: 28,
              width: "75%",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: "40px", md: 0 },
              position: "relative",
            }}
          >
            {
              steps.map((step) => (
                <Box
                  key={step.title}
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    paddingInline: { md: "24px" },
                  }}
                >
                  <Box sx={{ paddingBottom: "24px" }}>
                    <StepIcon
                      icon={step.icon}
                      variant={step.variant}
                    />
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-manrope)",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "-0.32px",
                      lineHeight: 1.5,
                      paddingBottom: "8px",
                      textAlign: "center",
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    component="p"
                    sx={{
                      color: "rgba(24, 49, 83, 0.55)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxWidth: 270,
                      textAlign: "center",
                    }}
                  >
                    {step.description}
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
