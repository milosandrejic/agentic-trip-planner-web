import Image from "next/image";

import {
  Box, Typography,
} from "@mui/material";

import sendIcon from "@/assets/preview-send-icon.svg";
import newTripIcon from "@/assets/preview-new-trip-icon.svg";
import assistantIcon from "@/assets/preview-assistant-icon.svg";

import { StatusChip } from "@/components/status-chip/status-chip";

interface PreviewTrip {
  active?: boolean;
  dates: string;
  flag: string;
  title: string;
}

const previewTrips: readonly PreviewTrip[] = [
  {
    active: true,
    dates: "Oct 12–19",
    flag: "🇮🇹",
    title: "Rome & Florence",
  },
  {
    dates: "Mar 3–17",
    flag: "🇯🇵",
    title: "Japan Spring",
  },
  {
    dates: "Jul 20–27",
    flag: "🇳🇴",
    title: "Norway Fjords",
  },
];

interface PreviewMessage {
  actions?: readonly string[];
  role: "assistant" | "user";
  text: string;
}

const previewMessages: readonly PreviewMessage[] = [
  {
    role: "user",
    text: "Plan a romantic week in Rome with one day in Florence.",
  },
  {
    actions: ["View flights", "See hotels", "Restaurants"],
    role: "assistant",
    text: "I've built your complete 7-day Roman itinerary. ✨ Found a direct flight from €189/person and a boutique hotel in Prati at €145/night. Day 5 is your Florence day — fast train booked for €29.",
  },
  {
    role: "user",
    text: "Add a cooking class on Day 6.",
  },
  {
    actions: ["Full itinerary", "Share trip"],
    role: "assistant",
    text: 'Done! "Pasta Making with Nonna" added on Day 6 afternoon (€75/person). Updated the evening dinner too. 🍝',
  },
];

interface PreviewDay {
  day: number;
  highlighted?: boolean;
  subtitle: string;
  title: string;
}

const previewDays: readonly PreviewDay[] = [
  { day: 1, subtitle: "Check-in · Piazza Navona", title: "Arrival & Trastevere" },
  { day: 2, subtitle: "Colosseum · Forum · La Pergola", title: "Ancient Rome" },
  { day: 3, subtitle: "St Peter's · Museums · Sistine", title: "Vatican & Prati" },
  { day: 4, subtitle: "Borghese Gallery · Trevi", title: "Piazzas & Art" },
  { day: 5, highlighted: true, subtitle: "Uffizi · Duomo · Fast train", title: "Florence Day Trip" },
  { day: 6, subtitle: "Cooking class · Appian Way", title: "Hidden Rome" },
  { day: 7, subtitle: "Sant'Eustachio · Airport", title: "Departure" },
];

const previewTags: readonly string[] = ["Romantic", "History", "Food"];

function BrowserChromeDot({ color }: { color: string }) {
  return (
    <Box
      sx={{
        backgroundColor: color,
        borderRadius: "5.5px",
        height: 11,
        width: 11,
      }}
    />
  );
}

function TripListItem({ trip }: { trip: PreviewTrip }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: trip.active ? "background.paper" : "transparent",
        border: trip.active ? "1px solid rgba(24, 49, 83, 0.07)" : "1px solid transparent",
        borderRadius: "10px",
        boxShadow: trip.active ? "0px 1px 3px 0px rgba(24, 49, 83, 0.07)" : "none",
        display: "flex",
        gap: "8px",
        padding: "9px 11px",
      }}
    >
      <Typography component="span" sx={{ fontSize: 16, lineHeight: 1.5 }}>
        {trip.flag}
      </Typography>

      <Box>
        <Typography
          component="p"
          sx={{
            color: trip.active ? "text.primary" : "rgba(24, 49, 83, 0.55)",
            fontSize: 12.5,
            fontWeight: trip.active ? 600 : 500,
            lineHeight: 1.2,
          }}
        >
          {trip.title}
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.38)",
            fontSize: 11,
            lineHeight: 1.5,
            marginTop: "2px",
          }}
        >
          {trip.dates}
        </Typography>
      </Box>
    </Box>
  );
}

