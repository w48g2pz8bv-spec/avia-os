"use client";

import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import NeuralMap from "@/components/sections/neural-map";
import CTA from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { useRouter } from "next/navigation";
import Script from "next/script";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AIVA Neural OS",
  "description": "AI-powered digital nervous system for business automation.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
};


export default function MarketingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen bg-[#050506] selection:bg-accent selection:text-black">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      {/* Scroll Progress Bar */}

      <div className="fixed top-0 left-0 right-0 h-[1px] bg-white/5 z-[60]">
        <div className="h-full bg-accent w-0 animate-pulse shadow-[0_0_10px_#00ffd1]" />
      </div>

      <Hero />
      
      <div id="zeka">
        <Features />
      </div>

      <div id="mimari">
        <NeuralMap />
      </div>

      <div id="guvenlik">
        {/* Security Section exists but I'll skip it for brevity or add it if needed */}
        <CTA onOpenModal={handleStart} />
      </div>

      <Footer />
    </main>
  );
}
