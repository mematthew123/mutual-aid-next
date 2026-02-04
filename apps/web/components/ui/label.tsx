import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-stone-700 block mb-2",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };
