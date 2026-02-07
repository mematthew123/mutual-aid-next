import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { getCategoryIcon, LocationIcon } from "@/components/icons/category-icons";
import { getResourceBySlug } from "@/lib/sanity";

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return { title: "Resource Not Found" };
  }

  return {
    title: `${resource.name} | Mutual Aid Network`,
    description: resource.description?.slice(0, 160),
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="default">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/resources" className="hover:text-forest-600">
              Resources
            </Link>
            <span>/</span>
            <span className="text-stone-700">{resource.name}</span>
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
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {resource.isVerified && (
                      <Badge variant="success">Verified</Badge>
                    )}
                    {resource.isFeatured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4">
                    {resource.name}
                  </h1>

                  {/* Categories */}
                  {resource.categories && resource.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {resource.categories.map((category) => {
                        const CategoryIcon = getCategoryIcon(category.slug.current);
                        return (
                          <div
                            key={category._id}
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-sage-100 text-forest-700"
                          >
                            <CategoryIcon className="size-4" />
                            <span>{category.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Description */}
                  {resource.description && (
                    <div className="prose prose-stone max-w-none mb-6">
                      <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  )}

                  {/* Hours */}
                  {resource.hours && (
                    <div className="mb-6">
                      <h2 className="text-sm font-semibold text-stone-700 mb-2">
                        Hours of Operation
                      </h2>
                      <p className="text-stone-600 whitespace-pre-line">
                        {resource.hours}
                      </p>
                    </div>
                  )}

                  {/* Service Area */}
                  {resource.serviceArea && (
                    <div className="mb-6">
                      <h2 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                        <LocationIcon className="size-4" />
                        Service Area
                      </h2>
                      <p className="text-stone-600">{resource.serviceArea}</p>
                    </div>
                  )}

                  {/* Languages */}
                  {resource.languages && resource.languages.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-semibold text-stone-700 mb-2">
                        Languages
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resource.languages.map((lang) => (
                          <Badge key={lang} variant="outline" size="sm">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accessibility */}
                  {resource.accessibility && resource.accessibility.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-stone-700 mb-2">
                        Accessibility
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resource.accessibility.map((feature) => (
                          <Badge key={feature} variant="secondary" size="sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    {resource.contact?.phone && (
                      <div>
                        <p className="text-sm text-stone-500">Phone</p>
                        <a
                          href={`tel:${resource.contact.phone}`}
                          className="text-forest-600 hover:text-forest-700 font-medium"
                        >
                          {resource.contact.phone}
                        </a>
                      </div>
                    )}

                    {resource.contact?.email && (
                      <div>
                        <p className="text-sm text-stone-500">Email</p>
                        <a
                          href={`mailto:${resource.contact.email}`}
                          className="text-forest-600 hover:text-forest-700 font-medium break-all"
                        >
                          {resource.contact.email}
                        </a>
                      </div>
                    )}

                    {resource.contact?.address && (
                      <div>
                        <p className="text-sm text-stone-500">Address</p>
                        <p className="text-stone-700 whitespace-pre-line">
                          {resource.contact.address}
                        </p>
                      </div>
                    )}

                    {resource.contact?.website && (
                      <Button className="w-full" asChild>
                        <a
                          href={resource.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </div>

                  {resource.lastVerified && (
                    <p className="text-xs text-stone-400 mt-6 pt-4 border-t border-stone-100">
                      Last verified:{" "}
                      {new Date(resource.lastVerified).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/resources">&larr; Back to resources</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
