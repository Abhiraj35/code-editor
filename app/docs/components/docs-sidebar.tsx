export const DocsSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-foreground">Getting Started</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="text-primary font-semibold cursor-pointer">Introduction</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Installation</li>
          <li className="hover:text-foreground cursor-pointer transition-colors">Quick Start</li>
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
