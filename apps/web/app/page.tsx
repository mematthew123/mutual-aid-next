import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { RequestCard, OfferCard } from "@/components/cards";
import { HeartIcon, FoodIcon, TransportIcon, HousingIcon } from "@/components/icons/category-icons";
import { getFeaturedRequests, getFeaturedOffers } from "@/lib/sanity";

const impactStats = [
  { label: "Families Helped", value: "1,247" },
  { label: "Meals Provided", value: "8,500+" },
  { label: "Volunteer Hours", value: "3,200" },
  { label: "Active Volunteers", value: "156" },
];

export default async function HomePage() {
  // Fetch real data from Sanity
  const [requests, offers] = await Promise.all([
    getFeaturedRequests(6),
    getFeaturedOffers(3),
  ]);

  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" background="accent">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm font-medium mb-6">
              <HeartIcon className="size-4" />
              <span>Community Support Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 tracking-tight">
              Neighbors helping
              <span className="text-forest-500"> neighbors</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed">
              Whether you need help or want to offer support, our community is
              here for you. Together, we build a stronger neighborhood.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/request-help">I Need Help</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/offer-help">I Can Help</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">How It Works</h2>
            <p className="mt-4 text-stone-600">
              Getting help or offering support is simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Need",
                description:
                  "Tell us what kind of help you need. Your privacy is always protected.",
                icon: FoodIcon,
              },
              {
                step: "2",
                title: "Get Connected",
                description:
                  "We match you with neighbors who can help. You decide how to connect.",
                icon: TransportIcon,
              },
              {
                step: "3",
                title: "Receive Support",
                description:
                  "Get the help you need from caring community members.",
                icon: HousingIcon,
              },
            ].map((item) => (
              <Card key={item.step} variant="outlined" className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="size-12 rounded-2xl bg-forest-100 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="size-6 text-forest-600" />
                  </div>
                  <Badge variant="success" size="sm" className="mb-3">
                    Step {item.step}
                  </Badge>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Current Needs */}
      <Section spacing="lg" background="muted">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">
                Current Needs
              </h2>
              <p className="mt-2 text-stone-600">
                Neighbors who could use your help right now
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/requests">View all requests →</Link>
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
                  Available Help
                </h2>
                <p className="mt-2 text-stone-600">
                  Neighbors ready to lend a hand
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/offers">View all offers →</Link>
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
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-forest-500">
                  {stat.value}
                </div>
                <div className="mt-2 text-stone-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="accent">
        <Container size="md">
          <Card variant="elevated" className="text-center p-8 lg:p-12">
            <CardContent>
              <HeartIcon className="size-12 text-forest-500 mx-auto mb-6" />
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">
                Ready to make a difference?
              </h2>
              <p className="mt-4 text-stone-600 max-w-lg mx-auto">
                Join our community of neighbors helping neighbors. Every act of
                kindness strengthens our community.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/offer-help">Start Volunteering</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/donate">Donate</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}
