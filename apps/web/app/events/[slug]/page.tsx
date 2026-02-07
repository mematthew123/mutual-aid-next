import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { LocationIcon, ClockIcon } from "@/components/icons/category-icons";
import { getEventBySlug } from "@/lib/sanity";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} | Mutual Aid Network`,
    description: `Join us for ${event.title} on ${new Date(event.startDateTime).toLocaleDateString()}`,
  };
}

const eventTypeLabels: Record<string, string> = {
  distribution: "Distribution",
  volunteer: "Volunteer Day",
  meeting: "Meeting",
  workshop: "Workshop",
  fundraiser: "Fundraiser",
  social: "Social",
  other: "Event",
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startDateTime);
  const endDate = event.endDateTime ? new Date(event.endDateTime) : null;

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime = endDate
    ? endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const isPast = startDate < new Date();
  const locationType = event.location?.type || "inPerson";

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="default">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/events" className="hover:text-forest-600">
              Events
            </Link>
            <span>/</span>
            <span className="text-stone-700">{event.title}</span>
          </nav>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="md">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2">
              <Card variant="elevated">
                <CardContent className="p-6 lg:p-8">
                  {/* Status & Type */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {isPast && (
                      <Badge variant="secondary">Past Event</Badge>
                    )}
                    {event.eventType && (
                      <Badge variant="default">
                        {eventTypeLabels[event.eventType] || "Event"}
                      </Badge>
                    )}
                    {event.isRecurring && (
                      <Badge variant="outline">Recurring</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6">
                    {event.title}
                  </h1>

                  {/* Date & Time */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-forest-50 mb-6">
                    <div className="flex flex-col items-center justify-center size-16 rounded-lg bg-white text-forest-700 shadow-sm">
                      <span className="text-sm font-medium uppercase">
                        {startDate.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-2xl font-bold leading-none">
                        {startDate.getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">{formattedDate}</p>
                      <p className="text-stone-600">
                        {formattedTime}
                        {endTime && ` - ${endTime}`}
                      </p>
                      {event.recurrencePattern && (
                        <p className="text-sm text-forest-600 mt-1">
                          Repeats {event.recurrencePattern}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <LocationIcon className="size-4" />
                      Location
                    </h2>
                    {locationType === "virtual" ? (
                      <p className="text-stone-600">This is a virtual event</p>
                    ) : (
                      <>
                        {event.location?.venue && (
                          <p className="font-medium text-stone-800">
                            {event.location.venue}
                          </p>
                        )}
                        {event.location?.address && (
                          <p className="text-stone-600 whitespace-pre-line">
                            {event.location.address}
                          </p>
                        )}
                      </>
                    )}
                    {event.location?.accessibilityInfo && (
                      <p className="text-sm text-stone-500 mt-2">
                        {event.location.accessibilityInfo}
                      </p>
                    )}
                  </div>

                  {/* Description placeholder - would need Portable Text renderer */}
                  {event.description && (
                    <div className="prose prose-stone max-w-none">
                      <h2 className="text-lg font-semibold text-stone-800 mb-3">
                        About This Event
                      </h2>
                      <p className="text-stone-600">
                        Event details are available. Contact us for more information.
                      </p>
                    </div>
                  )}

                  {/* Volunteers Needed */}
                  {event.volunteersNeeded && event.volunteersNeeded > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="font-semibold text-amber-800">
                        Volunteers Needed: {event.volunteersNeeded}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        We&apos;re looking for volunteers to help with this event.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24">
                <CardContent className="p-6">
                  {isPast ? (
                    <>
                      <p className="text-stone-600 mb-4">
                        This event has already taken place.
                      </p>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href="/events">View Upcoming Events</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      {event.registration?.required ? (
                        <>
                          <h2 className="text-lg font-semibold text-stone-800 mb-2">
                            Registration Required
                          </h2>
                          {event.registration.deadline && (
                            <p className="text-sm text-stone-500 mb-4">
                              Register by{" "}
                              {new Date(event.registration.deadline).toLocaleDateString()}
                            </p>
                          )}
                          {event.registration.capacity && (
                            <p className="text-sm text-stone-500 mb-4">
                              Limited to {event.registration.capacity} attendees
                            </p>
                          )}
                          {event.registration.link ? (
                            <Button className="w-full" size="lg" asChild>
                              <a
                                href={event.registration.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Register Now
                              </a>
                            </Button>
                          ) : (
                            <Button className="w-full" size="lg">
                              Contact to Register
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <h2 className="text-lg font-semibold text-stone-800 mb-2">
                            Open to All
                          </h2>
                          <p className="text-stone-600 text-sm mb-4">
                            No registration required. Just show up!
                          </p>
                          <Button variant="secondary" className="w-full" size="lg">
                            Add to Calendar
                          </Button>
                        </>
                      )}

                      {locationType !== "inPerson" && event.location?.virtualLink && (
                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <Button variant="outline" className="w-full" asChild>
                            <a
                              href={event.location.virtualLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Join Virtual Event
                            </a>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/events">&larr; Back to all events</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
