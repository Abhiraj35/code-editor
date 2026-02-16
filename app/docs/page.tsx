import { Badge } from "@/components/ui/badge";

export default function DocsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline">v2.0.0</Badge>
        <span className="text-sm text-muted-foreground">Updated 2 days ago</span>
      </div>

      <h1 className="text-4xl font-extrabold mb-6">Introduction</h1>

      <p className="text-xl text-muted-foreground mb-8">
        Welcome to the VibeCode documentation. VibeCode is a next-generation code editor
        built for speed, intelligence, and developer happiness.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">What is VibeCode?</h2>
        <p>
          VibeCode is more than just a text editor. It's a complete playground for your ideas.
          Whether you're building a React component, a Next.js app, or an Express server,
          VibeCode provides the tools you need to write and test code instantly in your browser.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Core Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-bold mb-2">Keyboard First</h3>
            <p className="text-sm text-muted-foreground">
              Every action in VibeCode can be triggered from the keyboard.
              Our Command Palette (CMD+K) is the heart of the experience.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-bold mb-2">Zero Latency</h3>
            <p className="text-sm text-muted-foreground">
              We've optimized every part of the stack to ensure your typing and
              previews are as fast as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p>
          Ready to dive in? Check out our <span className="text-primary font-medium cursor-pointer">Quick Start</span> guide
          or explore the <span className="text-primary font-medium cursor-pointer">Keyboard Shortcuts</span>.
        </p>
      </section>
    </div>
  );
}
