import { Box } from "@mui/material";

import { MarketingLayout } from "@/layouts/marketing-layout/marketing-layout";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

export default function HomePage() {
  return (
    <MarketingLayout
      footer={<Footer />}
      navbar={<Navbar />}
    >
      <Box
        sx={{
          minHeight: {
            xs: "calc(100dvh - 238px)",
            md: "calc(100dvh - 166px)",
          },
        }}
      />
    </MarketingLayout>
  );
}
