import { MarketingLayout } from "@/layouts/marketing-layout/marketing-layout";

import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function HomePage() {
  return (
    <MarketingLayout
      footer={<Footer />}
      navbar={<Navbar />}
    >
      <Hero />
      <HowItWorks />
    </MarketingLayout>
  );
}
