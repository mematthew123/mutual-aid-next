import { client } from "./client";
import type {
  ResourceRequest,
  ResourceOffer,
  Category,
  Event,
  RequestFilters,
  OfferFilters,
} from "./types";

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
  recurringPattern
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