function MessageActionButton({ label }: { label: string }) {
  return (
    <Box
      component="span"
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid rgba(47, 156, 149, 0.25)",
        borderRadius: "100px",
        color: "secondary.main",
        fontSize: 12,
        fontWeight: 500,
        padding: "4px 12px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}

function PreviewMessageBubble({ message }: { message: PreviewMessage }) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {
        !isUser &&
        <Box
          sx={{
            alignItems: "center",
            background: "linear-gradient(135deg, #183153 0%, #2f9c95 100%)",
            borderRadius: "8px",
            display: "flex",
            flexShrink: 0,
            height: 26,
            justifyContent: "center",
            width: 26,
          }}
        >
          <Image
            src={assistantIcon}
            alt=""
            width={11}
            height={11}
            aria-hidden="true"
          />
        </Box>
      }

      <Box sx={{ maxWidth: "90%" }}>
        <Box
          sx={{
            backgroundColor: isUser ? "primary.main" : "#f7f5f2",
            borderRadius: isUser ? "16px 16px 3px 16px" : "3px 16px 16px 16px",
            color: isUser ? "primary.contrastText" : "text.primary",
            display: "inline-block",
            fontSize: 13.5,
            lineHeight: 1.55,
            padding: "10px 14px",
          }}
        >
          {message.text}
        </Box>

        {
          message.actions &&
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {
              message.actions.map((action) => (
                <MessageActionButton
                  key={action}
                  label={action}
                />
              ))
            }
          </Box>
        }
      </Box>
    </Box>
  );
}

