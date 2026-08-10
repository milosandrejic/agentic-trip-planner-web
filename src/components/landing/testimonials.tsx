import Image from "next/image";

import {
  Box, Typography,
} from "@mui/material";

import starIcon from "@/assets/stats-star-icon.svg";

interface Testimonial {
  detail: string;
  name: string;
  quote: string;
}

const testimonials: readonly Testimonial[] = [
  {
    detail: "Honeymooned in Santorini",
    name: "Sofia R.",
    quote:
      "I described my honeymoon in one sentence and had a complete itinerary in under a minute. Flights, hotels, restaurants — everything. It felt like magic.",
  },
  {
    detail: "Japan, 14 days",
    name: "Marcus & Priya L.",
    quote:
      "I kept asking follow-up questions and the AI adapted everything in real time. It felt like a real conversation, not a search engine.",
  },
  {
    detail: "Norway Fjords solo",
    name: "Thomas B.",
    quote:
      "It put the museum on the rainy day and the hike on the sunny day without me asking. The level of thoughtfulness surprised me.",
  },
];

function StarRating() {
  return (
    <Box sx={{ display: "flex", gap: "2px" }}>
      {
        Array.from({ length: 5 }, (_, index) => (
          <Image
            key={index}
            src={starIcon}
            alt=""
            width={13}
            height={13}
            aria-hidden="true"
          />
        ))
      }
    </Box>
  );
}

function TestimonialCard({ detail, name, quote }: Testimonial) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.09)",
        borderRadius: "20px",
        padding: "28px 26px",
      }}
    >
      <StarRating />

      <Typography
        component="p"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 15,
          letterSpacing: "-0.15px",
          lineHeight: 1.7,
          marginTop: "18px",
        }}
      >
        {`"${quote}"`}
      </Typography>

      <Box sx={{ marginTop: "22px" }}>
        <Typography
          component="p"
          sx={{
            color: "common.white",
            fontFamily: "var(--font-manrope)",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          {name}
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "rgba(255, 255, 255, 0.36)",
            fontSize: 12.5,
            lineHeight: 1.5,
            marginTop: "3px",
          }}
        >
          {detail}
        </Typography>
      </Box>
    </Box>
  );
}

export function Testimonials() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
      }}
    >
      {
        testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.name}
            {...testimonial}
          />
        ))
      }
    </Box>
  );
}
