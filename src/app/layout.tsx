import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Agentic Trip Planner",
  description: "AI-powered conversational travel planning",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
