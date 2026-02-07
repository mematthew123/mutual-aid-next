import { Container, Section } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { CampaignCard } from "@/components/cards";
import { HeartIcon } from "@/components/icons/category-icons";
import { getActiveCampaigns } from "@/lib/sanity";

export const metadata = {
  title: "Donate | Mutual Aid Network",
  description: "Support your community through donations to our active campaigns and general fund.",
};

export default async function DonatePage() {
  const campaigns = await getActiveCampaigns();

  const featuredCampaigns = campaigns.filter((c) => c.isFeatured);
  const otherCampaigns = campaigns.filter((c) => !c.isFeatured);

  return (
    <>
      {/* Page Header */}
      <Section spacing="md" background="accent">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
              Support Your Community
            </h1>
            <p className="mt-3 text-stone-600 text-lg max-w-xl mx-auto">
              Your donations help us provide direct support to neighbors in need.
              Every contribution makes a difference.
            </p>
          </div>
        </Container>
      </Section>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <Section spacing="lg">
          <Container>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Featured Campaigns
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* All Campaigns */}
      <Section spacing="lg" background={featuredCampaigns.length > 0 ? "muted" : "default"}>
        <Container>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            {featuredCampaigns.length > 0 ? "All Campaigns" : "Active Campaigns"}
          </h2>

          {otherCampaigns.length === 0 && featuredCampaigns.length === 0 ? (
            <EmptyState
              icon={<HeartIcon className="size-12 text-stone-300" />}
              title="No active campaigns"
              description="Check back soon for opportunities to support your community."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Other Ways to Help */}
      <Section spacing="lg">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Other Ways to Help
            </h2>
            <p className="text-stone-600 mb-6">
              Can&apos;t donate right now? There are other ways to support your community.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <a
                href="/offer-help"
                className="p-4 rounded-xl bg-forest-50 text-forest-700 font-medium hover:bg-forest-100 transition-colors"
              >
                Volunteer Your Time
              </a>
              <a
                href="/resources"
                className="p-4 rounded-xl bg-sage-50 text-sage-700 font-medium hover:bg-sage-100 transition-colors"
              >
                Share Resources
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
