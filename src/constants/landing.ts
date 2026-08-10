export interface FeatureGridItem {
  description: string;
  icon: string;
  title: string;
}

export const featureGridItems: readonly FeatureGridItem[] = [
  {
    description: "Optimal routes and fares surfaced automatically for your dates and budget.",
    icon: "✈",
    title: "Flights",
  },
  {
    description: "Curated accommodation ranked by location, style and reviews.",
    icon: "🏨",
    title: "Hotels",
  },
  {
    description: "Your full journey visualized with walks, transit and distances.",
    icon: "🗺",
    title: "Maps",
  },
  {
    description: "Must-sees and hidden gems balanced across every day.",
    icon: "📍",
    title: "Attractions",
  },
  {
    description: "Local gems and celebrated spots filtered by cuisine and budget.",
    icon: "🍽",
    title: "Restaurants",
  },
  {
    description: "Day-by-day forecasts and packing suggestions built into your plan.",
    icon: "☀",
    title: "Weather",
  },
  {
    description: "Concerts and festivals timed perfectly to your travel window.",
    icon: "🎟",
    title: "Events",
  },
  {
    description: "Hyper-personal suggestions that learn from your preferences.",
    icon: "✨",
    title: "AI Recommendations",
  },
];
