import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Card, CardContent } from "@/components/ui";
import { RequestCard, OfferCard } from "@/components/cards";
import { HeartIcon } from "@/components/icons/category-icons";
import { getFeaturedRequests, getFeaturedOffers } from "@/lib/sanity";
import { getSiteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const [requests, offers, siteConfig] = await Promise.all([
    getFeaturedRequests(6),
    getFeaturedOffers(3),
    getSiteConfig(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" background="accent">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm font-medium mb-6">
              <HeartIcon className="size-4" />
              <span>{siteConfig.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 tracking-tight">
              {siteConfig.hero.heading}
              <span className="text-forest-500"> {siteConfig.hero.headingAccent}</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed">
              {siteConfig.hero.description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/request-help">{siteConfig.hero.ctaPrimary}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/offer-help">{siteConfig.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h2 className="mx-auto max-w-[40ch] text-3xl font-semibold tracking-tight text-balance text-stone-800">
              {siteConfig.howItWorks.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-pretty text-stone-600">
              {siteConfig.howItWorks.description}
            </p>
          </div>

          <dl className="grid md:grid-cols-3 gap-8">
            {siteConfig.howItWorks.steps.map((item, index) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto text-5xl font-semibold tabular-nums text-forest-500">
                  {index + 1}
                </div>
                <dt className="mt-4 text-lg font-semibold text-stone-800">
                  {item.title}
                </dt>
                <dd className="mt-2 text-stone-600 text-pretty">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Current Needs */}
      <Section spacing="lg" background="muted">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">
                {siteConfig.pages.requests.title}
              </h2>
              <p className="mt-2 text-stone-600">
                {siteConfig.pages.requests.description}
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/requests">View all requests &rarr;</Link>
            </Button>
          </div>

          {requests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))}
            </div>
          ) : (
            <Card variant="outlined" className="text-center py-12">
              <CardContent>
                <HeartIcon className="size-12 text-stone-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-600 mb-2">
                  No open requests right now
                </h3>
                <p className="text-stone-500 mb-6">
                  Check back soon or browse available offers
                </p>
                <Button variant="secondary" asChild>
                  <Link href="/offers">Browse Offers</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
      </Section>

      {/* Available Help */}
      {offers.length > 0 && (
        <Section spacing="lg">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">
                  {siteConfig.pages.offers.title}
                </h2>
                <p className="mt-2 text-stone-600">
                  {siteConfig.pages.offers.description}
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/offers">View all offers &rarr;</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer._id} offer={offer} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Impact Stats */}
      <Section spacing="lg" background={offers.length > 0 ? "muted" : "default"}>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">
              Community Impact
            </h2>
            <p className="mt-4 text-stone-600">
              Together, we&apos;re making a difference
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.impactStats.map((stat, index) => {
              const colors = [
                "text-forest-500",
                "text-terracotta-500",
                "text-wheat-500",
                "text-sage-500",
              ];
              return (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl lg:text-5xl font-bold ${colors[index % colors.length]}`}>
                    {stat.value}
                  </div>
                  <div className="mt-2 text-stone-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="accent">
        <Container size="md">
          <Card variant="elevated" className="text-center p-8 lg:p-12">
            <CardContent>
              <HeartIcon className="size-6 text-terracotta-500 mx-auto mb-6" />
              <h2 className="mx-auto max-w-[40ch] text-2xl lg:text-3xl font-semibold tracking-tight text-balance text-stone-800">
                {siteConfig.cta.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-[56ch] text-pretty text-stone-600">
                {siteConfig.cta.description}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/offer-help">{siteConfig.cta.primaryAction}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/donate">{siteConfig.cta.secondaryAction}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}
