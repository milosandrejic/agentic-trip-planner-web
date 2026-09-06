import type { ComponentType } from "react";

import type { SvgIconProps } from "@mui/material";
import {
  ParkRounded,
  PlaceRounded,
  HotelRounded,
  ChurchRounded,
  SchoolRounded,
  MuseumRounded,
  LocalBarRounded,
  LandscapeRounded,
  LocalCafeRounded,
  NightlifeRounded,
  RestaurantRounded,
  ShoppingBagRounded,
  DirectionsCarRounded,
  FlightTakeoffRounded,
  DirectionsWalkRounded,
  AccountBalanceRounded,
  DirectionsTransitRounded,
} from "@mui/icons-material";

import { brandColors } from "@/theme/palette";

import type { ActivityType } from "@/types/itinerary";

/** The three groups the map legend names. */
export type MapMarkerKind = "attraction" | "hotel" | "restaurant";

interface ActivityTypeStyle {
  color: string;
  icon: ComponentType<SvgIconProps>;
  /** Which legend group this type falls into on the map. */
  mapKind: MapMarkerKind;
}

/**
 * Single source for the timeline icon, the timeline dot colour and the map pin.
 *
 * The enum is finer-grained than the design's three-group legend, so the collapse to
 * `mapKind` happens here rather than being re-derived per surface.
 */
export const activityTypeStyles: Record<ActivityType, ActivityTypeStyle> = {
  cafe: { color: brandColors.orange, icon: LocalCafeRounded, mapKind: "restaurant" },
  church: { color: brandColors.navy, icon: ChurchRounded, mapKind: "attraction" },
  class: { color: brandColors.navy, icon: SchoolRounded, mapKind: "attraction" },
  drinks: { color: brandColors.orange, icon: LocalBarRounded, mapKind: "restaurant" },
  flight: { color: brandColors.clay, icon: FlightTakeoffRounded, mapKind: "attraction" },
  hotel: { color: brandColors.teal, icon: HotelRounded, mapKind: "hotel" },
  landmark: { color: brandColors.navy, icon: AccountBalanceRounded, mapKind: "attraction" },
  meal: { color: brandColors.orange, icon: RestaurantRounded, mapKind: "restaurant" },
  museum: { color: brandColors.navy, icon: MuseumRounded, mapKind: "attraction" },
  nature: { color: brandColors.slate, icon: ParkRounded, mapKind: "attraction" },
  nightlife: { color: brandColors.orange, icon: NightlifeRounded, mapKind: "restaurant" },
  other: { color: brandColors.slate, icon: PlaceRounded, mapKind: "attraction" },
  shopping: { color: brandColors.navy, icon: ShoppingBagRounded, mapKind: "attraction" },
  train: { color: brandColors.clay, icon: DirectionsTransitRounded, mapKind: "attraction" },
  transfer: { color: brandColors.clay, icon: DirectionsCarRounded, mapKind: "attraction" },
  viewpoint: { color: brandColors.slate, icon: LandscapeRounded, mapKind: "attraction" },
  walk: { color: brandColors.slate, icon: DirectionsWalkRounded, mapKind: "attraction" },
};

/**
 * Falls back to `other` rather than throwing — older itineraries are snapshots that
 * predate the enum, and a value we do not recognise must still render.
 */
export function getActivityTypeStyle(activityType: ActivityType): ActivityTypeStyle {
  return activityTypeStyles[activityType] ?? activityTypeStyles.other;
}
