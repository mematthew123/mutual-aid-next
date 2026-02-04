import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && <span className="text-terracotta-500">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-stone-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-terracotta-500 flex items-center gap-1">
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
