# Cloudinary Integration

## Overview

Cloudinary serves as the primary image asset pipeline for the Mutual Aid Network, replacing Sanity's built-in image hosting. The integration spans three apps: the Next.js web frontend, the Sanity Studio, and a dedicated Cloudinary dashboard app. All server-side Cloudinary operations route through a single proxy API in the web app.

**Cloud name:** `fortivex-partner`
**SDK version:** `cloudinary ^2.9.0` (Node.js v2)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  Sanity Studio   │     │  Cloudinary       │     │  Next.js Web App     │
│  (apps/studio)   │     │  Dashboard App    │     │  (apps/web)          │
│                  │     │  (apps/dashboard- │     │                      │
│  Media Library   │     │   apps/cloudinary)│     │  Image rendering     │
│  widget (CDN)    │     │  Upload widget    │     │  via Cloudinary URLs │
└────────┬─────────┘     └────────┬──────────┘     └──────────┬───────────┘
         │                        │                            │
         │    ┌───────────────────┴────────────────┐           │
         └───►│  /api/cloudinary (proxy route)     │◄──────────┘
              │  Cloudinary Node.js SDK            │
              │  CORS-protected, token-secured      │
              └───────────────┬────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Cloudinary CDN   │
                    │  res.cloudinary.  │
                    │  com              │
                    └──────────────────┘
```

---

## Environment Variables

### Web App (`apps/web`)

| Variable | Scope | Purpose |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | Server | SDK configuration |
| `CLOUDINARY_API_KEY` | Server | SDK authentication |
| `CLOUDINARY_API_SECRET` | Server | SDK authentication (never exposed to client) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client | Building delivery URLs in the browser |

### Sanity Studio (`apps/studio`)

| Variable | Scope | Purpose |
|---|---|---|
| `SANITY_STUDIO_CLOUDINARY_CLOUD_NAME` | Client | Media Library widget config |
| `SANITY_STUDIO_CLOUDINARY_API_KEY` | Client | Media Library widget config |
| `SANITY_STUDIO_CLOUDINARY_API_SECRET` | Client | Media Library widget config |

### Dashboard App (`apps/dashboard-apps/cloudinary`)

| Variable | Scope | Purpose |
|---|---|---|
| `SANITY_APP_CLOUDINARY_CLOUD_NAME` | Client | Widget config |
| `SANITY_APP_CLOUDINARY_API_KEY` | Client | Widget config |
| `SANITY_APP_CLOUDINARY_UPLOAD_PRESET` | Client | Upload widget preset (optional) |
| `SANITY_APP_API_URL` | Client | Proxy API base URL (defaults to `localhost:3000`) |

---

## Proxy API (`apps/web/app/api/cloudinary/route.ts`)

Single GET endpoint handling multiple actions via query params. All Cloudinary SDK calls are server-side only.

| Action | Description |
|---|---|
| *(default)* | List/search assets with pagination, folder, tag, and query filtering |
| `action=tags` | List all tags |
| `action=folders` | List root folders |
| `action=usage` | Account storage, bandwidth, resource counts, plan info |
| `action=sanity-links` | Find Sanity documents referencing a given `public_id` |

**CORS:** Allows `localhost:3333-3336`, `localhost:5173`, and production Sanity Studio origins.

**Search:** Uses `cloudinary.search.expression()` for complex queries, `cloudinary.api.resources()` for simple listing. Supports cursor-based pagination.

---

## Sanity Schema: `cloudinaryImage`

Defined in `apps/studio/schemaTypes/objects/cloudinaryImage.ts`. An object type stored inline on documents.

| Field | Type | Visible | Purpose |
|---|---|---|---|
| `public_id` | string | Hidden | Cloudinary public ID |
| `format` | string | Hidden | File format (jpg, png, webp, etc.) |
| `width` | number | Hidden | Original width in pixels |
| `height` | number | Hidden | Original height in pixels |
| `version` | number | Hidden | Cache-busting version |
| `alt` | string | **Yes** | Alt text (editable by content authors) |

### Documents Using `cloudinaryImage`

| Document | Field | Purpose |
|---|---|---|
| `event` | `image` | Event listing image |
| `donationCampaign` | `image` | Campaign image |
| `communityResource` | `logo` | Resource logo |
| `teamMember` | `photo` | Team member photo |
| `page` | `seo.ogImage` | Open Graph image |
| `settings` | `logo` | Site logo |
| Hero block | `image` | Hero background image |

---

## Studio Plugin (`apps/studio/plugins/cloudinary-asset-source/`)

Custom Sanity plugin providing two components:

### `CloudinaryAssetSource`
- Registered as an asset source via `definePlugin()`
- Opens Cloudinary Media Library in **modal mode** (avoids cookie/iframe issues)
- Loads widget from CDN: `https://media-library.cloudinary.com/global/all.js`
- On selection: extracts `public_id`, `format`, `width`, `height`, `secure_url` and stores as Sanity asset

