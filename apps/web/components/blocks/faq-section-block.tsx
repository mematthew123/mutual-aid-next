import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { PortableTextRenderer } from "@/components/portable-text";

interface FaqItem {
  _key?: string;
  question: string;
  answer: unknown[];
}

interface FaqSectionBlockProps {
  heading?: string;
  subheading?: string;
  faqs?: FaqItem[];
  showContactCta?: boolean;
  contactCtaText?: string;
}

export function FaqSectionBlock({
  heading,
  subheading,
  faqs,
  showContactCta = true,
  contactCtaText = "Still have questions? We're here to help.",
}: FaqSectionBlockProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl mx-auto">
          {heading && (
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-4 text-center">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-stone-600 text-center mb-8 max-w-xl mx-auto">
              {subheading}
            </p>
          )}

          {faqs && faqs.length > 0 && (
            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {faqs.map((faq) => (
                <details key={faq._key} className="group">
                  <summary className="flex cursor-pointer items-center justify-between py-5 font-semibold text-stone-800 hover:text-forest-600">
                    <span>{faq.question}</span>
                    <span className="ml-4 shrink-0 text-stone-400 group-open:rotate-180 transition-transform">
                      &#9662;
                    </span>
                  </summary>
                  <div className="pb-5">
                    <PortableTextRenderer value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          )}

          {showContactCta && (
            <div className="text-center mt-10">
              <p className="text-stone-600 mb-4">{contactCtaText}</p>
              <Button variant="outline" asChild>
                <Link href="/request-help">Get in Touch</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
