import { Button } from "@/components/ui/button";

/**
 * Renders the home page: a full-height centered container with a "Get Started" button.
 *
 * @returns The JSX element containing a vertically centered layout with a Button labeled "Get Started".
 */
export default function Home() {
  return (
    <div className="flex flex-col item-center justify-center h-screen bg-gray-100">
      <Button>
        Get Started
      </Button>
    </div>
  );
}