function ItineraryDayRow({ day }: { day: PreviewDay }) {
  return (
    <Box
      sx={{
        backgroundColor: day.highlighted ? "rgba(47, 156, 149, 0.07)" : "transparent",
        border: day.highlighted ? "1px solid rgba(47, 156, 149, 0.18)" : "1px solid transparent",
        borderRadius: "10px",
        display: "flex",
        gap: "10px",
        padding: "9px 12px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: day.highlighted ? "rgba(47, 156, 149, 0.15)" : "rgba(24, 49, 83, 0.06)",
          borderRadius: "7px",
          display: "flex",
          flexShrink: 0,
          height: 24,
          justifyContent: "center",
          width: 24,
        }}
      >
        <Typography
          component="span"
          sx={{
            color: day.highlighted ? "secondary.main" : "rgba(24, 49, 83, 0.45)",
            fontFamily: "var(--font-manrope)",
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {day.day}
        </Typography>
      </Box>

      <Box>
        <Typography
          component="p"
          sx={{
            color: "text.primary",
            fontFamily: "var(--font-manrope)",
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "-0.125px",
            lineHeight: 1.5,
          }}
        >
          {day.title}
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "rgba(24, 49, 83, 0.5)",
            fontSize: 11.5,
            lineHeight: 1.5,
            marginTop: "2px",
          }}
        >
          {day.subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export function ProductPreview() {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        paddingBlock: { xs: "56px", md: "96px" },
        paddingInline: { xs: "20px", md: "36px" },
      }}
    >
      <Box sx={{ marginInline: "auto", maxWidth: 1280 }}>
        <Box sx={{ maxWidth: 404 }}>
          <Typography
            component="p"
            sx={{
              color: "secondary.main",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "1.375px",
              textTransform: "uppercase",
            }}
          >
            Live product preview
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
            }}
          >
            See what your trip could look like
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.55)",
              fontSize: 16,
              lineHeight: 1.65,
              marginTop: "16px",
            }}
          >
            AI creates a complete itinerary tailored to your preferences, adjustable through natural conversation.
          </Typography>
        </Box>

        <Box
          sx={{
            marginTop: { xs: "40px", md: "56px" },
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "20px",
              boxShadow: "0px 32px 80px 0px rgba(24, 49, 83, 0.12), 0px 0px 0px 1px rgba(24, 49, 83, 0.06)",
              minWidth: 960,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "#f0eeeb",
                borderBottom: "1px solid rgba(24, 49, 83, 0.08)",
                display: "flex",
                gap: "8px",
                padding: "12px 18px",
              }}
            >
              <BrowserChromeDot color="#ff5f56" />
              <BrowserChromeDot color="#ffbd2e" />
              <BrowserChromeDot color="#27c93f" />

              <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "#e4e1dc",
                    borderRadius: "6px",
                    padding: "3px 14px",
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      color: "rgba(24, 49, 83, 0.4)",
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    app.agentictripper.com
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  backgroundColor: "#f7f5f2",
                  borderRight: "1px solid rgba(24, 49, 83, 0.07)",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  gap: "3px",
                  padding: "16px 12px",
                  width: 200,
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    color: "rgba(24, 49, 83, 0.38)",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.945px",
                    paddingInline: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  Trips
                </Typography>

                <Box
                  sx={{
                    alignItems: "center",
                    border: "1.5px dashed rgba(47, 156, 149, 0.3)",
                    borderRadius: "10px",
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    marginTop: "7px",
                    padding: "9px 12px",
                  }}
                >
                  <Image
                    src={newTripIcon}
                    alt=""
                    width={12}
                    height={12}
                    aria-hidden="true"
                  />

                  <Typography
                    component="span"
                    sx={{
                      color: "secondary.main",
                      fontSize: 12.5,
                      fontWeight: 500,
                    }}
                  >
                    New Trip
                  </Typography>
                </Box>

                <Box sx={{ marginTop: "5px" }}>
                  {
                    previewTrips.map((trip) => (
                      <TripListItem
                        key={trip.title}
                        trip={trip}
                      />
                    ))
                  }
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    borderBottom: "1px solid rgba(24, 49, 83, 0.07)",
                    display: "flex",
                    gap: "10px",
                    padding: "14px 20px",
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-manrope)",
                      fontSize: 14.5,
                      fontWeight: 700,
                      letterSpacing: "-0.29px",
                    }}
                  >
                    Trip to Rome
                  </Typography>

                  <StatusChip status="ready" size="small" />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    padding: "20px",
                  }}
                >
                  {
                    previewMessages.map((message, index) => (
                      <PreviewMessageBubble
                        key={index}
                        message={message}
                      />
                    ))
                  }
                </Box>

                <Box
                  sx={{
                    borderTop: "1px solid rgba(24, 49, 83, 0.07)",
                    marginTop: "auto",
                    padding: "12px 16px",
                  }}
                >
                  <Box
                    sx={{
                      alignItems: "center",
                      backgroundColor: "#f7f5f2",
                      borderRadius: "12px",
                      display: "flex",
                      gap: "8px",
                      padding: "9px 13px",
                    }}
                  >
                    <Typography
                      component="p"
                      sx={{
                        color: "rgba(24, 49, 83, 0.36)",
                        flex: 1,
                        fontSize: 13.5,
                      }}
                    >
                      Ask anything about your trip…
                    </Typography>

                    <Box
                      sx={{
                        alignItems: "center",
                        backgroundColor: "primary.main",
                        borderRadius: "8px",
                        display: "flex",
                        flexShrink: 0,
                        height: 28,
                        justifyContent: "center",
                        width: 28,
                      }}
                    >
                      <Image
                        src={sendIcon}
                        alt=""
                        width={18}
                        height={18}
                        aria-hidden="true"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  borderLeft: "1px solid rgba(24, 49, 83, 0.07)",
                  flexShrink: 0,
                  width: 280,
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    borderBottom: "1px solid rgba(24, 49, 83, 0.07)",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      color: "text.primary",
                      fontFamily: "var(--font-manrope)",
                      fontSize: 13.5,
                      fontWeight: 700,
                      letterSpacing: "-0.27px",
                    }}
                  >
                    Itinerary overview
                  </Typography>

                  <Typography
                    component="p"
                    sx={{
                      color: "rgba(24, 49, 83, 0.4)",
                      fontSize: 12,
                    }}
                  >
                    7 days in Rome
                  </Typography>
                </Box>

                <Box
                  sx={{
                    borderBottom: "1px solid rgba(24, 49, 83, 0.06)",
                    display: "flex",
                    gap: "6px",
                    padding: "10px 14px",
                  }}
                >
                  {
                    previewTags.map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          backgroundColor: "#f7f5f2",
                          border: "1px solid rgba(24, 49, 83, 0.08)",
                          borderRadius: "100px",
                          color: "rgba(24, 49, 83, 0.6)",
                          fontSize: 11.5,
                          fontWeight: 500,
                          padding: "3px 10px",
                        }}
                      >
                        {tag}
                      </Box>
                    ))
                  }
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "12px",
                  }}
                >
                  {
                    previewDays.map((day) => (
                      <ItineraryDayRow
                        key={day.day}
                        day={day}
                      />
                    ))
                  }
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
