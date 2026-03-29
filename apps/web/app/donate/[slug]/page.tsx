import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { PortableTextRenderer } from "@/components/portable-text";
import { resolveImageUrl } from "@/lib/sanity/image";
import { getCampaignBySlug } from "@/lib/sanity";
import { getSiteConfig } from "@/lib/site-config";

interface CampaignDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CampaignDetailPageProps) {
  const { slug } = await params;
  const [campaign, siteConfig] = await Promise.all([
    getCampaignBySlug(slug),
    getSiteConfig(),
  ]);

  if (!campaign) {
    return { title: "Campaign Not Found" };
  }

  return {
    title: `${campaign.title} | ${siteConfig.name}`,
    description: `Support ${campaign.title} — donate to help our community.`,
  };
}

const campaignTypeLabels: Record<string, string> = {
  general: "General Fund",
  emergency: "Emergency",
  specific: "Specific Cause",
  recurring: "Monthly",
};

const platformLabels: Record<string, string> = {
  venmo: "Venmo",
  cashapp: "Cash App",
  paypal: "PayPal",
  gofundme: "GoFundMe",
};

function getPlatformUrl(platform: string, value: string): string {
  if (platform === "venmo") return `https://venmo.com/${value.replace(/^@/, "")}`;
  if (platform === "cashapp") return `https://cash.app/${value.replace(/^\$/, "$")}`;
  return value;
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const goal = campaign.goal?.amount || 0;
  const current = campaign.goal?.currentAmount || 0;
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const showProgress = campaign.goal?.showProgress && campaign.goal?.hasGoal;
  const imageUrl = resolveImageUrl(campaign.image as Record<string, unknown>);

  const donationLinks = campaign.donationLinks || {};
  const platforms = (
    ["venmo", "cashapp", "paypal", "gofundme"] as const
  ).filter((p) => donationLinks[p]);

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="default">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/donate" className="hover:text-forest-600">
              Donate
            </Link>
            <span>/</span>
            <span className="text-stone-700">{campaign.title}</span>
          </nav>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="md">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <Card variant="elevated">
                <CardContent className="p-6 lg:p-8">
                  {/* Status & Type */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {campaign.campaignType && (
                      <Badge
                        variant={
                          campaign.campaignType === "emergency"
                            ? "urgent"
                            : "secondary"
                        }
                      >
                        {campaignTypeLabels[campaign.campaignType] || "Campaign"}
                      </Badge>
                    )}
                    {campaign.status === "goalReached" && (
                      <Badge variant="success">Goal Reached!</Badge>
                    )}
                    {campaign.status === "ended" && (
                      <Badge variant="secondary">Ended</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6">
                    {campaign.title}
                  </h1>

                  {/* Image */}
                  {imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-6">
                      <img
                        src={imageUrl}
                        alt={campaign.image?.alt || campaign.title}
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Progress Bar */}
                  {showProgress && (
                    <div className="mb-6 p-4 rounded-xl bg-wheat-50">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-wheat-700 text-lg">
                          ${current.toLocaleString()}
                        </span>
                        <span className="text-stone-500">
                          of ${goal.toLocaleString()} goal
                        </span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-wheat-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-stone-500 mt-2">
                        {Math.round(progress)}% funded
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {campaign.description &&
                    Array.isArray(campaign.description) &&
                    campaign.description.length > 0 && (
                      <div className="mb-6">
                        <PortableTextRenderer value={campaign.description} />
                      </div>
                    )}

                  {/* Timeline */}
                  {(campaign.timeline?.startDate ||
                    campaign.timeline?.endDate) && (
                    <div className="mb-6 p-4 rounded-xl bg-stone-50">
                      <h2 className="text-sm font-semibold text-stone-700 mb-2">
                        Campaign Timeline
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                        {campaign.timeline.startDate && (
                          <p>
                            Started:{" "}
                            {new Date(
                              campaign.timeline.startDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {campaign.timeline.isOngoing ? (
                          <p className="text-forest-600 font-medium">
                            Ongoing campaign
                          </p>
                        ) : (
                          campaign.timeline.endDate && (
                            <p>
                              Ends:{" "}
                              {new Date(
                                campaign.timeline.endDate
                              ).toLocaleDateString()}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* In-kind Donations */}
                  {campaign.acceptsInKind && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <h2 className="text-sm font-semibold text-amber-800 mb-2">
                        In-Kind Donations Accepted
                      </h2>
                      {campaign.inKindNeeds &&
                        campaign.inKindNeeds.length > 0 && (
                          <ul className="list-disc pl-5 text-sm text-amber-700 flex flex-col gap-1">
                            {campaign.inKindNeeds.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      {campaign.dropOffInfo && (
                        <p className="text-sm text-amber-700 mt-3">
                          <span className="font-medium">Drop-off info:</span>{" "}
                          {campaign.dropOffInfo}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Campaign Updates */}
                  {campaign.updates && campaign.updates.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold text-stone-800 mb-4">
                        Campaign Updates
                      </h2>
                      <div className="border-l-2 border-forest-200 pl-6 flex flex-col gap-6">
                        {campaign.updates.map((update, i) => (
                          <div key={i}>
                            {update.date && (
                              <p className="text-xs text-stone-400 mb-1">
                                {new Date(update.date).toLocaleDateString()}
                              </p>
                            )}
                            {update.title && (
                              <p className="font-semibold text-stone-800 mb-2">
                                {update.title}
                              </p>
                            )}
                            {update.content &&
                              Array.isArray(update.content) &&
                              update.content.length > 0 && (
                                <PortableTextRenderer value={update.content} />
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">
                    Support This Campaign
                  </h2>

                  {/* Suggested Amounts */}
                  {campaign.donationOptions &&
                    campaign.donationOptions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-stone-500 mb-2">
                          Suggested amounts
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {campaign.donationOptions.map((option, i) => (
                            <div
                              key={i}
                              className="text-center py-2 px-3 rounded-lg bg-wheat-50 text-wheat-700 text-sm font-medium"
                            >
                              {option.label || `$${option.amount}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Donation Links */}
                  {platforms.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {platforms.map((platform) => (
                        <Button key={platform} className="w-full" asChild>
                          <a
                            href={getPlatformUrl(
                              platform,
                              donationLinks[platform]!
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Donate via {platformLabels[platform]}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Other link */}
                  {donationLinks.other && (
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                      asChild
                    >
                      <a
                        href={donationLinks.other}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {donationLinks.otherLabel || "Donate"}
                      </a>
                    </Button>
                  )}

                  {platforms.length === 0 && !donationLinks.other && (
                    <p className="text-sm text-stone-500">
                      Contact us for donation information.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Back Link */}
              <div className="mt-6">
                <Button variant="ghost" asChild>
                  <Link href="/donate">&larr; Back to campaigns</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
