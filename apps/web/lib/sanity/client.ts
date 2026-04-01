import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Read-only client for public data fetching (uses CDN)
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : (null as unknown as ReturnType<typeof createClient>);

// Server-side client with write access (for form submissions)
// Only use in API routes, never expose token to client
export const writeClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    })
  : (null as unknown as ReturnType<typeof createClient>);
