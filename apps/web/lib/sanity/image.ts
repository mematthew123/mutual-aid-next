const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "51mpsx72";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

interface ImageTransformOptions {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

/**
 * Convert a Sanity image reference to a CDN URL.
 * Ref format: "image-{id}-{WxH}-{ext}"
 */
export function sanityImageUrl(
  source: { asset?: { _ref?: string } } | undefined,
  options?: ImageTransformOptions
): string | null {
  const ref = source?.asset?._ref;
  if (!ref) return null;

  // Parse: image-abc123-800x600-png → abc123-800x600.png
  const parts = ref.split("-");
  if (parts.length < 4) return null;

  const id = parts.slice(1, -2).join("-");
  const dimensions = parts[parts.length - 2];
  const ext = parts[parts.length - 1];

  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;

  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.set("w", String(options.width));
    if (options.height) params.set("h", String(options.height));
    if (options.fit) params.set("fit", options.fit);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  return url;
}

// Map from our generic fit values to Cloudinary crop modes
const fitToCrop: Record<string, string> = {
  crop: "c_crop",
  fill: "c_fill",
  scale: "c_scale",
  clip: "c_limit",
  fillmax: "c_fill",
  max: "c_limit",
  min: "c_lfill",
};

/**
 * Build a Cloudinary delivery URL from stored metadata.
 */
export function cloudinaryImageUrl(
  source:
    | { public_id?: string; format?: string; version?: number }
    | undefined,
  options?: ImageTransformOptions
): string | null {
  const publicId = source?.public_id;
  if (!publicId || !cloudName) return null;

  const transforms: string[] = ["f_auto", "q_auto"];

  if (options?.format && options.format !== "auto") {
    transforms[0] = `f_${options.format}`;
  }
  if (options?.quality && options.quality !== "auto") {
    transforms[1] = `q_${options.quality}`;
  }
  if (options?.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options?.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options?.fit) {
    transforms.push(fitToCrop[options.fit] || "c_fill");
  }
  if (options?.gravity) {
    transforms.push(`g_${options.gravity}`);
  }

  const transformStr = transforms.join(",");
  const v = source?.version ? `v${source.version}/` : "";
  const ext = source?.format || "jpg";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${v}${publicId}.${ext}`;
}

/**
 * Resolve an image URL from either a Cloudinary reference (public_id)
 * or a legacy Sanity image reference (asset._ref). Supports both
 * data shapes for backwards compatibility during migration.
 */
export function resolveImageUrl(
  source: Record<string, unknown> | undefined,
  options?: ImageTransformOptions
): string | null {
  if (!source) return null;

  // New format: Cloudinary direct reference
  if (source.public_id && typeof source.public_id === "string") {
    return cloudinaryImageUrl(
      source as { public_id: string; format?: string; version?: number },
      options
    );
  }

  // Legacy format: Sanity image asset reference
  if (source.asset && typeof source.asset === "object") {
    return sanityImageUrl(
      source as { asset?: { _ref?: string } },
      options
    );
  }

  return null;
}
