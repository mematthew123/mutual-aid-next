import Link from "next/link";
import { Suspense } from "react";
import { Container, Section } from "@/components/layout";
import { Button, EmptyState } from "@/components/ui";
import { OfferCard } from "@/components/cards";
import { FilterBar } from "@/components/filters";
import { HeartIcon } from "@/components/icons/category-icons";
import {
  getActiveOffers,
  getCategories,
  getUniqueNeighborhoods,
} from "@/lib/sanity";
import type { OfferFilters } from "@/lib/sanity/types";

interface OffersPageProps {
  searchParams: Promise<{
    category?: string;
    neighborhood?: string;
  }>;
}

export const metadata = {
  title: "Available Help | Mutual Aid Network",
  description: "Browse offers from neighbors ready to help in your community.",
};

async function OffersList({ filters }: { filters: OfferFilters }) {
  const offers = await getActiveOffers(filters);

  if (offers.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="size-12 text-stone-300" />}
        title="No offers match your filters"
        description="Try adjusting your filters or check back soon for new offers."
        action={{
          label: "View All Offers",
          href: "/offers",
        }}
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <OfferCard key={offer._id} offer={offer} />
      ))}
    </div>
  );
}

function OffersListSkeleton() {
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

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;
  const [categories, neighborhoods] = await Promise.all([
    getCategories(),
    getUniqueNeighborhoods(),
  ]);

  const filters: OfferFilters = {
    category: params.category,
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
                Available Help
              </h1>
              <p className="mt-2 text-stone-600 text-lg">
                Neighbors ready to lend a hand
              </p>
            </div>
            <Button asChild>
              <Link href="/offer-help">Offer Your Help</Link>
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
                showUrgency={false}
                basePath="/offers"
              />
            </Suspense>
          </div>

          {/* Results */}
          <Suspense fallback={<OffersListSkeleton />}>
            <OffersList filters={filters} />
          </Suspense>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="muted">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-800">
              Want to help your neighbors?
            </h2>
            <p className="mt-3 text-stone-600">
              Share your skills, time, or resources with those who need them most.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/offer-help">Start Volunteering</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
