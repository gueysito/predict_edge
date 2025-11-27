import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/" data-testid="link-home">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/markets" data-testid="link-markets">
            Browse Markets
          </Link>
        </Button>
      </div>
    </div>
  );
}
