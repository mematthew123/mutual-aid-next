# Mutual Aid Network

An open-source community platform for mutual aid organizing — share resources, request help, offer assistance, and coordinate events. Built as a modern, CMS-driven template that any community can fork and make their own.

## Why This Exists

Mutual aid networks are everywhere, but most run on spreadsheets, social media posts, and group chats. This project gives organizers a real platform: a public-facing website backed by a content management studio where coordinators can manage requests, offers, events, resources, and donation campaigns — no code changes needed.

## Features

- **Resource Requests & Offers** — Community members submit needs and offers through public forms; coordinators manage them via the CMS
- **Events** — List and promote community events with full detail pages
- **Community Resources** — Curated directory of local resources and services
- **Donation Campaigns** — Fundraising pages with progress tracking and payment platform links
- **Team Pages** — Highlight organizers and volunteers
- **CMS-Driven Pages** — Build custom pages with a drag-and-drop page builder (hero, text, cards, CTAs, and more)
- **Cloudinary Integration** — Optimized image management with upload presets and transformations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js 16](https://nextjs.org) (App Router, React 19, TypeScript) |
| CMS | [Sanity Studio v5](https://www.sanity.io) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with custom OKLCh color system |
| Images | [Cloudinary](https://cloudinary.com) |
| Monorepo | [Turborepo](https://turbo.build) with npm workspaces |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A [Sanity](https://www.sanity.io) project (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-org/mutual-aid-next.git
cd mutual-aid-next
npm install
```

### 2. Set up environment variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_write_token
```

Create `apps/studio/.env.local`:

```env
SANITY_STUDIO_CLOUDINARY_CLOUD_NAME=your_cloud_name
SANITY_STUDIO_CLOUDINARY_API_KEY=your_api_key
```

For Cloudinary image transformations in the web app, also add to `apps/web/.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run development servers

```bash
npm run dev          # Starts both Next.js (:3000) and Sanity Studio (:3333)
```

Or run them individually:

```bash
npm run dev:web      # Next.js only
npm run dev:studio   # Sanity Studio only
```

## Project Structure

```
mutual-aid-next/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/                # App Router (pages, API routes, layouts)
│   │   ├── components/         # UI components, cards, layout, filters
│   │   └── lib/sanity/         # Sanity client, GROQ queries, types
│   │
│   ├── studio/                 # Sanity Studio
│   │   ├── schemaTypes/        # Content schemas (documents, objects, blocks)
│   │   ├── structure/          # Custom sidebar configuration
│   │   └── plugins/            # Cloudinary asset source plugin
│   │
│   └── dashboard-apps/         # Admin dashboards
│       ├── coordinator-dashboard/
│       └── cloudinary/
│
├── packages/                   # Shared packages (reserved for future use)
├── turbo.json                  # Turborepo task pipeline
└── package.json                # Root workspace configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run dev:web` | Start Next.js frontend only |
| `npm run dev:studio` | Start Sanity Studio only |
| `npm run build` | Build all apps for production |
| `npm run build:web` | Build Next.js frontend only |
| `npm run build:studio` | Build Sanity Studio only |
| `npm run lint` | Lint all apps |

## Content Model

The CMS includes the following document types:

| Document | Purpose |
|----------|---------|
| **Settings** | Site-wide configuration (singleton) — name, navigation, footer, SEO |
| **Page** | CMS-driven pages with a modular page builder |
| **Resource Request** | Community help requests submitted via public form |
| **Resource Offer** | Community help offers submitted via public form |
| **Resource Category** | Categories for organizing requests and offers |
| **Event** | Community events with date, location, and details |
| **Community Resource** | Directory of local services and resources |
| **Donation Campaign** | Fundraising campaigns with progress tracking |
| **Team Member** | Organizer and volunteer profiles |

## Customizing for Your Community

This template is designed to be forked and adapted:

1. **Branding** — Update the color palette in `apps/web/app/globals.css`. The project uses a semantic color system (`forest`, `sage`, `mint`, `terracotta`, `wheat`, `warmgray`) built on OKLCh for perceptual uniformity.

2. **Content** — All content is managed through Sanity Studio. Log in at `localhost:3333` during development to add your community's requests, offers, events, and resources.

3. **Schemas** — Extend or modify content types in `apps/studio/schemaTypes/`. The page builder blocks in `schemaTypes/blocks/` can be customized to add new section types.

4. **Deployment** — The Next.js app deploys to any platform that supports it (Vercel, Netlify, etc.). Sanity Studio can be deployed via `npx sanity deploy` or hosted alongside the app.

## Contributing

Coming Soon...maybe??

## License

This project is open source. License details coming soon.
