import type { Metadata } from "next";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LogoStrip } from "@/components/LogoStrip";
import { Playhead } from "@/components/Playhead";
import { Preloader } from "@/components/Preloader";
import { Pricing } from "@/components/Pricing";
import { Showreel } from "@/components/Showreel";
import { Testimonials } from "@/components/Testimonials";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: site.meta.description,
};

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Playhead />
      <main id="main">
        <Hero />
        <LogoStrip />
        <HowItWorks />
        <Showreel />
        <BenefitsGrid />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
    </>
  );
}