### `CloudinaryImageInput`
- Custom input component for the `cloudinaryImage` schema type
- Shows thumbnail preview (400x300, auto-cropped)
- Replace/Remove buttons and inline alt text editing
- Opens Media Library widget for image selection

**Files:**
- `index.ts` — Plugin definition
- `CloudinaryAssetSource.tsx` — Modal asset picker
- `CloudinaryImageInput.tsx` — Custom field input
- `useCloudinaryWidget.ts` — CDN script loader hook
- `CloudinaryIcon.tsx` — SVG icon
- `types.ts` — TypeScript definitions

---

## Dashboard App (`apps/dashboard-apps/cloudinary/`)

Standalone Sanity dashboard app for media management. Built with Sanity SDK v2.

### Tabs

1. **Media Library Browser** — Grid of assets with search, folder/tag filters, infinite scroll, and click-to-detail
2. **Upload Panel** — Cloudinary Upload Widget with folder selection, context-aware tag suggestions, and upload history
3. **Asset Overview** — Account stats (total assets, storage/bandwidth gauges, folders, tags, plan info, quick links)

### Asset Detail Panel

Side panel showing:
- Full metadata (dimensions, format, size, folder, tags, upload date)
- **"Used In" section** — Sanity documents referencing the asset (fetched via `action=sanity-links`)
- **Transformation presets** with copy-URL buttons:
  - Event Card: `c_fill,w_600,h_400,g_auto`
  - Hero Background: `c_fill,w_1920,h_800,g_auto`
  - Team Photo: `c_fill,w_400,h_400,g_face`
  - Social/OG: `c_fill,w_1200,h_630,g_auto`
  - Resource Logo: `c_limit,w_200,h_200`

**Key files:**
- `src/CloudinaryDashboard.tsx` — Main dashboard with tab navigation
- `src/components/MediaLibraryBrowser.tsx` — Asset grid and filters
- `src/components/UploadPanel.tsx` — Upload widget integration
- `src/components/AssetOverview.tsx` — Account stats
- `src/components/AssetDetailPanel.tsx` — Detail side panel
- `src/hooks/useCloudinaryAssets.ts` — Asset fetching with pagination
- `src/hooks/useCloudinaryConfig.ts` — Environment variable access

---

## Image URL Generation (`apps/web/lib/sanity/image.ts`)

Three functions handling image URL construction:

### `cloudinaryImageUrl(image, options?)`
Builds delivery URLs from stored Cloudinary metadata.

```
https://res.cloudinary.com/{cloudName}/image/upload/{transforms}/v{version}/{public_id}.{format}
```

**Default transforms:** `f_auto,q_auto` (auto format and quality).
**Options:** `width`, `height`, `fit` (`fill`|`scale`|`limit`), `gravity` (`auto`|`face`|`center`), `format`, `quality`.

### `sanityImageUrl(image)`
Legacy function for Sanity-hosted images (`cdn.sanity.io`). Kept for backward compatibility during migration.

### `resolveImageUrl(image, options?)`
Smart resolver — detects whether the image is a `cloudinaryImage` (has `public_id`) or a Sanity image (has `asset._ref`) and delegates accordingly. Used throughout the frontend.

---

## Portable Text Rendering

`apps/web/components/portable-text.tsx` handles two image block types:

- **`image`** — Legacy Sanity images
- **`cloudinaryImage`** — Cloudinary images

Both render through `resolveImageUrl()` with responsive sizing and alt text support.

---

## Backward Compatibility

The codebase supports a migration period where both Cloudinary and legacy Sanity images coexist:

- `ImageField` type is a union: `CloudinaryImage | { asset?: { _ref: string }; alt?: string }`
- `resolveImageUrl()` auto-detects the image source
- Portable Text renderer handles both block types
- No hard cutover required — old content continues to render

---

## Common Transformations Reference

| Transform | Syntax | Usage |
|---|---|---|
| Auto format | `f_auto` | Always applied — serves WebP/AVIF where supported |
| Auto quality | `q_auto` | Always applied — optimizes file size |
| Fill crop | `c_fill,w_{W},h_{H}` | Cards, thumbnails, fixed-ratio containers |
| Scale | `c_scale,w_{W}` | Responsive width-based sizing |
| Limit | `c_limit,w_{W},h_{H}` | Scale down only if larger (logos) |
| Smart crop | `g_auto` | AI-based subject detection |
| Face detect | `g_face` | Portrait/team photos |

---

## GROQ Query for Asset References

Used by the `sanity-links` API action to find all documents referencing a Cloudinary asset:

```groq
*[
  image.public_id == $pid ||
  logo.public_id == $pid ||
  photo.public_id == $pid ||
  seo.image.public_id == $pid ||
  count(pageBuilder[image.public_id == $pid || public_id == $pid]) > 0
]{
  _id,
  _type,
  "title": coalesce(title, name),
  "slug": slug.current
}
```
