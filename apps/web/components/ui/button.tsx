import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "urgent";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 font-medium transition-all",
          "rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",

          // Size variants
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },

          // Color variants
          {
            // Primary - Forest green background
            "bg-forest-500 text-white hover:bg-forest-600 active:bg-forest-700 shadow-sm hover:shadow-md":
              variant === "primary",

            // Secondary - Sage green background
            "bg-sage-200 text-forest-700 hover:bg-sage-300 active:bg-sage-400":
              variant === "secondary",

            // Outline - Transparent with border
            "bg-transparent text-forest-600 border-2 border-forest-500 hover:bg-forest-50 active:bg-forest-100":
              variant === "outline",

            // Ghost - Subtle, no border
            "bg-transparent text-forest-600 hover:bg-forest-50 active:bg-forest-100":
              variant === "ghost",

            // Urgent - Terracotta for important actions
            "bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700 shadow-sm hover:shadow-md":
              variant === "urgent",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
