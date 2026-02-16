export const DocsSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-foreground">Getting Started</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <a href="/docs/introduction" className="text-primary font-semibold transition-colors hover:text-foreground">
              Introduction
            </a>
          </li>
          <li>
            <a href="/docs/installation" className="transition-colors hover:text-foreground">
              Installation
            </a>
          </li>
          <li>
            <a href="/docs/quick-start" className="transition-colors hover:text-foreground">
              Quick Start
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-foreground">Features</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="hover:text-foreground cursor-pointer transition-colors">Command Palette</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Keyboard Shortcuts</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Templates</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-foreground">Advanced</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="hover:text-foreground cursor-pointer transition-colors">Custom Templates</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">API Reference</li>
        </ul>
      </div>
    </div>
  );
};
