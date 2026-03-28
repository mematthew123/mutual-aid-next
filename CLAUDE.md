# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mutual Aid Network — a community platform for sharing resources, requesting help, offering assistance, and organizing events. Built as a Turborepo monorepo with a Next.js frontend and Sanity CMS.

## Commands

```bash
# Development
npm run dev              # All apps (Next.js :3000 + Studio :3333)
npm run dev:web          # Next.js only
npm run dev:studio       # Sanity Studio only
npm run dev:coordinator  # Coordinator dashboard
npm run dev:cloudinary   # Cloudinary dashboard

# Build
npm run build            # All apps
npm run build:web        # Next.js only
npm run build:studio     # Sanity Studio only

# Lint
npm run lint             # All apps (ESLint 9 flat config)

# Sanity CLI (run from apps/studio/)
npx sanity schema deploy   # Deploy schema changes
npx sanity dev             # Studio with Vision GROQ playground
```

No test framework is configured.

## Architecture

### Monorepo Structure

- **`apps/web`** — Next.js 16 (App Router, React 19, TypeScript strict mode). Path alias: `@/*`
- **`apps/studio`** — Sanity Studio v5 with custom structure, Cloudinary asset source plugin, and Vision tool
- **`apps/dashboard-apps/`** — Admin dashboards (Sanity v4 apps): `coordinator-dashboard`, `cloudinary`, `example-app`
- **`packages/`** — Shared packages (empty, reserved for future use)

Package manager is npm (workspaces). Turborepo handles task orchestration.

### Data Flow

- **Read path**: Next.js pages/components → GROQ queries (`lib/sanity/queries.ts`) → Sanity CDN read client
- **Write path**: Form submissions → Next.js API routes (`app/api/`) → Sanity write client (server-side only, token-protected)
- Clients configured in `apps/web/lib/sanity/client.ts` — `client` (CDN, read-only) and `writeClient` (token, server-side)

### Web App Structure (`apps/web/app/`)

Routes: `/requests`, `/offers`, `/events`, `/resources`, `/donate`, `/request-help`, `/offer-help`, `/[slug]` (CMS pages)
API routes: `api/requests`, `api/offers`, `api/cloudinary`

Components organized by purpose:
- `components/ui/` — Base design system (Button, Card, Badge, Input, etc.)
- `components/cards/` — Domain cards (RequestCard, OfferCard, EventCard, etc.)
- `components/layout/` — Header, Footer, Container, Section
- `components/filters/` — Filter UI for listings

Types in `lib/sanity/types.ts` mirror Sanity schemas. GROQ queries in `lib/sanity/queries.ts` use field projections for optimized fetching.

### Sanity Studio (`apps/studio/`)

- Schemas: `schemaTypes/documents/` (9 document types), `schemaTypes/objects/` (seo), `schemaTypes/blocks/` (8 page builder blocks)
- Custom sidebar structure in `structure/index.ts` with filtered document lists
- Singleton pattern for `settings` document
- Cloudinary integration via custom plugin in `plugins/cloudinary-asset-source/`

Key document types: `settings`, `page`, `resourceRequest`, `resourceOffer`, `resourceCategory`, `event`, `communityResource`, `donationCampaign`, `teamMember`

### Environment Variables

Web app (`apps/web`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — `51mpsx72`
- `NEXT_PUBLIC_SANITY_DATASET` — `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` — defaults to `2024-01-01`
- `SANITY_API_TOKEN` — server-side write token

Studio (`apps/studio`):
- `SANITY_STUDIO_CLOUDINARY_CLOUD_NAME`
- `SANITY_STUDIO_CLOUDINARY_API_KEY`

## Styling Rules

This project uses **Tailwind CSS v4** with a custom OKLCh color system defined in `apps/web/app/globals.css`. The full rules are in `TAILWIND-RULES.md`. Key points:

- **Never use `@apply`** — use CSS variables or components instead
- **Never use `space-x-*`/`space-y-*`** in flex/grid — always use `gap-*`
- **Never use `leading-*`** — use line-height modifiers: `text-base/7`
- **Use v4 names**: `bg-linear-*` not `bg-gradient-*`, `shadow-xs` not `shadow-sm` (shifted scale), `rounded-xs` not `rounded-sm`, `outline-hidden` not `outline-none`
- **Use opacity modifiers**: `bg-red-500/60` not `bg-opacity-*`
- **Use `min-h-dvh`** not `min-h-screen` (mobile Safari)
- **Use `size-*`** for equal width/height
- Color palette: `forest-*` (primary), `sage-*` (secondary), `mint-*` (accent), `terracotta-*` (urgency), `wheat-*` (warm), `warmgray-*` (neutrals)

## Schema Reference

See `STRUCTURE.md` for full schema documentation including field details, studio sidebar structure, and seed data.
