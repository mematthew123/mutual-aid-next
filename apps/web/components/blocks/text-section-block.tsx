import { Container, Section } from "@/components/layout";
import { PortableTextRenderer } from "@/components/portable-text";

interface TextSectionBlockProps {
  heading?: string;
  content?: unknown[];
  alignment?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide" | "full";
}

const maxWidthClasses: Record<string, string> = {
  narrow: "max-w-xl",
  medium: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

export function TextSectionBlock({
  heading,
  content,
  alignment = "left",
  maxWidth = "medium",
}: TextSectionBlockProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div
          className={`mx-auto ${maxWidthClasses[maxWidth] || "max-w-3xl"} ${
            alignment === "center" ? "text-center" : "text-left"
          }`}
        >
          {heading && (
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6">
              {heading}
            </h2>
          )}
          {content && <PortableTextRenderer value={content} />}
        </div>
      </Container>
    </Section>
  );
}
