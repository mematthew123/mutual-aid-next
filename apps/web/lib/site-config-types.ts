// Standalone type definition for SiteConfig.
// This file has no runtime imports, so it's safe to use in client components.

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  footerNote: string;

  terms: {
    member: string;
    members: string;
    organizer: string;
    organizers: string;
    helper: string;
    helpers: string;
    helping: string;
  };

  hero: {
    badge: string;
    heading: string;
    headingAccent: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  howItWorks: {
    heading: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };

  impactStats: Array<{
    label: string;
    value: string;
  }>;

  cta: {
    heading: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };

  nav: {
    items: Array<{
      name: string;
      href: string;
    }>;
  };

  footer: {
    sections: Array<{
      title: string;
      links: Array<{
        name: string;
        href: string;
      }>;
    }>;
  };

  pages: {
    requests: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      ctaTitle: string;
      ctaDescription: string;
    };
    offers: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
      ctaTitle: string;
      ctaDescription: string;
    };
    requestHelp: {
      title: string;
      description: string;
    };
    offerHelp: {
      title: string;
      description: string;
    };
    events: {
      title: string;
      description: string;
    };
    resources: {
      title: string;
      description: string;
    };
    donate: {
      title: string;
      description: string;
    };
  };
}
