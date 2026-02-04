import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          "w-full rounded-xl px-4 py-3 text-base min-h-32 resize-y",
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

Textarea.displayName = "Textarea";

export { Textarea };
