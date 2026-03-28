const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "51mpsx72";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Convert a Sanity image reference to a CDN URL.
 * Ref format: "image-{id}-{WxH}-{ext}"
 */
export function sanityImageUrl(
  source: { asset?: { _ref?: string } } | undefined
): string | null {
  const ref = source?.asset?._ref;
  if (!ref) return null;

  // Parse: image-abc123-800x600-png → abc123-800x600.png
  const parts = ref.split("-");
  if (parts.length < 4) return null;

  const id = parts.slice(1, -2).join("-");
  const dimensions = parts[parts.length - 2];
  const ext = parts[parts.length - 1];

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
}
