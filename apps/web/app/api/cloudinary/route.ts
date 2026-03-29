import { type NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { client } from "@/lib/sanity/client";

// Configure Cloudinary SDK at module scope (server-side only)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------------------------------------------------------------------
// CORS — the dashboard app runs on a different origin during development
// ---------------------------------------------------------------------------
const DEV_ORIGINS = [
  "http://localhost:3333",
  "http://localhost:3334",
  "http://localhost:3335",
  "http://localhost:3336",
  "http://localhost:5173",
];

const ALLOWED_ORIGINS = [
  ...DEV_ORIGINS,
  ...(process.env.CLOUDINARY_PROXY_ALLOWED_ORIGINS?.split(",").map((o) =>
    o.trim()
  ) ?? []),
];

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// Preflight handler
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

// ---------------------------------------------------------------------------
// GET /api/cloudinary — list & search Cloudinary assets
// ---------------------------------------------------------------------------
interface CloudinaryResource {
  public_id: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes: number;
  secure_url: string;
  tags?: string[];
  created_at: string;
  folder?: string;
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Validate that the Cloudinary SDK is configured
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary API credentials are not configured on the server" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }

  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action") || "list";

  try {
    // -----------------------------------------------------------------------
    // action=tags — list all tags
    // -----------------------------------------------------------------------
    if (action === "tags") {
      const result = await cloudinary.api.tags({ max_results: 500 });
      return NextResponse.json(
        { tags: result.tags ?? [] },
        { headers: corsHeaders(origin) }
      );
    }

    // -----------------------------------------------------------------------
    // action=folders — list root folders
    // -----------------------------------------------------------------------
    if (action === "folders") {
      const result = await cloudinary.api.root_folders();
      return NextResponse.json(
        { folders: result.folders ?? [] },
        { headers: corsHeaders(origin) }
      );
    }

    // -----------------------------------------------------------------------
    // action=usage — account usage stats
    // -----------------------------------------------------------------------
    if (action === "usage") {
      const result = await cloudinary.api.usage();
      return NextResponse.json(
        {
          storage: {
            used: result.storage?.usage ?? 0,
            limit: result.storage?.limit ?? 0,
          },
          bandwidth: {
            used: result.bandwidth?.usage ?? 0,
            limit: result.bandwidth?.limit ?? 0,
          },
          resources: result.resources ?? 0,
          derived_resources: result.derived_resources ?? 0,
          plan: result.plan ?? "unknown",
        },
        { headers: corsHeaders(origin) }
      );
    }

    // -----------------------------------------------------------------------
    // action=sanity-links — find Sanity documents referencing a Cloudinary asset
    // -----------------------------------------------------------------------
    if (action === "sanity-links") {
      const publicId = searchParams.get("public_id");
      if (!publicId) {
        return NextResponse.json(
          { error: "public_id parameter is required" },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      const documents = await client.fetch(
        `*[
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
        }`,
        { pid: publicId }
      );

      return NextResponse.json(
        { documents: documents ?? [] },
        { headers: corsHeaders(origin) }
      );
    }

    // -----------------------------------------------------------------------
    // Default: list & search assets
    // -----------------------------------------------------------------------
    const query = searchParams.get("q") || "";
    const folder = searchParams.get("folder") || "";
    const tag = searchParams.get("tag") || "";
    const cursor = searchParams.get("cursor") || undefined;
    const maxResults = Math.min(
      Number(searchParams.get("max_results")) || 30,
      100
    );

    let result: { resources: CloudinaryResource[]; next_cursor?: string; total_count?: number };

    if (query || folder || tag) {
      // Build search expression
      const parts: string[] = [];
      if (query) parts.push(query);
      if (folder) parts.push(`folder:${folder}`);
      if (tag) parts.push(`tags:${tag}`);

      const search = cloudinary.search
        .expression(parts.join(" AND "))
        .sort_by("created_at", "desc")
        .max_results(maxResults);

      if (cursor) search.next_cursor(cursor);

      result = await search.execute();
    } else {
      // Default: list all uploaded resources, newest first
      result = await cloudinary.api.resources({
        type: "upload",
        max_results: maxResults,
        next_cursor: cursor,
      });
    }

    // Normalize response
    const assets = (result.resources || []).map((r: CloudinaryResource) => ({
      public_id: r.public_id,
      format: r.format,
      resource_type: r.resource_type,
      width: r.width ?? 0,
      height: r.height ?? 0,
      bytes: r.bytes,
      secure_url: r.secure_url,
      tags: r.tags ?? [],
      created_at: r.created_at,
      folder: r.folder ?? "",
    }));

    return NextResponse.json(
      {
        assets,
        next_cursor: result.next_cursor ?? null,
        total_count: result.total_count ?? assets.length,
      },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets from Cloudinary" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
