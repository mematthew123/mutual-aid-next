import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <Section spacing="xl">
      <Container size="sm">
        <div className="text-center">
          <p className="text-8xl font-bold text-stone-200 mb-6">404</p>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">
            Page not found
          </h1>
          <p className="text-stone-600 mb-8">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
