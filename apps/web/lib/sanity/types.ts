// Types matching Sanity schema definitions

export interface Category {
  _id: string;
  _type: "resourceCategory";
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  icon?: string;
  color?: string;
}

export interface ResourceRequest {
  _id: string;
  _type: "resourceRequest";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description?: string;
  category?: Category;
  urgency: "low" | "medium" | "high" | "critical";
  status: "open" | "inProgress" | "fulfilled" | "closed";
  isPublic: boolean;
  contactPreference: "direct" | "throughCoordinator" | "anonymous";
  neighborhood?: string;
  requesterName?: string;
  requesterContact?: string;
}

export interface Availability {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
}

export interface ResourceOffer {
  _id: string;
  _type: "resourceOffer";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description?: string;
  categories?: Category[];
  status: "active" | "paused" | "inactive";
  offerType?: "oneTime" | "recurring" | "ongoing";
  travelRadius?: "canTravel" | "limited" | "stationary";
  neighborhood?: string;
  availability?: Availability;
  offererName?: string;
  offererContact?: string;
}

export interface EventLocation {
  venueName?: string;
  address?: string;
  neighborhood?: string;
}

export interface Event {
  _id: string;
  _type: "event";
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  eventType?: "distribution" | "workshop" | "social" | "volunteer" | "fundraiser" | "other";
  status: "draft" | "published" | "cancelled";
  startDateTime: string;
  endDateTime?: string;
  locationType?: "inPerson" | "virtual" | "hybrid";
  location?: EventLocation;
  virtualLink?: string;
  registrationRequired?: boolean;
  maxAttendees?: number;
  isRecurring?: boolean;
  recurringPattern?: "daily" | "weekly" | "biweekly" | "monthly";
}

export interface CommunityResource {
  _id: string;
  _type: "communityResource";
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  resourceType?: string;
  address?: string;
  neighborhood?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  languagesOffered?: string[];
}

export interface DonationCampaign {
  _id: string;
  _type: "donationCampaign";
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  status: "active" | "completed" | "paused";
  goalAmount?: number;
  amountRaised?: number;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
}

export interface TeamMember {
  _id: string;
  _type: "teamMember";
  name: string;
  role?: string;
  bio?: string;
  email?: string;
}

export interface Settings {
  _id: string;
  _type: "settings";
  title: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

// Query filter types
export interface RequestFilters {
  category?: string;
  urgency?: ResourceRequest["urgency"];
  neighborhood?: string;
  status?: ResourceRequest["status"];
}

export interface OfferFilters {
  category?: string;
  neighborhood?: string;
  status?: ResourceOffer["status"];
}
