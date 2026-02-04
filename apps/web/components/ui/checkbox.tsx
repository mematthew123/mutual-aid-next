"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "relative flex items-start gap-3 cursor-pointer group",
          className
        )}
      >
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "size-5 rounded-md border-2 flex items-center justify-center transition-all",
              "border-stone-300 bg-white",
              "peer-checked:border-forest-500 peer-checked:bg-forest-500",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-forest-500/40 peer-focus-visible:ring-offset-2",
              "group-hover:border-stone-400 peer-checked:group-hover:border-forest-600"
            )}
          >
            <svg
              className="size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-6" />
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1 pt-0.5">
            {label && (
              <span className="font-medium text-stone-700">{label}</span>
            )}
            {description && (
              <p className="text-sm text-stone-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
