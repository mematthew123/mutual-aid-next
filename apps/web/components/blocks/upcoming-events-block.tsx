import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { EventCard } from "@/components/cards";
import { getUpcomingEvents } from "@/lib/sanity";
import type { Event } from "@/lib/sanity/types";

interface UpcomingEventsBlockProps {
  heading?: string;
  subheading?: string;
  displayType?: "automatic" | "manual" | "byType";
  events?: Event[];
  eventType?: string;
  limit?: number;
  showViewAll?: boolean;
  layout?: "cards" | "list" | "calendar";
}

export async function UpcomingEventsBlock({
  heading,
  subheading,
  displayType = "automatic",
  events: manualEvents,
  limit = 3,
  showViewAll = true,
  layout = "cards",
}: UpcomingEventsBlockProps) {
  let events: Event[];

  if (displayType === "manual" && manualEvents?.length) {
    events = manualEvents.slice(0, limit);
  } else {
    events = await getUpcomingEvents(limit);
  }

  if (!events.length) return null;

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

        {layout === "list" ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {showViewAll && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
