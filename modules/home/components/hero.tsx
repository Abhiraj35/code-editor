"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 hover:bg-primary/15 transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing VibeCode v2.0
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
            Code at the speed <br className="hidden md:block" /> of thought.
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            VibeCode is the intelligent code editor designed for modern developers.
            Experience a seamless workflow with built-in AI, keyboard-first navigation,
            and instant previews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium group">
                Get Started for free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-medium">
                View Documentation
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden aspect-video">
             <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-secondary/5" />
             <Image
                src="/hero.svg"
                alt="App Preview"
                fill
                className="object-cover opacity-90 p-4"
             />
             {/* Decorative elements */}
             <div className="absolute -top-px left-20 right-20 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
             <div className="absolute -bottom-px left-20 right-20 h-px bg-linear-to-r from-transparent via-secondary/50 to-transparent" />
          </div>

          {/* Background Glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};
