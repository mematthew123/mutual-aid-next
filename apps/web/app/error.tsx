"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <Section spacing="xl">
      <Container size="sm">
        <div className="text-center">
          <p className="text-6xl font-bold text-stone-200 mb-6">!</p>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">
            Something went wrong
          </h1>
          <p className="text-stone-600 mb-8">
            We apologize for the inconvenience. Please try again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
