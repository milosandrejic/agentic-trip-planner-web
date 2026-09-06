import type { ComponentType } from "react";

import type { SvgIconProps } from "@mui/material";
import {
  Box,
  Typography,
} from "@mui/material";
import {
  SellOutlined,
  AccessTimeRounded,
  LocationOnOutlined,
} from "@mui/icons-material";

import { formatCurrency } from "@/utils/format-currency";
import { formatDuration } from "@/utils/activity-display";

import { getActivityTypeStyle } from "@/constants/activity-types";

import type { Activity } from "@/types/itinerary";

/** Sized for `HH:MM`, matching the design now that the API returns clock times. */
const TIME_COLUMN_WIDTH = 50;

interface ActivityMetaProps {
  icon: ComponentType<SvgIconProps>;
  text: string;
}

function ActivityMeta({ icon: Icon, text }: ActivityMetaProps) {
  return (
    <Box
      sx={{
        alignItems: "center",
        color: "rgba(24, 49, 83, 0.4)",
        display: "flex",
        gap: "4px",
        minWidth: 0,
      }}
    >
      <Icon sx={{ fontSize: 12 }} />

      <Typography
        component="span"
        sx={{
          fontSize: 12,
          lineHeight: "18px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const { color, icon: KindIcon } = getActivityTypeStyle(activity.activity_type);
  const duration = formatDuration(activity.duration_hours ?? 0);

  // The API returns whole sentences here, not the short labels the design mocks up, so
  // the description wraps instead of being clipped — it is the row's primary content.
  const meta = [activity.venue_name, activity.note].filter(
    (value): value is string => Boolean(value),
  );

  // No provider prices activities, so any figure is a model estimate — the approximation
  // sign is the marker, and `price_eur` is per person unlike every other price.
  const price = activity.price_eur === null ? null : `≈ ${formatCurrency(activity.price_eur, "EUR")} per person`;

  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        paddingBottom: isLast ? 0 : "12px",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          paddingTop: "6px",
          width: 16,
        }}
      >
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: "50%",
            flexShrink: 0,
            height: 8,
            width: 8,
          }}
        />

        {
          !isLast &&
          <Box
            sx={{
              backgroundColor: "rgba(24, 49, 83, 0.08)",
              flex: 1,
              marginTop: "2px",
              minHeight: 24,
              width: "1px",
            }}
          />
        }
      </Box>

      <Box sx={{ minWidth: 0, paddingBottom: "6px" }}>
        <Box
          sx={{
            alignItems: "flex-start",
            display: "flex",
            minWidth: 0,
          }}
        >
          <Typography
            component="span"
            sx={{
              color: "rgba(24, 49, 83, 0.45)",
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12px",
              lineHeight: "18px",
              width: TIME_COLUMN_WIDTH,
            }}
          >
            {activity.time}
          </Typography>

          <KindIcon
            sx={{
              color,
              flexShrink: 0,
              fontSize: 14,
              marginRight: "8px",
              marginTop: "3px",
            }}
          />

          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "19.6px",
            }}
          >
            {activity.description}
          </Typography>
        </Box>

        <Box
          sx={{
            columnGap: "12px",
            display: "flex",
            flexWrap: "wrap",
            paddingLeft: `${TIME_COLUMN_WIDTH}px`,
            paddingTop: "2px",
            rowGap: "2px",
          }}
        >
          {
            meta.map((text) => (
              <ActivityMeta
                key={text}
                icon={LocationOnOutlined}
                text={text}
              />
            ))
          }

          {
            meta.length === 0 && activity.address &&
            <ActivityMeta
              icon={LocationOnOutlined}
              text={activity.address}
            />
          }

          {
            duration !== "" &&
            <ActivityMeta
              icon={AccessTimeRounded}
              text={duration}
            />
          }

          {
            price !== null &&
            <ActivityMeta
              icon={SellOutlined}
              text={price}
            />
          }
        </Box>
      </Box>
    </Box>
  );
}
