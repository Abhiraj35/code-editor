"use client";

import Link from "next/link";
import Image from "next/image";
import UserButton from "../auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between w-full max-w-5xl h-14 px-6 rounded-full border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 pointer-events-auto"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <Image
              src="/logo.svg"
              alt="Logo"
              height={32}
              width={32}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="hidden sm:block font-bold text-sm tracking-tight">
              VibeCode
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
          </div>
          <div className="h-4 w-px bg-border mx-1" />
          <UserButton />
        </div>
      </motion.div>
    </header>
  );
}
