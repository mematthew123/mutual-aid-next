"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, HeartIcon, LocationIcon } from "@/components/icons/category-icons";

export interface OfferCardProps extends HTMLAttributes<HTMLDivElement> {
  offer: {
    _id: string;
    title: string;
    description?: string;
    status: "active" | "paused" | "inactive";
    offerType?: "oneTime" | "recurring" | "ongoing";
    travelRadius?: "canTravel" | "limited" | "stationary";
    neighborhood?: string;
    categories?: Array<{
      title: string;
      slug: { current: string };
    }>;
  };
  showFullDescription?: boolean;
}

const OfferCard = forwardRef<HTMLDivElement, OfferCardProps>(
  ({ className, offer, showFullDescription = false, ...props }, ref) => {
    const offerTypeLabels = {
      oneTime: "One-time",
      recurring: "Recurring",
      ongoing: "Ongoing",
    };

    const travelLabels = {
      canTravel: "Can travel",
      limited: "Limited travel",
      stationary: "Pickup only",
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          // Left border accent - warm wheat for offers (contrast with request urgency colors)
          "border-l-4 border-l-wheat-400",
          className
        )}
        {...props}
      >
        <CardContent className="pt-6">
          {/* Header: Heart icon + offer type */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-wheat-600">
              <HeartIcon className="size-5 fill-wheat-100" />
              <span className="text-sm font-medium">Offering Help</span>
            </div>

            {offer.offerType && (
              <Badge variant="success" size="sm">
                {offerTypeLabels[offer.offerType]}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            {offer.title}
          </h3>

          {/* Description */}
          {offer.description && (
            <p
              className={cn(
                "text-stone-600 text-sm leading-relaxed",
                !showFullDescription && "line-clamp-2"
              )}
            >
              {offer.description}
            </p>
          )}

          {/* Categories */}
          {offer.categories && offer.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {offer.categories.map((category) => {
                const CategoryIcon = getCategoryIcon(category.slug.current);
                return (
                  <div
                    key={category.slug.current}
                    className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-mint-100 text-forest-700"
                  >
                    <CategoryIcon className="size-3.5" />
                    <span>{category.title}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-4 text-sm text-stone-500">
            {offer.neighborhood && (
              <div className="flex items-center gap-1">
                <LocationIcon className="size-4" />
                <span>{offer.neighborhood}</span>
              </div>
            )}
            {offer.travelRadius && (
              <span className="text-stone-400">
                {travelLabels[offer.travelRadius]}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-stone-100">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/offers/${offer._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

OfferCard.displayName = "OfferCard";

export { OfferCard };
