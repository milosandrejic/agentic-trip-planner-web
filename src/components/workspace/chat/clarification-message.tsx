import {
  Box, Typography,
} from "@mui/material";

import type { Clarification } from "@/types/itinerary";

interface ClarificationMessageProps {
  clarification: Clarification;
}

export function ClarificationMessage({ clarification }: ClarificationMessageProps) {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f5f2",
        borderRadius: "3px 16px 16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "90%",
        padding: "14px 16px",
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "text.primary",
          fontSize: 13.5,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}
      >
        {clarification.message}
      </Typography>

      {
        clarification.missing_fields.length > 0 &&
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {
            clarification.missing_fields.map((field) => (
              <Box
                key={field}
                sx={{
                  backgroundColor: "background.paper",
                  border: "1px solid rgba(47, 156, 149, 0.25)",
                  borderRadius: "100px",
                  color: "secondary.main",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "4px 12px",
                }}
              >
                {field}
              </Box>
            ))
          }
        </Box>
      }
    </Box>
  );
}
