"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationIcon, ClockIcon } from "@/components/icons/category-icons";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { Event } from "@/lib/sanity/types";

export interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

const eventTypeLabels: Record<string, string> = {
  distribution: "Distribution",
  volunteer: "Volunteer Day",
  meeting: "Meeting",
  workshop: "Workshop",
  fundraiser: "Fundraiser",
  social: "Social",
  other: "Event",
};

const eventTypeColors: Record<string, string> = {
  distribution: "bg-forest-100 text-forest-700",
  volunteer: "bg-sage-100 text-sage-700",
  meeting: "bg-stone-100 text-stone-700",
  workshop: "bg-amber-100 text-amber-700",
  fundraiser: "bg-terracotta-100 text-terracotta-700",
  social: "bg-sky-100 text-sky-700",
  other: "bg-stone-100 text-stone-700",
};

const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  ({ className, event, ...props }, ref) => {
    const startDate = new Date(event.startDateTime);
    const endDate = event.endDateTime ? new Date(event.endDateTime) : null;

    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const formattedTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const endTime = endDate
      ? endDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null;

    const locationType = event.location?.type || "inPerson";
    const locationLabel =
      locationType === "virtual"
        ? "Virtual"
        : locationType === "hybrid"
        ? "Hybrid"
        : event.location?.venue || "In-Person";

    const imageUrl = resolveImageUrl(event.image as Record<string, unknown>, { width: 600, height: 400, fit: "crop" });

    return (
      <Card
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Event Image */}
        {imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={event.image?.alt || event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardContent className="pt-6">
          {/* Date Badge */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center size-12 rounded-lg bg-terracotta-50 text-terracotta-700">
                <span className="text-xs font-medium uppercase">
                  {startDate.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">
                  {startDate.getDate()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">
                  {formattedDate}
                </p>
                <p className="text-xs text-stone-500">
                  {formattedTime}
                  {endTime && ` - ${endTime}`}
                </p>
              </div>
            </div>

            {event.eventType && (
              <Badge
                className={cn(
                  "text-xs",
                  eventTypeColors[event.eventType] || eventTypeColors.other
                )}
              >
                {eventTypeLabels[event.eventType] || "Event"}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-1.5">
              <LocationIcon className="size-4" />
              <span>{locationLabel}</span>
            </div>
            {event.isRecurring && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                <span>Recurring</span>
              </div>
            )}
          </div>

          {/* Registration info */}
          {event.registration?.required && (
            <p className="mt-3 text-xs text-terracotta-600 font-medium">
              Registration required
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t border-stone-100">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/events/${event.slug}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };
