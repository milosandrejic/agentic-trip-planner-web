import {
  Box, Typography,
} from "@mui/material";

import { featureGridItems } from "@/constants/landing";

function FeatureCard({ description, icon, title }: (typeof featureGridItems)[number]) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        border: "1px solid rgba(24, 49, 83, 0.06)",
        borderRadius: "18px",
        padding: "28px 24px",
      }}
    >
      <Typography component="span" sx={{ display: "block", fontSize: 26, lineHeight: 1 }}>
        {icon}
      </Typography>

      <Typography
        component="h3"
        sx={{
          color: "text.primary",
          fontFamily: "var(--font-manrope)",
          fontSize: 15.5,
          fontWeight: 700,
          letterSpacing: "-0.31px",
          lineHeight: 1.5,
          marginTop: "16px",
        }}
      >
        {title}
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "rgba(24, 49, 83, 0.56)",
          fontSize: 13.5,
          lineHeight: 1.65,
          marginTop: "8px",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export function FeatureGrid() {
  return (
    <Box
      id="features"
      sx={{
        backgroundColor: "background.paper",
        paddingBlock: { xs: "56px", md: "96px" },
        paddingInline: { xs: "20px", md: "36px" },
      }}
    >
      <Box sx={{ marginInline: "auto", maxWidth: 1280 }}>
        <Typography
          component="p"
          sx={{
            color: "secondary.main",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "1.375px",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Everything included
        </Typography>

        <Typography
          component="h2"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 800,
            letterSpacing: "-1.44px",
            lineHeight: 1.1,
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          One conversation. A complete trip.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            marginTop: { xs: "40px", md: "64px" },
          }}
        >
          {
            featureGridItems.map((item) => (
              <FeatureCard
                key={item.title}
                {...item}
              />
            ))
          }
        </Box>
      </Box>
    </Box>
  );
}
