import { getSettings } from "@/lib/sanity/queries";
import type { SiteConfig } from "./site-config-types";

export type { SiteConfig } from "./site-config-types";

// =============================================================================
// Static Defaults
// These serve as fallbacks when the CMS has no value set. They also ensure
// the site works out of the box before any Sanity content is created.
// =============================================================================

export const defaults = {
  name: "Mutual Aid Network",
  shortName: "Mutual Aid",
  tagline: "Community members helping each other. Together, we thrive.",
  description:
    "A community platform for sharing resources, requesting help, offering assistance, and organizing events.",
  footerNote: "Built with love for your community",

  terms: {
    member: "community member",
    members: "community members",
    organizer: "organizer",
    organizers: "organizers",
    helper: "volunteer",
    helpers: "volunteers",
    helping: "volunteering",
  },

  hero: {
    badge: "Community Support Network",
    heading: "Community members helping",
    headingAccent: "each other",
    description:
      "Whether you need help or want to offer support, our community is here for you. Together, we build something stronger.",
    ctaPrimary: "I Need Help",
    ctaSecondary: "I Can Help",
  },

  howItWorks: {
    heading: "How It Works",
    description: "Getting help or offering support is simple",
    steps: [
      {
        title: "Share Your Need",
        description:
          "Tell us what kind of help you need. Your privacy is always protected.",
      },
      {
        title: "Get Connected",
        description:
          "We match you with people who can help. You decide how to connect.",
      },
      {
        title: "Receive Support",
        description:
          "Get the help you need from caring community members.",
      },
    ],
  },

  impactStats: [
    { label: "People Helped", value: "1,247" },
    { label: "Meals Provided", value: "8,500+" },
    { label: "Volunteer Hours", value: "3,200" },
    { label: "Active Volunteers", value: "156" },
  ],

  cta: {
    heading: "Ready to make a difference?",
    description:
      "Join our community of people helping people. Every act of kindness strengthens us all.",
    primaryAction: "Start Helping",
    secondaryAction: "Donate",
  },

  nav: {
    items: [
      { name: "Get Help", href: "/requests" },
      { name: "Offer Help", href: "/offers" },
      { name: "Events", href: "/events" },
      { name: "Resources", href: "/resources" },
    ],
  },

  footer: {
    sections: [
      {
        title: "Get Help",
        links: [
          { name: "Submit a Request", href: "/request-help" },
          { name: "Browse Offers", href: "/offers" },
          { name: "Resource Directory", href: "/resources" },
        ],
      },
      {
        title: "Get Involved",
        links: [
          { name: "Offer Help", href: "/offer-help" },
          { name: "View Requests", href: "/requests" },
          { name: "Upcoming Events", href: "/events" },
          { name: "Donate", href: "/donate" },
        ],
      },
      {
        title: "About",
        links: [
          { name: "Our Mission", href: "/about" },
          { name: "Contact Us", href: "/contact" },
        ],
      },
    ],
  },

  pages: {
    requests: {
      title: "Current Requests",
      description: "People in our community who could use your help right now",
      emptyTitle: "No requests match your filters",
      emptyDescription:
        "Try adjusting your filters or check back soon for new requests.",
      ctaTitle: "Need help yourself?",
      ctaDescription:
        "Don't hesitate to reach out. Our community is here to support you.",
    },
    offers: {
      title: "Available Help",
      description: "Community members ready to lend a hand",
      emptyTitle: "No offers match your filters",
      emptyDescription:
        "Try adjusting your filters or check back soon for new offers.",
      ctaTitle: "Want to help your community?",
      ctaDescription:
        "Share your skills, time, or resources with those who need them most.",
    },
    requestHelp: {
      title: "Request Help",
      description:
        "Let us know what you need. Our community is here to support you, and your privacy is always protected.",
    },
    offerHelp: {
      title: "Offer Help",
      description:
        "Share your skills, time, or resources with your community. Every act of kindness makes a difference.",
    },
    events: {
      title: "Community Events",
      description:
        "Join us at distributions, volunteer days, workshops, and community gatherings.",
    },
    resources: {
      title: "Community Resources",
      description:
        "Local organizations, services, and resources to support you and your community.",
    },
    donate: {
      title: "Support Your Community",
      description:
        "Your donations help us provide direct support to people in need. Every contribution makes a difference.",
    },
  },
} as const satisfies SiteConfig;

// =============================================================================
// getSiteConfig() — fetches CMS settings and merges over static defaults
// Use in server components. Cached per-request by Next.js fetch deduplication.
// =============================================================================

export async function getSiteConfig(): Promise<SiteConfig> {
  const settings = await getSettings();

  // No CMS settings at all — return defaults as-is
  if (!settings) {
    return defaults;
  }

  return {
    ...defaults,

    // Branding — CMS wins if set
    name: settings.title || defaults.name,
    shortName: settings.shortName || defaults.shortName,
    tagline: settings.tagline || defaults.tagline,
    description: settings.description || defaults.description,
    footerNote: settings.footerNote || defaults.footerNote,

    // Terminology — merge field-by-field so partial CMS overrides work
    terms: {
      member: settings.terminology?.member || defaults.terms.member,
      members: settings.terminology?.members || defaults.terms.members,
      organizer: settings.terminology?.organizer || defaults.terms.organizer,
      organizers: settings.terminology?.organizers || defaults.terms.organizers,
      helper: settings.terminology?.helper || defaults.terms.helper,
      helpers: settings.terminology?.helpers || defaults.terms.helpers,
      helping: settings.terminology?.helping || defaults.terms.helping,
    },

    // Hero
    hero: {
      badge: settings.hero?.badge || defaults.hero.badge,
      heading: settings.hero?.heading || defaults.hero.heading,
      headingAccent: settings.hero?.headingAccent || defaults.hero.headingAccent,
      description: settings.hero?.description || defaults.hero.description,
      ctaPrimary: settings.hero?.ctaPrimary || defaults.hero.ctaPrimary,
      ctaSecondary: settings.hero?.ctaSecondary || defaults.hero.ctaSecondary,
    },

    // Impact stats — use CMS array if it has entries, otherwise defaults
    impactStats:
      settings.impactStats && settings.impactStats.length > 0
        ? settings.impactStats
        : defaults.impactStats,

    // CTA
    cta: {
      heading: settings.cta?.heading || defaults.cta.heading,
      description: settings.cta?.description || defaults.cta.description,
      primaryAction: settings.cta?.primaryAction || defaults.cta.primaryAction,
      secondaryAction: settings.cta?.secondaryAction || defaults.cta.secondaryAction,
    },

    // Nav, footer, pages — structural, stay in code defaults
    nav: defaults.nav,
    footer: defaults.footer,
    howItWorks: defaults.howItWorks,
    pages: defaults.pages,
  };
}
