"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/sanity/types";

export interface FilterBarProps {
  categories: Category[];
  neighborhoods: string[];
  showUrgency?: boolean;
  basePath: string;
}

const urgencyOptions = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function FilterBar({
  categories,
  neighborhoods,
  showUrgency = false,
  basePath,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentUrgency = searchParams.get("urgency") || "";
  const currentNeighborhood = searchParams.get("neighborhood") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`${basePath}${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    router.push(basePath);
  };

  const hasActiveFilters = currentCategory || currentUrgency || currentNeighborhood;

  const categoryOptions = categories.map((cat) => ({
    value: cat.slug.current,
    label: cat.title,
  }));

  const neighborhoodOptions = neighborhoods.map((n) => ({
    value: n,
    label: n,
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex flex-wrap gap-3 flex-1">
        <Select
          options={categoryOptions}
          placeholder="All Categories"
          value={currentCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full sm:w-44"
        />

        {showUrgency && (
          <Select
            options={urgencyOptions}
            placeholder="Any Urgency"
            value={currentUrgency}
            onChange={(e) => handleFilterChange("urgency", e.target.value)}
            className="w-full sm:w-40"
          />
        )}

        {neighborhoods.length > 0 && (
          <Select
            options={neighborhoodOptions}
            placeholder="All Neighborhoods"
            value={currentNeighborhood}
            onChange={(e) => handleFilterChange("neighborhood", e.target.value)}
            className="w-full sm:w-48"
          />
        )}
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-stone-500 hover:text-stone-700"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
