"use client";

import dayjs from "dayjs";

import { CloseRounded } from "@mui/icons-material";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { formatCurrency } from "@/utils/format-currency";
import {
  formatStops,
  formatFlightDuration,
  getBestValueFlightId,
} from "@/utils/flight-display";

import { brandColors } from "@/theme/palette";

import { BookingButton } from "@/components/dialogs/booking-button";

import type { Flight } from "@/types/itinerary";

function formatFlightDate(date: string): string {
  if (!date) {
    return "—";
  }

  return dayjs(date).format("MMM D");
}

interface FlightCardProps {
  flight: Flight;
  isBestValue: boolean;
}

/**
 * The design shows departure/arrival clock times and an airport pair; `Flight` carries
 * neither (gaps #10, #15), so the two ends of the connector are the outbound and
 * return dates, which the API does provide.
 */
function FlightCard({ flight, isBestValue }: FlightCardProps) {
  const duration = formatFlightDuration(flight.duration_min);

  return (
    <Box
      sx={{
        backgroundColor: isBestValue ? "rgba(47, 156, 149, 0.03)" : brandColors.surface,
        border: isBestValue ? "1.5px solid rgba(47, 156, 149, 0.3)" : "1px solid rgba(24, 49, 83, 0.08)",
        borderRadius: "16px",
        padding: "18px 20px",
        position: "relative",
      }}
    >
      {
        isBestValue &&
        <Typography
          component="span"
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: "100px",
            color: brandColors.white,
            fontSize: 11,
            fontWeight: 700,
            left: 16,
            letterSpacing: "0.66px",
            lineHeight: "16.5px",
            padding: "2px 10px",
            position: "absolute",
            top: -11,
          }}
        >
          BEST VALUE
        </Typography>
      }

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: "16px",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-manrope)",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: "22.5px",
            }}
          >
            {flight.airline}
          </Typography>

          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              gap: "10px",
              paddingTop: "4px",
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "text.primary",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "21px",
              }}
            >
              {formatFlightDate(flight.outbound_date)}
            </Typography>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: "2px",
                minWidth: 0,
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: "rgba(24, 49, 83, 0.4)",
                  fontSize: 11,
                  lineHeight: "16.5px",
                }}
              >
                {duration}
              </Typography>

              <Box
                sx={{
                  backgroundColor: "rgba(24, 49, 83, 0.15)",
                  height: "1px",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(24, 49, 83, 0.3)",
                    borderRadius: "50%",
                    height: 6,
                    position: "absolute",
                    right: 0,
                    top: -3,
                    width: 6,
                  }}
                />
              </Box>

              <Typography
                component="span"
                sx={{
                  color: "rgba(24, 49, 83, 0.4)",
                  fontSize: 11,
                  lineHeight: "16.5px",
                }}
              >
                {formatStops(flight.stops)}
              </Typography>
            </Box>

            <Typography
              component="span"
              sx={{
                color: "text.primary",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "21px",
              }}
            >
              {formatFlightDate(flight.return_date)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0, textAlign: "right" }}>
          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontFamily: "var(--font-manrope)",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.66px",
              lineHeight: "33px",
              paddingBottom: "8px",
            }}
          >
            {formatCurrency(flight.price, flight.currency)}
          </Typography>

          <BookingButton
            href={flight.booking_url}
            label="Book Flight"
            sx={{
              borderRadius: "9px",
              fontSize: 13,
              lineHeight: "19.5px",
              padding: "8px 16px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

interface FlightsDialogProps {
  destination: string;
  flights: readonly Flight[];
  onClose: () => void;
}

export function FlightsDialog({ destination, flights, onClose }: FlightsDialogProps) {
  const bestValueId = getBestValueFlightId(flights);
  const firstFlight = flights[0];

  const dateRange = firstFlight ? `${formatFlightDate(firstFlight.outbound_date)} – ${formatFlightDate(firstFlight.return_date)}` : "";

  const optionsLabel = flights.length === 1 ? "1 option found" : `${flights.length} options found`;

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open
    >
      <DialogTitle
        sx={{
          alignItems: "center",
          display: "flex",
          fontWeight: 800,
          gap: "16px",
          justifyContent: "space-between",
          letterSpacing: "-0.54px",
          padding: "20px 24px",
        }}
      >
        ✈️ Flights to {destination}

        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            backgroundColor: brandColors.control,
            borderRadius: "8px",
            flexShrink: 0,
            padding: "6px",
          }}
        >
          <CloseRounded sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "20px 24px" }}>
        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.5)",
            fontSize: 14,
            lineHeight: "21px",
          }}
        >
          {dateRange ? `${optionsLabel} · ${dateRange}` : optionsLabel}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "20px",
          }}
        >
          {
            flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                isBestValue={flight.id === bestValueId}
              />
            ))
          }
        </Box>

        {
          flights.length === 0 &&
          <Typography
            component="p"
            sx={{
              color: "text.disabled",
              fontSize: 13,
              paddingTop: "20px",
            }}
          >
            No flight options in this plan yet.
          </Typography>
        }
      </DialogContent>
    </Dialog>
  );
}
