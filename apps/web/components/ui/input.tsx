import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // Base styles
          "w-full rounded-xl px-4 py-3 text-base",
          "bg-white border border-stone-300",
          "text-stone-800 placeholder:text-stone-400",

          // Focus state
          "focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20",

          // Transitions
          "transition-colors duration-150",

          // Error state
          error && "border-terracotta-500 focus:border-terracotta-500 focus:ring-terracotta-500/20",

          // Disabled state
          "disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
