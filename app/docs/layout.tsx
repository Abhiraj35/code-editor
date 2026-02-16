import { Header } from "@/modules/home/header";
import { Footer } from "@/modules/home/footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex pt-20">
        <aside className="hidden lg:block w-64 border-r border-border p-6 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2">Getting Started</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="text-primary font-medium">Introduction</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Installation</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Quick Start</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Command Palette</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Keyboard Shortcuts</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Advanced</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Custom Templates</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">API Reference</li>
              </ul>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
