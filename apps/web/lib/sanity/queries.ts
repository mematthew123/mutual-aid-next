import { client } from "./client";
import type {
  ResourceRequest,
  ResourceOffer,
  Category,
  Event,
  CommunityResource,
  DonationCampaign,
  Page,
  Settings,
  RequestFilters,
  OfferFilters,
} from "./types";

// ============================================================================
// Settings (singleton)
// ============================================================================

export async function getSettings(): Promise<Settings | null> {
  return client.fetch(
    `*[_type == "settings"][0]{
      _id,
      _type,
      title,
      shortName,
      tagline,
      description,
      footerNote,
      logo { asset, public_id, format, width, height, version, alt },
      hero,
      cta,
      terminology,
      impactStats[]{ label, value },
      contact,
      social,
      serviceArea
    }`
  );
}

// Category projection for expansion
// Note: keeps slug as object { current } to match component expectations
const categoryProjection = `{
  _id,
  title,
  slug,
  description,
  icon,
  color
}`;

// ============================================================================
// Categories
// ============================================================================

export async function getCategories(): Promise<Category[]> {
  return client.fetch(
    `*[_type == "resourceCategory"] | order(title asc) ${categoryProjection}`
  );
}

// ============================================================================
// Resource Requests
// ============================================================================

const requestProjection = `{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  description,
  "category": category->${categoryProjection},
  urgency,
  status,
  isPublic,
  contactPreference,
  neighborhood
}`;

export async function getOpenRequests(
  filters?: RequestFilters,
  limit: number = 50
): Promise<ResourceRequest[]> {
  // Build filter conditions
  const conditions = [
    '_type == "resourceRequest"',
    "status == 'open'",
    "isPublic == true",
  ];

  if (filters?.category) {
    conditions.push(`category->slug.current == $category`);
  }
  if (filters?.urgency) {
    conditions.push("urgency == $urgency");
  }
  if (filters?.neighborhood) {
    conditions.push("neighborhood == $neighborhood");
  }

  const query = `*[${conditions.join(" && ")}] | order(
    select(
      urgency == "critical" => 0,
      urgency == "high" => 1,
      urgency == "medium" => 2,
      urgency == "low" => 3
    ),
    _createdAt desc
  )[0...$limit] ${requestProjection}`;

  return client.fetch(query, {
    category: filters?.category,
    urgency: filters?.urgency,
    neighborhood: filters?.neighborhood,
    limit,
  });
}

export async function getRequestById(id: string): Promise<ResourceRequest | null> {
  return client.fetch(
    `*[_type == "resourceRequest" && _id == $id][0] ${requestProjection}`,
    { id }
  );
}

export async function getFeaturedRequests(limit: number = 6): Promise<ResourceRequest[]> {
  return getOpenRequests(undefined, limit);
}

// ============================================================================
// Resource Offers
// ============================================================================

const offerProjection = `{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  description,
  "categories": categories[]->${categoryProjection},
  status,
  offerType,
  travelRadius,
  neighborhood,
  availability
}`;

export async function getActiveOffers(
  filters?: OfferFilters,
  limit: number = 50
): Promise<ResourceOffer[]> {
  const conditions = [
    '_type == "resourceOffer"',
    "status == 'active'",
  ];

  if (filters?.category) {
    conditions.push(`$category in categories[]->slug.current`);
  }
  if (filters?.neighborhood) {
    conditions.push("neighborhood == $neighborhood");
  }

  const query = `*[${conditions.join(" && ")}] | order(_createdAt desc)[0...$limit] ${offerProjection}`;

  return client.fetch(query, {
    category: filters?.category,
    neighborhood: filters?.neighborhood,
    limit,
  });
}

export async function getOfferById(id: string): Promise<ResourceOffer | null> {
  return client.fetch(
    `*[_type == "resourceOffer" && _id == $id][0] ${offerProjection}`,
    { id }
  );
}

export async function getFeaturedOffers(limit: number = 3): Promise<ResourceOffer[]> {
  return getActiveOffers(undefined, limit);
}

// ============================================================================
// Events
// ============================================================================

