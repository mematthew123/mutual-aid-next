// Types matching Sanity schema definitions

export interface CloudinaryImage {
  _type?: "cloudinaryImage";
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  version?: number;
  gravity?: "auto" | "face" | "center";
  alt?: string;
}

/** Supports both new Cloudinary refs and legacy Sanity image refs */
export type ImageField = CloudinaryImage | { asset?: { _ref: string }; alt?: string };

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
  slug: string; // Projected as string in queries
  description?: unknown[]; // Portable Text blocks
  eventType?: "distribution" | "volunteer" | "meeting" | "workshop" | "fundraiser" | "social" | "other";
  status: "draft" | "published" | "cancelled" | "postponed" | "completed";
  startDateTime: string;
  endDateTime?: string;
  location?: {
    type?: "inPerson" | "virtual" | "hybrid";
    venue?: string;
    address?: string;
    virtualLink?: string;
    accessibilityInfo?: string;
  };
  registration?: {
    required?: boolean;
    link?: string;
    deadline?: string;
    capacity?: number;
  };
  isRecurring?: boolean;
  recurrencePattern?: "weekly" | "biweekly" | "monthly" | "firstOfMonth" | "lastOfMonth";
  volunteersNeeded?: number;
  image?: ImageField;
}

export interface CommunityResource {
  _id: string;
  _type: "communityResource";
  _createdAt: string;
  name: string;
  slug: string; // Projected as string in queries
  description?: string;
  categories?: Category[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  hours?: string;
  eligibility?: unknown[]; // Portable Text blocks
  howToAccess?: unknown[]; // Portable Text blocks
  languages?: string[];
  accessibility?: string[];
  serviceArea?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  lastVerified?: string;
  logo?: ImageField;
}

export interface DonationCampaign {
  _id: string;
  _type: "donationCampaign";
  _createdAt: string;
  title: string;
  slug: string; // Projected as string in queries
  campaignType?: "general" | "emergency" | "specific" | "recurring";
  description?: unknown[]; // Portable Text blocks
  image?: ImageField;
  goal?: {
    hasGoal?: boolean;
    amount?: number;
    currentAmount?: number;
    showProgress?: boolean;
  };
  timeline?: {
    startDate?: string;
    endDate?: string;
    isOngoing?: boolean;
  };
  donationOptions?: Array<{
    amount?: number;
    label?: string;
  }>;
  donationLinks?: {
    venmo?: string;
    cashapp?: string;
    paypal?: string;
    gofundme?: string;
    other?: string;
    otherLabel?: string;
  };
  acceptsInKind?: boolean;
  inKindNeeds?: string[];
  dropOffInfo?: string;
  status: "draft" | "active" | "goalReached" | "ended";
  isFeatured?: boolean;
  updates?: Array<{
    date?: string;
    title?: string;
    content?: unknown[];
  }>;
}

export interface TeamMember {
  _id: string;
  _type: "teamMember";
  name: string;
  role?: string;
  bio?: string;
  email?: string;
  photo?: ImageField;
}

export interface Page {
  _id: string;
  _type: "page";
  _createdAt: string;
  title: string;
  slug: string; // Projected as string in queries
  pageBuilder?: unknown[]; // Array of page builder blocks
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: ImageField;
  };
}

export interface Settings {
  _id: string;
  _type: "settings";
  title: string;
  shortName?: string;
  tagline?: string;
  description?: string;
  footerNote?: string;
  logo?: ImageField;
  hero?: {
    badge?: string;
    heading?: string;
    headingAccent?: string;
    description?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  cta?: {
    heading?: string;
    description?: string;
    primaryAction?: string;
    secondaryAction?: string;
  };
  terminology?: {
    member?: string;
    members?: string;
    organizer?: string;
    organizers?: string;
    helper?: string;
    helpers?: string;
    helping?: string;
  };
  impactStats?: Array<{
    label: string;
    value: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  serviceArea?: {
    description?: string;
    neighborhoods?: string[];
  };
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
