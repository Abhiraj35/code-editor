"use client";

import { motion } from "motion/react";
import {
  Zap,
  Shield,
  Cpu,
  Globe,
  Keyboard,
  Command,
  Layers,
  Sparkles
} from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description: "Built on a custom-optimized engine for near-zero latency coding experience.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Keyboard First",
    description: "Navigate through everything without ever touching your mouse.",
    icon: <Keyboard className="w-6 h-6 text-blue-500" />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Command Palette",
    description: "Quickly access any file or command with CMD+K.",
    icon: <Command className="w-6 h-6 text-purple-500" />,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Cloud Sync",
    description: "Your settings and snippets are synced across all your devices instantly.",
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Intelligent Autocomplete",
    description: "Context-aware AI that suggests what you need before you even know it.",
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    className: "md:col-span-1 md:row-span-1",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Built for modern workflows</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience a set of features that help you focus on what matters: writing great code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 ${feature.className}`}
            >
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-secondary group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Subtle hover background effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
