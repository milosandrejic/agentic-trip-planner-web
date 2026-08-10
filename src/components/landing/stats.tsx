import {
  Box, Typography,
} from "@mui/material";

import { Testimonials } from "@/components/landing/testimonials";

interface Stat {
  label: string;
  value: string;
}

const stats: readonly Stat[] = [
  { label: "Trips planned", value: "48,000+" },
  { label: "Countries covered", value: "120+" },
  { label: "Average rating", value: "4.9 / 5" },
  { label: "Time to full itinerary", value: "< 30s" },
];

function StatCard({ isLast, stat }: { isLast: boolean; stat: Stat }) {
  return (
    <Box
      sx={{
        borderRight: isLast ? "none" : { md: "1px solid rgba(255, 255, 255, 0.1)" },
        paddingInline: "24px",
        textAlign: "center",
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "common.white",
          fontFamily: "var(--font-manrope)",
          fontSize: 45.594,
          fontWeight: 800,
          letterSpacing: "-1.6px",
          lineHeight: 1,
        }}
      >
        {stat.value}
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "rgba(255, 255, 255, 0.48)",
          fontSize: 14,
          lineHeight: 1.5,
          marginTop: "8px",
        }}
      >
        {stat.label}
      </Typography>
    </Box>
  );
}

export function Stats() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        paddingBlock: { xs: "56px", md: "96px" },
        paddingInline: { xs: "20px", md: "36px" },
      }}
    >
      <Box sx={{ marginInline: "auto", maxWidth: 1280 }}>
        <Typography
          component="p"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "1.375px",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Trusted by travelers worldwide
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: { xs: "32px", md: 0 },
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            marginTop: "48px",
          }}
        >
          {
            stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                stat={stat}
                isLast={index === stats.length - 1}
              />
            ))
          }
        </Box>

        <Box sx={{ marginTop: { xs: "56px", md: "72px" } }}>
          <Testimonials />
        </Box>
      </Box>
    </Box>
  );
}
