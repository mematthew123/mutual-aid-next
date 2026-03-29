"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { DonationCampaign } from "@/lib/sanity/types";

export interface CampaignCardProps extends HTMLAttributes<HTMLDivElement> {
  campaign: DonationCampaign;
}

const campaignTypeLabels: Record<string, string> = {
  general: "General Fund",
  emergency: "Emergency",
  specific: "Specific Cause",
  recurring: "Monthly",
};

const CampaignCard = forwardRef<HTMLDivElement, CampaignCardProps>(
  ({ className, campaign, ...props }, ref) => {
    const goal = campaign.goal?.amount || 0;
    const current = campaign.goal?.currentAmount || 0;
    const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    const showProgress = campaign.goal?.showProgress && campaign.goal?.hasGoal;
    const imageUrl = resolveImageUrl(campaign.image as Record<string, unknown>, { width: 600, height: 400, fit: "crop" });

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          campaign.status === "goalReached" && "border-forest-300",
          className
        )}
        {...props}
      >
        {/* Campaign Image */}
        {imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={campaign.image?.alt || campaign.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardContent className="pt-6">
          {/* Type & Status */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              {campaign.campaignType && (
                <Badge
                  variant={campaign.campaignType === "emergency" ? "urgent" : "secondary"}
                  size="sm"
                >
                  {campaignTypeLabels[campaign.campaignType] || "Campaign"}
                </Badge>
              )}
            </div>
            {campaign.status === "goalReached" && (
              <Badge variant="success" size="sm">
                Goal Reached!
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-800 mb-3">
            {campaign.title}
          </h3>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-wheat-600">
                  ${current.toLocaleString()}
                </span>
                <span className="text-stone-500">
                  of ${goal.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-wheat-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {Math.round(progress)}% funded
              </p>
            </div>
          )}

          {/* Timeline */}
          {campaign.timeline?.endDate && !campaign.timeline.isOngoing && (
            <p className="text-sm text-stone-500">
              Ends {new Date(campaign.timeline.endDate).toLocaleDateString()}
            </p>
          )}
          {campaign.timeline?.isOngoing && (
            <p className="text-sm text-stone-500">Ongoing campaign</p>
          )}

          {/* In-kind donations */}
          {campaign.acceptsInKind && (
            <p className="text-sm text-amber-600 mt-2">
              Also accepting in-kind donations
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t border-stone-100">
          <Button className="w-full" asChild>
            <Link href={`/donate/${campaign.slug}`}>Donate Now</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

CampaignCard.displayName = "CampaignCard";

export { CampaignCard };
