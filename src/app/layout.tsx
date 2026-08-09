import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic Trip Planner",
  description: "AI-powered conversational travel planning",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
