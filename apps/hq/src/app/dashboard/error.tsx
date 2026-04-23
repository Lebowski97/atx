"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {error.message.includes("Not authorized")
            ? "Your account isn't authorized to access this dashboard. Check that your email is in the admin list."
            : error.message.includes("Not authenticated")
              ? "You need to sign in to access this dashboard."
              : "There was a problem loading the dashboard. Try again."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
