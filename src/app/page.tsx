import { MarketingLayout } from "@/layouts/marketing-layout/marketing-layout";

import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { FinalCta } from "@/components/landing/final-cta";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { ProductPreview } from "@/components/landing/product-preview";

export default function HomePage() {
  return (
    <MarketingLayout
      footer={<Footer />}
      navbar={<Navbar />}
    >
      <Hero />
      <HowItWorks />
      <ProductPreview />
      <FeatureGrid />
      <Stats />
      <FinalCta />
    </MarketingLayout>
  );
}
