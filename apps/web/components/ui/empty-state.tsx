import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card variant="outlined" className={cn("text-center py-12", className)}>
      <CardContent>
        {icon && (
          <div className="flex justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-stone-600 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-stone-500 mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}
        {action && (
          <Button variant="secondary" asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
