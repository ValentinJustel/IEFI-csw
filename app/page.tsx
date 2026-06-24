"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/ui/fade-in";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <FadeIn><Stats /></FadeIn>
        <FadeIn><Features /></FadeIn>
        <FadeIn><HowItWorks /></FadeIn>
        <FadeIn><Testimonials /></FadeIn>
        <FadeIn><Pricing /></FadeIn>
        <FadeIn><CTA /></FadeIn>
        <Footer />
      </div>
    </main>
  );
}