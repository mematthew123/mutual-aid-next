import { Container, Section } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { ResourceCard } from "@/components/cards";
import { HeartIcon } from "@/components/icons/category-icons";
import { getAllResources } from "@/lib/sanity";

export const metadata = {
  title: "Community Resources | Mutual Aid Network",
  description: "Find local organizations, services, and resources to help you and your family.",
};

export default async function ResourcesPage() {
  const resources = await getAllResources();

  const featuredResources = resources.filter((r) => r.isFeatured);
  const otherResources = resources.filter((r) => !r.isFeatured);

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              Community Resources
            </h1>
            <p className="mt-3 text-stone-600 text-lg max-w-xl mx-auto">
              Local organizations, services, and resources to support you and your neighbors.
            </p>
          </div>
        </Container>
      </Section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <Section spacing="lg">
          <Container>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* All Resources */}
      <Section spacing="lg" background={featuredResources.length > 0 ? "muted" : "default"}>
        <Container>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            {featuredResources.length > 0 ? "All Resources" : "Resources"}
          </h2>

          {otherResources.length === 0 && featuredResources.length === 0 ? (
            <EmptyState
              icon={<HeartIcon className="size-12 text-stone-300" />}
              title="No resources available yet"
              description="We're building our resource directory. Check back soon!"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-800">
              Know of a resource we should add?
            </h2>
            <p className="mt-3 text-stone-600">
              Help us grow our community resource directory by sharing organizations
              and services that help our neighbors.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