const eventProjection = `{
  _id,
  _type,
  _createdAt,
  title,
  "slug": slug.current,
  description,
  eventType,
  status,
  startDateTime,
  endDateTime,
  locationType,
  location,
  virtualLink,
  registrationRequired,
  maxAttendees,
  isRecurring,
  recurringPattern,
  image { asset, alt, public_id, format, width, height, version }
}`;

export async function getUpcomingEvents(limit: number = 5): Promise<Event[]> {
  return client.fetch(
    `*[_type == "event" && status == "published" && startDateTime > now()] | order(startDateTime asc)[0...$limit] ${eventProjection}`,
    { limit }
  );
}

// ============================================================================
// Unique Values (for filter dropdowns)
// ============================================================================

export async function getUniqueNeighborhoods(): Promise<string[]> {
  const neighborhoods = await client.fetch<string[]>(`
    array::unique(
      *[_type in ["resourceRequest", "resourceOffer"] && defined(neighborhood)].neighborhood
    )
  `);
  return neighborhoods.filter(Boolean).sort();
}

// ============================================================================
// Events (Extended)
// ============================================================================

export async function getAllEvents(): Promise<Event[]> {
  return client.fetch(
    `*[_type == "event" && status == "published"] | order(startDateTime asc) ${eventProjection}`
  );
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0] ${eventProjection}`,
    { slug }
  );
}

// ============================================================================
// Community Resources
// ============================================================================

const resourceProjection = `{
  _id,
  _type,
  _createdAt,
  name,
  "slug": slug.current,
  description,
  "categories": categories[]->${categoryProjection},
  contact,
  hours,
  eligibility,
  howToAccess,
  languages,
  accessibility,
  serviceArea,
  isFeatured,
  isVerified,
  lastVerified,
  logo { asset, public_id, format, width, height, version, alt }
}`;

export async function getAllResources(): Promise<CommunityResource[]> {
  return client.fetch(
    `*[_type == "communityResource" && isVerified == true] | order(isFeatured desc, name asc) ${resourceProjection}`
  );
}

export async function getResourceBySlug(slug: string): Promise<CommunityResource | null> {
  return client.fetch(
    `*[_type == "communityResource" && slug.current == $slug][0] ${resourceProjection}`,
    { slug }
  );
}

// ============================================================================
// Donation Campaigns
// ============================================================================

const campaignProjection = `{
  _id,
  _type,
  _createdAt,
  title,
  "slug": slug.current,
  campaignType,
  description,
  image,
  goal,
  timeline,
  donationOptions,
  donationLinks,
  acceptsInKind,
  inKindNeeds,
  dropOffInfo,
  status,
  isFeatured,
  updates
}`;

export async function getActiveCampaigns(): Promise<DonationCampaign[]> {
  return client.fetch(
    `*[_type == "donationCampaign" && status in ["active", "goalReached"]] | order(isFeatured desc, _createdAt desc) ${campaignProjection}`
  );
}

export async function getCampaignBySlug(slug: string): Promise<DonationCampaign | null> {
  return client.fetch(
    `*[_type == "donationCampaign" && slug.current == $slug][0] ${campaignProjection}`,
    { slug }
  );
}

// ============================================================================
// Pages (CMS)
// ============================================================================

const pageProjection = `{
  _id,
  _type,
  _createdAt,
  title,
  "slug": slug.current,
  pageBuilder[]{
    ...,
    _type == "hero" => {
      ...,
      ctas[]{
        ...,
        internalLink->{ "slug": slug.current }
      }
    },
    _type == "callToAction" => {
      ...,
      internalLink->{ "slug": slug.current },
      donationCampaign->{ "slug": slug.current }
    },
    _type == "featuredResources" => {
      ...,
      "resources": resources[]->${resourceProjection},
      category->{ _id, title, slug }
    },
    _type == "upcomingEvents" => {
      ...,
      "events": events[]->${eventProjection}
    },
    _type == "teamSection" => {
      ...,
      "teamMembers": teamMembers[]->{ _id, name, role, bio, email, photo { asset, public_id, format, width, height, version, alt } }
    }
  },
  seo
}`;

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0] ${pageProjection}`,
    { slug }
  );
}

export async function getAllPageSlugs(): Promise<string[]> {
  return client.fetch(
    `*[_type == "page"].slug.current`
  );
}
