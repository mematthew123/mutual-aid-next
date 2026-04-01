import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Lazy-initialize clients so module evaluation doesn't crash when env vars
// are missing (e.g. during Next.js build page-data collection on Vercel).

let _client: SanityClient;
/** Read-only client for public data fetching (uses CDN) */
export function getClient(): SanityClient {
  if (!_client) {
    if (!projectId) {
      throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID env var");
    }
    _client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  }
  return _client;
}

let _writeClient: SanityClient;
/** Server-side client with write access — only use in API routes */
export function getWriteClient(): SanityClient {
  if (!_writeClient) {
    if (!projectId) {
      throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID env var");
    }
    _writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return _writeClient;
}

// Backward-compatible exports — these are Proxy wrappers that lazily create
// the real client on first property access, avoiding the module-scope crash.
export const client: SanityClient = new Proxy({} as SanityClient, {
  get(_, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const writeClient: SanityClient = new Proxy({} as SanityClient, {
  get(_, prop) {
    return (getWriteClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
