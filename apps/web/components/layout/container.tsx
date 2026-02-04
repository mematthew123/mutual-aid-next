import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - centered with horizontal padding
          "mx-auto w-full px-4 sm:px-6 lg:px-8",

          // Max width variants
          {
            "max-w-2xl": size === "sm",     // 672px
            "max-w-4xl": size === "md",     // 896px
            "max-w-6xl": size === "lg",     // 1152px
            "max-w-7xl": size === "xl",     // 1280px
            "max-w-none": size === "full",  // Full width
          },

          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container };
