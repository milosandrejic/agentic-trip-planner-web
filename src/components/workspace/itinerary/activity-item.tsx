import type { ComponentType } from "react";

import type { SvgIconProps } from "@mui/material";
import {
  Box,
  Typography,
} from "@mui/material";
import {
  HotelRounded,
  RestaurantRounded,
  AccessTimeRounded,
  LocationOnOutlined,
  FlightTakeoffRounded,
  AccountBalanceRounded,
} from "@mui/icons-material";

import type { ActivityKind } from "@/utils/activity-display";
import {
  formatDuration,
  getActivityKind,
} from "@/utils/activity-display";

import { brandColors } from "@/theme/palette";

import type { Activity } from "@/types/itinerary";

/**
 * The design puts a clock time in this column; the API only exposes a bucket
 * ("Morning" | "Afternoon" | "Evening"), so the column is widened to fit the words.
 */
const TIME_COLUMN_WIDTH = 68;

interface ActivityKindStyle {
  color: string;
  icon: ComponentType<SvgIconProps>;
}

const kindStyles: Record<ActivityKind, ActivityKindStyle> = {
  attraction: {
    color: brandColors.navy,
    icon: AccountBalanceRounded,
  },
  dining: {
    color: brandColors.orange,
    icon: RestaurantRounded,
  },
  lodging: {
    color: brandColors.teal,
    icon: HotelRounded,
  },
  transport: {
    color: brandColors.clay,
    icon: FlightTakeoffRounded,
  },
};

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
  const kind = getActivityKind(activity);
  const { color, icon: KindIcon } = kindStyles[kind];
  const duration = formatDuration(activity.duration_hours ?? 0);

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
            alignItems: "center",
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
            }}
          />

          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "19.6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
            activity.address &&
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
        </Box>
      </Box>
    </Box>
  );
}
