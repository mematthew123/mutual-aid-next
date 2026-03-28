import { Container, Section } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";

interface StatItem {
  _key?: string;
  value: string;
  label: string;
  description?: string;
}

interface StatsSectionBlockProps {
  heading?: string;
  stats?: StatItem[];
  style?: "highlight" | "subtle" | "bordered";
}

export function StatsSectionBlock({
  heading,
  stats,
  style = "highlight",
}: StatsSectionBlockProps) {
  if (!stats?.length) return null;

  const isHighlight = style === "highlight";

  return (
    <Section spacing="lg">
      <Container>
        <div
          className={`rounded-2xl px-8 py-12 ${
            style === "highlight"
              ? "bg-forest-500"
              : style === "subtle"
                ? "bg-sage-50"
                : ""
          }`}
        >
          {heading && (
            <h2
              className={`text-2xl lg:text-3xl font-bold text-center mb-10 ${
                isHighlight ? "text-white" : "text-stone-800"
              }`}
            >
              {heading}
            </h2>
          )}

          {style === "bordered" ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat._key}>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-forest-600 mb-1">
                      {stat.value}
                    </p>
                    <p className="font-medium text-stone-700">{stat.label}</p>
                    {stat.description && (
                      <p className="text-sm text-stone-500 mt-1">
                        {stat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat._key} className="text-center">
                  <p
                    className={`text-3xl lg:text-4xl font-bold mb-1 ${
                      isHighlight ? "text-white" : "text-forest-600"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`font-medium ${
                      isHighlight ? "text-white/80" : "text-stone-700"
                    }`}
                  >
                    {stat.label}
                  </p>
                  {stat.description && (
                    <p
                      className={`text-sm mt-1 ${
                        isHighlight ? "text-white/60" : "text-stone-500"
                      }`}
                    >
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
