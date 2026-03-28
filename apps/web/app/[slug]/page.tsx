import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout";
import { PageBuilder } from "@/components/blocks";
import { getPageBySlug, getAllPageSlugs } from "@/lib/sanity";

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

// Reserved slugs that have their own routes
const RESERVED_SLUGS = [
  "requests",
  "offers",
  "request-help",
  "offer-help",
  "events",
  "resources",
  "donate",
  "api",
];

export async function generateMetadata({ params }: DynamicPageProps) {
  const { slug } = await params;

  // Don't generate metadata for reserved slugs
  if (RESERVED_SLUGS.includes(slug)) {
    return {};
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.seo?.metaTitle || `${page.title} | Mutual Aid Network`,
    description: page.seo?.metaDescription,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs
    .filter((slug) => !RESERVED_SLUGS.includes(slug))
    .map((slug) => ({ slug }));
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  // Return 404 for reserved slugs (they have their own routes)
  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // For now, render a simple placeholder
  // A full implementation would render Portable Text blocks from pageBuilder
  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              {page.title}
            </h1>
          </div>
        </Container>
      </Section>

      {/* Page Content */}
      {page.pageBuilder && page.pageBuilder.length > 0 ? (
        <PageBuilder blocks={page.pageBuilder} />
      ) : (
        <Section spacing="lg">
          <Container size="md">
            <div className="text-center py-12">
              <p className="text-stone-500">
                This page doesn&apos;t have any content yet.
              </p>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
