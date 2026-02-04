import { Container, Section } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { getCategories, getUniqueNeighborhoods } from "@/lib/sanity";
import { RequestHelpForm } from "./request-help-form";

export const metadata = {
  title: "Request Help | Mutual Aid Network",
  description: "Submit a request for help from your community. Our neighbors are here to support you.",
};

export default async function RequestHelpPage() {
  const [categories, neighborhoods] = await Promise.all([
    getCategories(),
    getUniqueNeighborhoods(),
  ]);

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              Request Help
            </h1>
            <p className="mt-3 text-stone-600 text-lg max-w-xl mx-auto">
              Let us know what you need. Our community is here to support you,
              and your privacy is always protected.
            </p>
          </div>
        </Container>
      </Section>

      {/* Form Section */}
      <Section spacing="lg">
        <Container size="md">
          <Card variant="elevated" className="p-6 lg:p-8">
            <CardContent className="p-0">
              <RequestHelpForm
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
