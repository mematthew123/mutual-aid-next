"use client";

import { forwardRef, createContext, useContext, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function RadioGroup({
  name,
  value,
  onChange,
  children,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div
        role="radiogroup"
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-4",
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  label: string;
  description?: string;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, description, className, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const isSelected = context.value === value;

    return (
      <label
        className={cn(
          "relative flex items-start gap-3 cursor-pointer group",
          "p-4 rounded-xl border-2 transition-all",
          isSelected
            ? "border-forest-500 bg-forest-50"
            : "border-stone-200 bg-white hover:border-stone-300",
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          name={context.name}
          value={value}
          checked={isSelected}
          onChange={() => context.onChange(value)}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
            isSelected
              ? "border-forest-500 bg-forest-500"
              : "border-stone-300 group-hover:border-stone-400"
          )}
        >
          {isSelected && (
            <div className="size-2 rounded-full bg-white" />
          )}
        </div>
        <div className="flex-1">
          <span className={cn(
            "font-medium",
            isSelected ? "text-forest-700" : "text-stone-700"
          )}>
            {label}
          </span>
          {description && (
            <p className="text-sm text-stone-500 mt-0.5">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";
