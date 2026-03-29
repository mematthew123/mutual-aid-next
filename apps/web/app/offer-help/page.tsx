import { Container, Section } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { getCategories, getUniqueNeighborhoods } from "@/lib/sanity";
import { getSiteConfig, defaults as siteConfigDefaults } from "@/lib/site-config";
import { OfferHelpForm } from "./offer-help-form";

export const metadata = {
  title: `${siteConfigDefaults.pages.offerHelp.title} | ${siteConfigDefaults.name}`,
  description: `Share your skills, time, or resources with ${siteConfigDefaults.terms.members} who need support.`,
};

export default async function OfferHelpPage() {
  const [categories, neighborhoods, siteConfig] = await Promise.all([
    getCategories(),
    getUniqueNeighborhoods(),
    getSiteConfig(),
  ]);

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              {siteConfig.pages.offerHelp.title}
            </h1>
            <p className="mt-3 text-stone-600 text-lg max-w-xl mx-auto">
              {siteConfig.pages.offerHelp.description}
            </p>
          </div>
        </Container>
      </Section>

      {/* Form Section */}
      <Section spacing="lg">
        <Container size="md">
          <Card variant="elevated" className="p-6 lg:p-8">
            <CardContent className="p-0">
              <OfferHelpForm
                categories={categories}
                neighborhoods={neighborhoods}
              />
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}
