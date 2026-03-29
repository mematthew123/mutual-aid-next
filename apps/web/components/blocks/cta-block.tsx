import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";

interface CtaBlockProps {
  heading: string;
  text?: string;
  buttonLabel: string;
  linkType?: "internal" | "external" | "requestForm" | "offerForm" | "donate";
  internalLink?: { slug?: string };
  externalUrl?: string;
  donationCampaign?: { slug?: string };
  style?: "highlight" | "subtle" | "bordered";
}

const linkTypeToHref: Record<string, string> = {
  requestForm: "/request-help",
  offerForm: "/offer-help",
  donate: "/donate",
};

export function CtaBlock({
  heading,
  text,
  buttonLabel,
  linkType = "internal",
  internalLink,
  externalUrl,
  donationCampaign,
  style = "highlight",
}: CtaBlockProps) {
  let href: string;
  if (linkType === "external") {
    href = externalUrl || "#";
  } else if (linkType === "internal") {
    href = internalLink?.slug ? `/${internalLink.slug}` : "#";
  } else if (linkType === "donate" && donationCampaign?.slug) {
    href = `/donate/${donationCampaign.slug}`;
  } else {
    href = linkTypeToHref[linkType] || "#";
  }

  const isExternal = linkType === "external";
  const isHighlight = style === "highlight";

  return (
    <Section spacing="lg">
      <Container>
        <div
          className={`rounded-2xl px-8 py-12 text-center ${
            style === "highlight"
              ? "bg-forest-500"
              : style === "subtle"
                ? "bg-sage-50"
                : "border-2 border-forest-200"
          }`}
        >
          <h2
            className={`text-2xl lg:text-3xl font-bold mb-4 ${
              isHighlight ? "text-white" : "text-stone-800"
            }`}
          >
            {heading}
          </h2>
          {text && (
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                isHighlight ? "text-white/90" : "text-stone-600"
              }`}
            >
              {text}
            </p>
          )}
          <Button
            variant={isHighlight ? "secondary" : "primary"}
            size="lg"
            asChild
          >
            {isExternal ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {buttonLabel}
              </a>
            ) : (
              <Link href={href}>{buttonLabel}</Link>
            )}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
