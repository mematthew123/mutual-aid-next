"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon, LocationIcon } from "@/components/icons/category-icons";
import type { CommunityResource } from "@/lib/sanity/types";

export interface ResourceCardProps extends HTMLAttributes<HTMLDivElement> {
  resource: CommunityResource;
}

const ResourceCard = forwardRef<HTMLDivElement, ResourceCardProps>(
  ({ className, resource, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <CardContent className="pt-6">
          {/* Verified Badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              {resource.isVerified && (
                <Badge variant="success" size="sm">
                  Verified
                </Badge>
              )}
              {resource.isFeatured && (
                <Badge variant="default" size="sm">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            {resource.name}
          </h3>

          {/* Description */}
          {resource.description && (
            <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {resource.description}
            </p>
          )}

          {/* Categories */}
          {resource.categories && resource.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.categories.slice(0, 3).map((category) => {
                const CategoryIcon = getCategoryIcon(category.slug.current);
                return (
                  <div
                    key={category._id}
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-sage-100 text-forest-700"
                  >
                    <CategoryIcon className="size-3" />
                    <span>{category.title}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-1.5 text-sm text-stone-500">
            {resource.serviceArea && (
              <div className="flex items-center gap-1.5">
                <LocationIcon className="size-4" />
                <span>{resource.serviceArea}</span>
              </div>
            )}
            {resource.contact?.phone && (
              <p>{resource.contact.phone}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-stone-100">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/resources/${resource.slug}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ResourceCard.displayName = "ResourceCard";

export { ResourceCard };
