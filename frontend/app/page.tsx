import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DemoSection } from '@/components/landing/DemoSection';
import { Features } from '@/components/landing/Features';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className=\"flex flex-col min-h-dvh\">
      <Navbar />
      <main className=\"pt-[72px]\">
        <Hero />
        <HowItWorks />
        <DemoSection />
        <Features />
        <FAQ />
        <CTA />
      </main>\n      <LandingFooter />\n    </div>\n  );\n}\n