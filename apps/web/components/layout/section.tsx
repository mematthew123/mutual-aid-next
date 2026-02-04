import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "accent" | "white";
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "lg", background = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          // Vertical spacing
          {
            "py-12 sm:py-16": spacing === "sm",
            "py-16 sm:py-20": spacing === "md",
            "py-20 sm:py-24": spacing === "lg",
            "py-24 sm:py-32": spacing === "xl",
          },

          // Background variants
          {
            "bg-transparent": background === "default",
            "bg-stone-100": background === "muted",
            "bg-mint-100": background === "accent",
            "bg-white": background === "white",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export { Section };
