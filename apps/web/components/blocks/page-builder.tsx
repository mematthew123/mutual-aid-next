import { HeroBlock } from "./hero-block";
import { TextSectionBlock } from "./text-section-block";
import { CtaBlock } from "./cta-block";
import { FeaturedResourcesBlock } from "./featured-resources-block";
import { UpcomingEventsBlock } from "./upcoming-events-block";
import { FaqSectionBlock } from "./faq-section-block";
import { TeamSectionBlock } from "./team-section-block";
import { StatsSectionBlock } from "./stats-section-block";

interface Block {
  _key?: string;
  _type: string;
  [key: string]: unknown;
}

interface PageBuilderProps {
  blocks: unknown[];
}

export async function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {(blocks as Block[]).map((block) => {
        const key = block._key || Math.random().toString();

        switch (block._type) {
          case "hero":
            return <HeroBlock key={key} {...(block as any)} />;
          case "textSection":
            return <TextSectionBlock key={key} {...(block as any)} />;
          case "callToAction":
            return <CtaBlock key={key} {...(block as any)} />;
          case "featuredResources":
            return <FeaturedResourcesBlock key={key} {...(block as any)} />;
          case "upcomingEvents":
            return <UpcomingEventsBlock key={key} {...(block as any)} />;
          case "faqSection":
            return <FaqSectionBlock key={key} {...(block as any)} />;
          case "teamSection":
            return <TeamSectionBlock key={key} {...(block as any)} />;
          case "statsSection":
            return <StatsSectionBlock key={key} {...(block as any)} />;
          default:
            return null;
        }
      })}
    </>
  );
}
