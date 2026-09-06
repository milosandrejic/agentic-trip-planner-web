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

import {
  formatCurrency,
  formatPartyLabel,
} from "@/utils/format-currency";
import {
  formatStops,
  formatFlightTime,
  formatFlightRoute,
  formatFlightDuration,
  getBestValueFlightId,
} from "@/utils/flight-display";

import { brandColors } from "@/theme/palette";

import { BookingButton } from "@/components/dialogs/booking-button";

import type { Flight } from "@/types/itinerary";

function formatFlightDate(date: string | null): string {
  if (!date) {
    return "";
  }

  return dayjs(date).format("MMM D");
}

interface FlightCardProps {
  flight: Flight;
  isBestValue: boolean;
}

/**
 * The connector ends show the outbound leg's departure and arrival times when the API
 * has them, and fall back to the trip's outbound/return dates when it does not — older
 * itineraries predate these fields. The route line is omitted entirely without codes.
 */
function FlightCard({ flight, isBestValue }: FlightCardProps) {
  const duration = formatFlightDuration(flight.duration_min ?? 0);
  const departure = formatFlightTime(flight.departs_at);
  const arrival = formatFlightTime(flight.arrives_at);
  const route = formatFlightRoute(flight.origin, flight.destination);

  const startLabel = departure || formatFlightDate(flight.outbound_date);
  const endLabel = arrival || formatFlightDate(flight.return_date);

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
              {startLabel}
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
              {endLabel}
            </Typography>
          </Box>

          {
            Boolean(route) &&
            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.4)",
                fontSize: 12,
                lineHeight: "18px",
                paddingTop: "4px",
              }}
            >
              {route}
            </Typography>
          }
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
            {flight.price === null ? "" : formatCurrency(flight.price, flight.currency ?? "EUR")}
          </Typography>

          <BookingButton
            href={flight.booking_url}
            label="Find flights"
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
  travelerCount: number | null;
}

export function FlightsDialog({ destination, flights, onClose, travelerCount }: FlightsDialogProps) {
  const bestValueId = getBestValueFlightId(flights);
  const firstFlight = flights[0];

  const outbound = firstFlight ? formatFlightDate(firstFlight.outbound_date) : "";
  const inbound = firstFlight ? formatFlightDate(firstFlight.return_date) : "";
  const dateRange = outbound && inbound ? `${outbound} – ${inbound}` : outbound;

  const optionsLabel = flights.length === 1 ? "1 option found" : `${flights.length} options found`;

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open
    >
      <DialogTitle
        sx={{
          alignItems: "flex-start",
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="span"
            sx={{
              color: "text.primary",
              display: "block",
              fontFamily: "var(--font-manrope)",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.54px",
              lineHeight: "27px",
            }}
          >
            ✈️ Flights to {destination}
          </Typography>

          <Typography
            component="span"
            sx={{
              color: "rgba(24, 49, 83, 0.5)",
              display: "block",
              fontSize: 13,
              fontWeight: 400,
              lineHeight: "19.5px",
              marginTop: "2px",
            }}
          >
            {[optionsLabel, dateRange, formatPartyLabel(travelerCount)].filter(Boolean).join(" · ")}
          </Typography>
        </Box>

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

      <DialogContent sx={{ padding: "0 24px 24px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "22px",
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
          flights.length > 0 &&
          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.4)",
              fontSize: 11.5,
              lineHeight: "17px",
              paddingTop: "14px",
            }}
          >
            Prices are indicative and shown for the whole party. Links open a flight search,
            not a booking — the fare may differ.
          </Typography>
        }

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
