import type { Metadata } from "next";

import {
  Inter,
  Manrope,
} from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
  weight: "variable",
});

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Agentic Trip Planner",
  description: "AI-powered conversational travel planning",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} ${inter.className}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
