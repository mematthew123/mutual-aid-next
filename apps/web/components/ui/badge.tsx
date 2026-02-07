import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "urgent" | "info";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium rounded-full",

          // Size variants
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-3 py-1 text-sm": size === "md",
          },

          // Color variants
          {
            // Default - Subtle sage
            "bg-sage-100 text-sage-700": variant === "default",

            // Secondary - Stone/neutral
            "bg-stone-100 text-stone-600": variant === "secondary",

            // Outline - Transparent with border
            "bg-transparent border border-stone-300 text-stone-600": variant === "outline",

            // Success - Forest green
            "bg-forest-100 text-forest-700": variant === "success",

            // Warning - Wheat/gold
            "bg-wheat-100 text-wheat-700": variant === "warning",

            // Urgent - Terracotta
            "bg-terracotta-100 text-terracotta-700": variant === "urgent",

            // Info - Blue tint
            "bg-sky-100 text-sky-700": variant === "info",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };

// Urgency-specific badge for requests
export interface UrgencyBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  urgency: "low" | "medium" | "high" | "critical";
}

const UrgencyBadge = forwardRef<HTMLSpanElement, UrgencyBadgeProps>(
  ({ className, urgency, ...props }, ref) => {
    const labels = {
      low: "Low Priority",
      medium: "Medium",
      high: "High Priority",
      critical: "URGENT",
    };

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full",

          // Urgency colors
          {
            "bg-sage-100 text-sage-700": urgency === "low",
            "bg-wheat-100 text-wheat-700": urgency === "medium",
            "bg-terracotta-100 text-terracotta-700": urgency === "high",
            "bg-red-100 text-red-700 animate-pulse": urgency === "critical",
          },

          className
        )}
        {...props}
      >
        {props.children || labels[urgency]}
      </span>
    );
  }
);

UrgencyBadge.displayName = "UrgencyBadge";

export { UrgencyBadge };
