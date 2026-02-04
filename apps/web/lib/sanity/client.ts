import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Read-only client for public data fetching (uses CDN)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Server-side client with write access (for form submissions)
// Only use in API routes, never expose token to client
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
