import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { getCategoryIcon, LocationIcon, ClockIcon, HeartIcon } from "@/components/icons/category-icons";
import { getOfferById } from "@/lib/sanity";

interface OfferDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OfferDetailPageProps) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    return { title: "Offer Not Found" };
  }

  return {
    title: `${offer.title} | Mutual Aid Network`,
    description: offer.description?.slice(0, 160),
  };
}

const offerTypeLabels = {
  oneTime: "One-time help",
  recurring: "Recurring availability",
  ongoing: "Ongoing support",
};

const travelLabels = {
  canTravel: "Can travel to you",
  limited: "Limited travel radius",
  stationary: "Pickup only",
};

const dayLabels = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    notFound();
  }

  const createdAt = new Date(offer._createdAt);
  const timeAgo = getTimeAgo(createdAt);

  const availableDays = offer.availability
    ? Object.entries(offer.availability)
        .filter(([, isAvailable]) => isAvailable)
        .map(([day]) => dayLabels[day as keyof typeof dayLabels])
    : [];

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="default">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/offers" className="hover:text-forest-600">
              Available Help
            </Link>
            <span>/</span>
            <span className="text-stone-700">{offer.title}</span>
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
                  {/* Header */}
                  <div className="flex items-center gap-2 text-forest-600 mb-4">
                    <HeartIcon className="size-5 fill-forest-100" />
                    <span className="font-medium">Offering Help</span>
                    {offer.offerType && (
                      <Badge variant="success" className="ml-2">
                        {offerTypeLabels[offer.offerType]}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4">
                    {offer.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-6">
                    {offer.neighborhood && (
                      <div className="flex items-center gap-1.5">
                        <LocationIcon className="size-4" />
                        <span>{offer.neighborhood}</span>
                      </div>
                    )}
                    {offer.travelRadius && (
                      <span className="text-stone-400">
                        {travelLabels[offer.travelRadius]}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="size-4" />
                      <span>Posted {timeAgo}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  {offer.categories && offer.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {offer.categories.map((category) => {
                        const CategoryIcon = getCategoryIcon(category.slug.current);
                        return (
                          <div
                            key={category._id}
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-mint-100 text-forest-700"
                          >
                            <CategoryIcon className="size-4" />
                            <span>{category.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Description */}
                  <div className="prose prose-stone max-w-none">
                    <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Availability */}
                  {availableDays.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-stone-100">
                      <h2 className="text-sm font-semibold text-stone-700 mb-3">
                        Typically Available
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {availableDays.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 rounded-full bg-sage-100 text-forest-700 text-sm"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">
                    Need this help?
                  </h2>
                  <p className="text-stone-600 text-sm mb-6">
                    Reach out to connect with this volunteer. A coordinator may
                    help facilitate the connection.
                  </p>

                  <Button className="w-full" size="lg">
                    Request This Help
                  </Button>

                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-sm text-stone-500 mb-4">
                      Or submit your own request:
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/request-help">Submit a Request</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/offers">&larr; Back to available help</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  }
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }
  if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
  return date.toLocaleDateString();
}
