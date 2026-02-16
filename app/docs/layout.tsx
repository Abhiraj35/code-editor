"use client";

import { Header } from "@/modules/home/header";
import { Footer } from "@/modules/home/footer";
import { DocsSidebar } from "./components/docs-sidebar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Mobile Docs Sub-Header */}
      <div className="lg:hidden sticky top-20 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
              <Menu className="w-4 h-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="mb-6 border-b pb-4">
              <SheetTitle className="text-left">Documentation</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              <DocsSidebar />
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Getting Started
        </div>
      </div>

      <div className="flex-1 flex pt-4 lg:pt-24">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border p-6 h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto">
          <DocsSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
