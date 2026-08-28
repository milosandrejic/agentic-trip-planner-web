"use client";

import { CloseRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { getStayNights } from "@/utils/hotel-display";
import { formatCurrency } from "@/utils/format-currency";

import { brandColors } from "@/theme/palette";

import type { Hotel } from "@/types/itinerary";

const PHOTO_WIDTH = 200;

interface HotelCardProps {
  hotel: Hotel;
  isRecommended: boolean;
}

/**
 * The design lists amenity chips ("Free WiFi", "Breakfast"); `Hotel` has no amenities
 * field (gap #16), so the chip row carries the real fields instead — `area`, and an
 * estimated-price marker when `is_estimated` is set.
 */
function HotelCard({ hotel, isRecommended }: HotelCardProps) {
  return (
    <Box
      sx={{
        backgroundColor: brandColors.surface,
        border: isRecommended ? "1.5px solid rgba(47, 156, 149, 0.3)" : "1px solid rgba(24, 49, 83, 0.08)",
        borderRadius: "16px",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: brandColors.overlay,
          flexShrink: 0,
          width: { xs: 120, sm: PHOTO_WIDTH },
        }}
      >
        {
          Boolean(hotel.photo_url) &&
          <Box
            alt={hotel.name}
            component="img"
            src={hotel.photo_url}
            sx={{
              display: "block",
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
          />
        }
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minWidth: 0,
          padding: "18px 20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="p"
              sx={{
                color: "text.primary",
                fontFamily: "var(--font-manrope)",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.32px",
                lineHeight: "24px",
              }}
            >
              {hotel.name}
            </Typography>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                gap: "6px",
                paddingTop: "3px",
              }}
            >
              {
                hotel.rating > 0 &&
                <Typography
                  component="span"
                  sx={{
                    backgroundColor: "rgba(255, 138, 61, 0.1)",
                    borderRadius: "6px",
                    color: "text.primary",
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: "18px",
                    padding: "2px 7px",
                  }}
                >
                  {hotel.rating.toFixed(1)}
                </Typography>
              }
            </Box>
          </Box>

          <Box sx={{ flexShrink: 0, textAlign: "right" }}>
            <Typography
              component="p"
              sx={{
                color: "text.primary",
                fontFamily: "var(--font-manrope)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: "30px",
              }}
            >
              {formatCurrency(hotel.nightly_price, hotel.currency)}
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.4)",
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              /night
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "rgba(24, 49, 83, 0.5)",
                fontSize: 12,
                lineHeight: "18px",
                paddingTop: "2px",
              }}
            >
              {formatCurrency(hotel.total_price, hotel.currency)} total
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            paddingBottom: "12px",
            paddingTop: "6px",
          }}
        >
          {
            Boolean(hotel.area) &&
            <Typography
              component="span"
              sx={{
                backgroundColor: "rgba(24, 49, 83, 0.06)",
                borderRadius: "100px",
                color: "rgba(24, 49, 83, 0.6)",
                fontSize: 12,
                lineHeight: "18px",
                padding: "3px 10px",
              }}
            >
              {hotel.area}
            </Typography>
          }

          {
            hotel.is_estimated &&
            <Typography
              component="span"
              sx={{
                backgroundColor: "rgba(24, 49, 83, 0.06)",
                borderRadius: "100px",
                color: "rgba(24, 49, 83, 0.6)",
                fontSize: 12,
                lineHeight: "18px",
                padding: "3px 10px",
              }}
            >
              Estimated price
            </Typography>
          }
        </Box>

        <Box sx={{ marginTop: "auto" }}>
          <Button
            component="a"
            disableElevation
            href={hotel.booking_url}
            rel="noopener noreferrer"
            target="_blank"
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "10px",
              color: "primary.contrastText",
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: "20.25px",
              padding: "9px 18px",
              textTransform: "none",
            }}
          >
            Book Hotel →
          </Button>
        </Box>
      </Box>

      {
        isRecommended &&
        <Typography
          component="span"
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: "100px",
            color: brandColors.white,
            fontSize: 11,
            fontWeight: 700,
            left: 12,
            letterSpacing: "0.66px",
            lineHeight: "16.5px",
            padding: "3px 11px",
            position: "absolute",
            top: 12,
          }}
        >
          RECOMMENDED
        </Typography>
      }
    </Box>
  );
}

interface HotelsDialogProps {
  destination: string;
  hotels: readonly Hotel[];
  onClose: () => void;
}

export function HotelsDialog({ destination, hotels, onClose }: HotelsDialogProps) {
  const nights = getStayNights(hotels);
  const countLabel = `${hotels.length} recommended`;
  const nightsLabel = nights === 1 ? "1 night" : `${nights} nights`;

  return (
    <Dialog
      maxWidth="md"
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
        🏨 Hotels in {destination}

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
          {nights === null ? countLabel : `${countLabel} · ${nightsLabel}`}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "20px",
          }}
        >
          {
            hotels.map((hotel, index) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isRecommended={index === 0}
              />
            ))
          }
        </Box>

        {
          hotels.length === 0 &&
          <Typography
            component="p"
            sx={{
              color: "text.disabled",
              fontSize: 13,
              paddingTop: "20px",
            }}
          >
            No hotel options in this plan yet.
          </Typography>
        }
      </DialogContent>
    </Dialog>
  );
}
