# Mutual Aid Network - Project Structure

## Monorepo Overview

This is a Turborepo monorepo containing a Next.js frontend and Sanity Studio for content management.

```
mutual-aid-next/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── app/                # App Router pages
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind/postcss configs
│   │
│   └── studio/                 # Sanity Studio v5
│       ├── schemaTypes/        # Content schemas
│       │   ├── documents/      # Document types
│       │   ├── objects/        # Reusable objects
│       │   └── blocks/         # Page builder blocks
│       ├── structure/          # Studio sidebar config
│       ├── sanity.config.ts    # Studio configuration
│       ├── sanity.cli.ts       # CLI configuration
│       └── package.json
│
├── packages/                   # Shared packages (future use)
│
├── .agents/                    # AI agent skills
│   └── skills/                 # Sanity best practices
│
├── .claude/                    # Claude Code config
│   ├── settings.local.json
│   └── skills/                 # Symlinks to .agents/skills
│
├── package.json                # Root workspace config
├── turbo.json                  # Turborepo pipeline
└── .gitignore
```

---

## Sanity Schema Architecture

### Document Types

| Type | File | Description |
|------|------|-------------|
| `settings` | `documents/settings.ts` | Site-wide settings (singleton) |
| `page` | `documents/page.ts` | Flexible pages with page builder |
| `resourceRequest` | `documents/resourceRequest.ts` | Help requests from community members |
| `resourceOffer` | `documents/resourceOffer.ts` | Volunteer offers to help |
| `resourceCategory` | `documents/resourceCategory.ts` | Categories for requests/offers |
| `event` | `documents/event.ts` | Community events |
| `communityResource` | `documents/communityResource.ts` | External resource directory |
| `teamMember` | `documents/teamMember.ts` | Staff/volunteer profiles |
| `donationCampaign` | `documents/donationCampaign.ts` | Fundraising campaigns |

### Object Types

| Type | File | Description |
|------|------|-------------|
| `seo` | `objects/seo.ts` | SEO metadata for pages |

### Page Builder Blocks

| Block | File | Description |
|-------|------|-------------|
| `hero` | `blocks/hero.ts` | Hero section with CTAs |
| `textSection` | `blocks/textSection.ts` | Rich text content |
| `callToAction` | `blocks/callToAction.ts` | CTA banners |
| `featuredResources` | `blocks/featuredResources.ts` | Resource directory showcase |
| `upcomingEvents` | `blocks/upcomingEvents.ts` | Event listings |
| `faqSection` | `blocks/faqSection.ts` | FAQ accordions |
| `teamSection` | `blocks/teamSection.ts` | Team member grid |
| `statsSection` | `blocks/statsSection.ts` | Impact statistics |

---

## Studio Sidebar Structure

```
Mutual Aid Network
│
├── 🔧 Site Settings              # Singleton - global config
│
├── ────────────────
│
├── 📄 Pages                      # All flexible pages
│
├── ────────────────
│
├── ❤️ Mutual Aid
│   ├── All Requests              # Every request
│   ├── Open Requests             # status == "open"
│   ├── Urgent Requests           # urgency == "high" | "critical"
│   ├── ────────────
│   ├── All Offers                # Every offer
│   └── Active Offers             # status == "active"
│
├── 📅 Events
│   ├── All Events                # Every event
│   ├── Upcoming Events           # Future + published
│   └── Draft Events              # status == "draft"
│
├── 📍 Resource Directory
│   ├── All Resources             # Every community resource
│   ├── Featured Resources        # isFeatured == true
│   └── Needs Verification        # isVerified != true
│
├── 💳 Donations
│   ├── All Campaigns             # Every campaign
│   └── Active Campaigns          # status == "active"
│
├── ────────────────
│
├── 👥 Team                       # Team members
│
└── 🏷️ Categories                 # Resource categories
```

---

## Key Schema Features

### Resource Requests
- **Urgency levels**: low, medium, high, critical
- **Status tracking**: open, inProgress, fulfilled, closed
- **Privacy controls**: public/private visibility
- **Contact preferences**: through coordinator or direct

### Resource Offers
- **Availability scheduling**: days and time ranges
- **Offer types**: one-time, recurring, ongoing
- **Travel radius**: can travel, limited, or stationary
- **Multi-category support**: can help in multiple areas

### Events
- **Event types**: distribution, volunteer, meeting, workshop, fundraiser, social
- **Location support**: in-person, virtual, or hybrid
- **Registration**: optional with capacity limits
- **Volunteer roles**: specific roles with counts needed
- **Recurring events**: weekly, bi-weekly, monthly patterns

### Community Resources
- **Verification status**: track verified resources
- **Accessibility info**: wheelchair, ASL, TTY support
- **Multi-language support**: track languages offered
- **Eligibility requirements**: rich text for complex criteria

### Donation Campaigns
- **Goal tracking**: amount raised vs target
- **Multiple payment links**: Venmo, CashApp, PayPal, GoFundMe
- **In-kind donations**: track physical item needs
- **Campaign updates**: timeline of progress updates

---

## Commands

### Development
```bash
# Start everything (Next.js + Studio)
npm run dev

# Start only Next.js (port 3000)
npm run dev:web

# Start only Studio (port 3333)
npm run dev:studio
```

### Build
```bash
# Build everything
npm run build

# Build specific app
npm run build:web
npm run build:studio
```

### Sanity CLI
```bash
# Deploy schema changes
cd apps/studio && npx sanity schema deploy

# Open Vision (GROQ playground)
cd apps/studio && npx sanity dev
```

---

## Sanity Project Info

- **Project ID**: `51mpsx72`
- **Dataset**: `production`
- **Studio URL**: http://localhost:3333 (dev)

---

## Resource Categories (Seed Data)

| Category | Icon | Color |
|----------|------|-------|
| Food & Groceries | food | green |
| Transportation | transport | blue |
| Housing & Shelter | housing | orange |
| Childcare | childcare | pink |
| Medical & Health | medical | red |
| Financial Assistance | financial | purple |
| Household Items | household | yellow |
| Clothing | clothing | gray |
