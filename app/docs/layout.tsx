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

      {/* Mobile Sidebar Trigger - Floating above content on small screens */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg w-12 h-12">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle documentation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-left">Documentation</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-10">
              <DocsSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 flex pt-20">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border p-6 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
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
