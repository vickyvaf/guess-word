import { Button } from "@/uikits/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          An error occurred while rendering this page.
        </p>
      </div>

      {/* Optional: Show error details in development */}
      {import.meta.env.DEV && (
        <pre className="max-w-[500px] overflow-auto rounded-md bg-muted p-4 text-left text-sm text-destructive">
          {error.message}
        </pre>
      )}

      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}
