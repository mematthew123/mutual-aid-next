import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { ResourceCard } from "@/components/cards";
import { getAllResources } from "@/lib/sanity";
import type { CommunityResource, Category } from "@/lib/sanity/types";

interface FeaturedResourcesBlockProps {
  heading?: string;
  subheading?: string;
  displayType?: "manual" | "category" | "verified";
  resources?: CommunityResource[];
  category?: Category;
  limit?: number;
  showViewAll?: boolean;
}

export async function FeaturedResourcesBlock({
  heading,
  subheading,
  displayType = "manual",
  resources: manualResources,
  limit = 6,
  showViewAll = true,
}: FeaturedResourcesBlockProps) {
  let resources: CommunityResource[];

  if (displayType === "manual" && manualResources?.length) {
    resources = manualResources.slice(0, limit);
  } else {
    const allResources = await getAllResources();
    resources = allResources.slice(0, limit);
  }

  if (!resources.length) return null;

  return (
    <Section spacing="lg">
      <Container>
        {heading && (
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4">
              {heading}
            </h2>
            {subheading && (
              <p className="text-stone-600 max-w-2xl mx-auto">{subheading}</p>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/resources">View All Resources</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
