"use client";

import {
  MarkerF,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";

import { CloseRounded } from "@mui/icons-material";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import {
  getMapCenter,
  mapMarkerKinds,
  buildMapMarkers,
  mapMarkerColors,
  mapMarkerLabels,
  createMarkerIcon,
} from "@/utils/map-markers";

import { brandColors } from "@/theme/palette";
import { getGoogleMapsApiKey } from "@/config/env";

import type { Itinerary } from "@/types/itinerary";

const MAP_HEIGHT = 460;
const DEFAULT_ZOOM = 13;

const mapOptions: google.maps.MapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
};

function MapLegend() {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "12px",
        bottom: 16,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
        left: 16,
        padding: "10px 14px",
        position: "absolute",
        zIndex: 1,
      }}
    >
      {
        mapMarkerKinds.map((kind) => (
          <Box
            key={kind}
            sx={{
              alignItems: "center",
              display: "flex",
              gap: "7px",
              paddingBlock: "2px",
            }}
          >
            <Box
              sx={{
                backgroundColor: mapMarkerColors[kind],
                borderRadius: "50%",
                flexShrink: 0,
                height: 8,
                width: 8,
              }}
            />

            <Typography
              component="span"
              sx={{
                color: "text.primary",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
              }}
            >
              {mapMarkerLabels[kind]}
            </Typography>
          </Box>
        ))
      }
    </Box>
  );
}

interface MapDialogProps {
  itinerary: Itinerary;
  onClose: () => void;
}

export function MapDialog({ itinerary, onClose }: MapDialogProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: getGoogleMapsApiKey(),
    id: "agentic-trip-google-maps",
  });

  const markers = buildMapMarkers(itinerary);
  const center = getMapCenter(markers);

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
          fontSize: 17,
          fontWeight: 800,
          gap: "16px",
          justifyContent: "space-between",
          letterSpacing: "-0.425px",
          padding: "16px 20px",
        }}
      >
        📍 Map — {itinerary.destination}

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

      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            backgroundColor: brandColors.workspace,
            height: MAP_HEIGHT,
            position: "relative",
            width: "100%",
          }}
        >
          {
            Boolean(loadError) &&
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                padding: 3,
              }}
            >
              <Typography
                component="p"
                sx={{
                  color: "text.disabled",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                The map could not be loaded. Check the Google Maps API key.
              </Typography>
            </Box>
          }

          {
            !loadError && !isLoaded &&
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                size={28}
                sx={{ color: "text.disabled" }}
              />
            </Box>
          }

          {
            !loadError && isLoaded && center === null &&
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                padding: 3,
              }}
            >
              <Typography
                component="p"
                sx={{
                  color: "text.disabled",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                This plan has no mapped places yet.
              </Typography>
            </Box>
          }

          {
            !loadError && isLoaded && center !== null &&
            <GoogleMap
              center={{ lat: center.latitude, lng: center.longitude }}
              mapContainerStyle={{ height: "100%", width: "100%" }}
              options={mapOptions}
              zoom={DEFAULT_ZOOM}
            >
              {
                markers.map((marker) => (
                  <MarkerF
                    key={marker.id}
                    icon={{
                      scaledSize: new google.maps.Size(30, 38),
                      url: createMarkerIcon(marker.kind),
                    }}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    title={marker.title}
                  />
                ))
              }
            </GoogleMap>
          }

          {
            markers.length > 0 &&
            <MapLegend />
          }
        </Box>
      </DialogContent>
    </Dialog>
  );
}
