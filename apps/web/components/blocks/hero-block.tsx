import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { resolveImageUrl } from "@/lib/sanity/image";

interface HeroCta {
  _key?: string;
  label?: string;
  linkType?: "internal" | "external";
  internalLink?: { slug?: string };
  externalUrl?: string;
  style?: "primary" | "secondary" | "outline";
}

interface HeroBlockProps {
  heading: string;
  subheading?: string;
  image?: Record<string, unknown>;
  ctas?: HeroCta[];
  overlay?: boolean;
}

const styleToVariant: Record<string, "primary" | "secondary" | "outline"> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
};

export function HeroBlock({
  heading,
  subheading,
  image,
  ctas,
  overlay = true,
}: HeroBlockProps) {
  const bgUrl = resolveImageUrl(image);

  return (
    <Section spacing="xl" background="accent" className="relative overflow-hidden">
      {bgUrl && (
        <>
          <img
            src={bgUrl}
            alt={(image?.alt as string) || ""}
            className="absolute inset-0 size-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-stone-900/60" />
          )}
        </>
      )}
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              bgUrl ? "text-white" : "text-stone-800"
            }`}
          >
            {heading}
          </h1>
          {subheading && (
            <p
              className={`text-lg sm:text-xl mb-8 ${
                bgUrl ? "text-white/90" : "text-stone-600"
              }`}
            >
              {subheading}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {ctas.map((cta) => {
                const href =
                  cta.linkType === "external"
                    ? cta.externalUrl
                    : cta.internalLink?.slug
                      ? `/${cta.internalLink.slug}`
                      : "#";

                if (!href || href === "#") {
                  return (
                    <Button
                      key={cta._key}
                      variant={styleToVariant[cta.style || "primary"]}
                      size="lg"
                    >
                      {cta.label}
                    </Button>
                  );
                }

                const isExternal = cta.linkType === "external";
                return (
                  <Button
                    key={cta._key}
                    variant={styleToVariant[cta.style || "primary"]}
                    size="lg"
                    asChild
                  >
                    {isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {cta.label}
                      </a>
                    ) : (
                      <Link href={href}>{cta.label}</Link>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
