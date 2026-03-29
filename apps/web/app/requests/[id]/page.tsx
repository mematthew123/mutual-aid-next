import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Badge, UrgencyBadge, Card, CardContent } from "@/components/ui";
import { getCategoryIcon, LocationIcon, ClockIcon } from "@/components/icons/category-icons";
import { getRequestById } from "@/lib/sanity";
import { getSiteConfig } from "@/lib/site-config";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RequestDetailPageProps) {
  const { id } = await params;
  const [request, siteConfig] = await Promise.all([
    getRequestById(id),
    getSiteConfig(),
  ]);

  if (!request) {
    return { title: "Request Not Found" };
  }

  return {
    title: `${request.title} | ${siteConfig.name}`,
    description: request.description?.slice(0, 160),
  };
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params;
  const [request, siteConfig] = await Promise.all([
    getRequestById(id),
    getSiteConfig(),
  ]);

  if (!request) {
    notFound();
  }

  const CategoryIcon = request.category
    ? getCategoryIcon(request.category.slug.current)
    : null;

  const createdAt = new Date(request._createdAt);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="default">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/requests" className="hover:text-forest-600">
              Requests
            </Link>
            <span>/</span>
            <span className="text-stone-700">{request.title}</span>
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
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <UrgencyBadge urgency={request.urgency} />
                    {request.category && (
                      <Badge variant="default">
                        {CategoryIcon && <CategoryIcon className="size-3.5 mr-1" />}
                        {request.category.title}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4">
                    {request.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-6">
                    {request.neighborhood && (
                      <div className="flex items-center gap-1.5">
                        <LocationIcon className="size-4" />
                        <span>{request.neighborhood}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="size-4" />
                      <span>Posted {timeAgo}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-stone max-w-none">
                    <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                      {request.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">
                    Want to help?
                  </h2>
                  <p className="text-stone-600 text-sm mb-6">
                    {request.contactPreference === "throughCoordinator"
                      ? `An ${siteConfig.terms.organizer} will facilitate the connection to protect everyone's privacy.`
                      : request.contactPreference === "anonymous"
                      ? "This person would like to remain anonymous."
                      : "You can reach out directly to this person."}
                  </p>

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/offer-help">I Can Help</Link>
                  </Button>

                  <p className="text-xs text-stone-400 text-center mt-4">
                    By responding, you agree to our community guidelines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/requests">&larr; Back to all requests</Link>
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
