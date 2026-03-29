import Link from "next/link";
import { Suspense } from "react";
import { Container, Section } from "@/components/layout";
import { Button, EmptyState } from "@/components/ui";
import { RequestCard } from "@/components/cards";
import { FilterBar } from "@/components/filters";
import { HeartIcon } from "@/components/icons/category-icons";
import {
  getOpenRequests,
  getCategories,
  getUniqueNeighborhoods,
} from "@/lib/sanity";
import { getSiteConfig, defaults as siteConfigDefaults } from "@/lib/site-config";
import type { RequestFilters } from "@/lib/sanity/types";

interface RequestsPageProps {
  searchParams: Promise<{
    category?: string;
    urgency?: string;
    neighborhood?: string;
  }>;
}

export const metadata = {
  title: `${siteConfigDefaults.pages.requests.title} | ${siteConfigDefaults.name}`,
  description: `Browse open requests from ${siteConfigDefaults.terms.members} who need help in your community.`,
};

async function RequestsList({ filters }: { filters: RequestFilters }) {
  const requests = await getOpenRequests(filters);

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="size-12 text-stone-300" />}
        title={siteConfigDefaults.pages.requests.emptyTitle}
        description={siteConfigDefaults.pages.requests.emptyDescription}
        action={{
          label: "View All Requests",
          href: "/requests",
        }}
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}

function RequestsListSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-2xl bg-stone-100 animate-pulse"
        />
      ))}
    </div>
  );
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const params = await searchParams;
  const [categories, neighborhoods, siteConfig] = await Promise.all([
    getCategories(),
    getUniqueNeighborhoods(),
    getSiteConfig(),
  ]);

  const filters: RequestFilters = {
    category: params.category,
    urgency: params.urgency as RequestFilters["urgency"],
    neighborhood: params.neighborhood,
  };

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
                {siteConfig.pages.requests.title}
              </h1>
              <p className="mt-2 text-stone-600 text-lg">
                {siteConfig.pages.requests.description}
              </p>
            </div>
            <Button asChild>
              <Link href="/request-help">Submit a Request</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Filters + Results */}
      <Section spacing="lg">
        <Container>
          {/* Filter Bar */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-12" />}>
              <FilterBar
                categories={categories}
                neighborhoods={neighborhoods}
                showUrgency={true}
                basePath="/requests"
              />
            </Suspense>
          </div>

          {/* Results */}
          <Suspense fallback={<RequestsListSkeleton />}>
            <RequestsList filters={filters} />
          </Suspense>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="muted">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-800">
              {siteConfig.pages.requests.ctaTitle}
            </h2>
            <p className="mt-3 text-stone-600">
              {siteConfig.pages.requests.ctaDescription}
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/request-help">Submit a Request</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
