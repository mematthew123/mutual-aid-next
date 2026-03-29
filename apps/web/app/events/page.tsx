import { Container, Section } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { EventCard } from "@/components/cards";
import { ClockIcon } from "@/components/icons/category-icons";
import { getAllEvents } from "@/lib/sanity";
import { getSiteConfig, defaults as siteConfigDefaults } from "@/lib/site-config";

export const metadata = {
  title: `${siteConfigDefaults.pages.events.title} | ${siteConfigDefaults.name}`,
  description: siteConfigDefaults.pages.events.description,
};

export default async function EventsPage() {
  const [events, siteConfig] = await Promise.all([
    getAllEvents(),
    getSiteConfig(),
  ]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.startDateTime) >= now
  );
  const pastEvents = events
    .filter((event) => new Date(event.startDateTime) < now)
    .reverse()
    .slice(0, 6);

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              {siteConfig.pages.events.title}
            </h1>
            <p className="mt-3 text-stone-600 text-lg max-w-xl mx-auto">
              {siteConfig.pages.events.description}
            </p>
          </div>
        </Container>
      </Section>

      {/* Upcoming Events */}
      <Section spacing="lg">
        <Container>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            Upcoming Events
          </h2>

          {upcomingEvents.length === 0 ? (
            <EmptyState
              icon={<ClockIcon className="size-12 text-stone-300" />}
              title="No upcoming events"
              description="Check back soon for new community events."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Section spacing="lg" background="muted">
          <Container>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Recent Past Events
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
