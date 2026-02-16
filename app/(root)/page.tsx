import { Hero } from "@/modules/home/components/hero";
import { Features } from "@/modules/home/components/features";
import { CTA } from "@/modules/home/components/cta";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      {/* Dev Experience Section could go here if needed, but Features covers a lot */}
      <CTA />
    </div>
  );
}
