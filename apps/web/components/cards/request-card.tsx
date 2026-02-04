"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/ui/badge";
import { getCategoryIcon, LocationIcon, ClockIcon } from "@/components/icons/category-icons";

export interface RequestCardProps extends HTMLAttributes<HTMLDivElement> {
  request: {
    _id: string;
    title: string;
    description?: string;
    urgency: "low" | "medium" | "high" | "critical";
    status: "open" | "inProgress" | "fulfilled" | "closed";
    neighborhood?: string;
    category?: {
      title: string;
      slug: { current: string };
      color?: string;
    };
    _createdAt: string;
  };
  showFullDescription?: boolean;
}

const RequestCard = forwardRef<HTMLDivElement, RequestCardProps>(
  ({ className, request, showFullDescription = false, ...props }, ref) => {
    const CategoryIcon = request.category
      ? getCategoryIcon(request.category.slug.current)
      : null;

    const timeAgo = getTimeAgo(request._createdAt);

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          // Left border accent based on urgency
          "border-l-4",
          {
            "border-l-sage-400": request.urgency === "low",
            "border-l-wheat-400": request.urgency === "medium",
            "border-l-terracotta-400": request.urgency === "high",
            "border-l-red-500": request.urgency === "critical",
          },
          className
        )}
        {...props}
      >
        <CardContent className="pt-6">
          {/* Header: Urgency + Category */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <UrgencyBadge urgency={request.urgency} />

            {request.category && CategoryIcon && (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  "px-2.5 py-1 rounded-full bg-stone-100"
                )}
              >
                <CategoryIcon className="size-4" />
                <span>{request.category.title}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            {request.title}
          </h3>

          {/* Description */}
          {request.description && (
            <p
              className={cn(
                "text-stone-600 text-sm leading-relaxed",
                !showFullDescription && "line-clamp-2"
              )}
            >
              {request.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-4 text-sm text-stone-500">
            {request.neighborhood && (
              <div className="flex items-center gap-1">
                <LocationIcon className="size-4" />
                <span>{request.neighborhood}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-stone-100">
          <Button
            variant={request.urgency === "critical" ? "urgent" : "primary"}
            className="w-full"
            asChild
          >
            <Link href={`/requests/${request._id}`}>
              I Can Help
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

RequestCard.displayName = "RequestCard";

export { RequestCard };

// Helper function for relative time
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
