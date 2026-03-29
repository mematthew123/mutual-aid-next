"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  Select,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  FormField,
} from "@/components/ui";
import type { Category } from "@/lib/sanity/types";

interface OfferHelpFormProps {
  categories: Category[];
  neighborhoods: string[];
}

interface Availability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface FormData {
  title: string;
  description: string;
  categories: string[];
  offerType: string;
  travelRadius: string;
  neighborhood: string;
  availability: Availability;
}

interface FormErrors {
  title?: string;
  description?: string;
  categories?: string;
  offerType?: string;
  travelRadius?: string;
}

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

export function OfferHelpForm({ categories, neighborhoods }: OfferHelpFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categories: [],
    offerType: "ongoing",
    travelRadius: "canTravel",
    neighborhood: "",
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.title,
  }));

  const neighborhoodOptions = neighborhoods.map((n) => ({
    value: n,
    label: n,
  }));

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleAvailabilityChange = (day: keyof Availability, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: checked,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please provide a title for your offer";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title should be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe what you're offering";
    } else if (formData.description.length < 20) {
      newErrors.description = "Please provide more details (at least 20 characters)";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    if (!formData.offerType) {
      newErrors.offerType = "Please select an offer type";
    }

    if (!formData.travelRadius) {
      newErrors.travelRadius = "Please select your travel availability";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit offer");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/offers?submitted=true");
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="size-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="size-8 text-forest-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Thank You for Helping!
        </h2>
        <p className="text-stone-600">
          Your offer has been submitted. An organizer will review it soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <FormField
        label="What kind of help can you offer?"
        htmlFor="title"
        required
        error={errors.title}
      >
        <Input
          id="title"
          placeholder="e.g., Grocery shopping assistance, Dog walking, Tutoring"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </FormField>

      {/* Description */}
      <FormField
        label="Tell us more about your offer"
        htmlFor="description"
        description="Share any relevant skills, experience, or limitations."
        required
        error={errors.description}
      >
        <Textarea
          id="description"
          placeholder="Describe what you can help with, any relevant experience, and any limitations..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </FormField>

      {/* Categories */}
      <FormField
        label="What categories does your offer fall under?"
        description="Select all that apply"
        required
        error={errors.categories}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryOptions.map((category) => (
            <Checkbox
              key={category.value}
              label={category.label}
              checked={formData.categories.includes(category.value)}
              onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
            />
          ))}
        </div>
      </FormField>

      {/* Offer Type */}
      <FormField
        label="How often can you help?"
        required
        error={errors.offerType}
      >
        <RadioGroup
          name="offerType"
          value={formData.offerType}
          onChange={(value) => setFormData({ ...formData, offerType: value })}
          orientation="horizontal"
        >
          <RadioGroupItem
            value="oneTime"
            label="One-time"
            description="A single occasion"
          />
          <RadioGroupItem
            value="recurring"
            label="Recurring"
            description="On a regular schedule"
          />
          <RadioGroupItem
            value="ongoing"
            label="Ongoing"
            description="As needed"
          />
        </RadioGroup>
      </FormField>

      {/* Travel Radius */}
      <FormField
        label="Can you travel to help?"
        required
        error={errors.travelRadius}
      >
        <RadioGroup
          name="travelRadius"
          value={formData.travelRadius}
          onChange={(value) => setFormData({ ...formData, travelRadius: value })}
          orientation="horizontal"
        >
          <RadioGroupItem
            value="canTravel"
            label="Can travel"
            description="I can go to them"
          />
          <RadioGroupItem
            value="limited"
            label="Limited"
            description="Nearby only"
          />
          <RadioGroupItem
            value="stationary"
            label="Pickup only"
            description="They come to me"
          />
        </RadioGroup>
      </FormField>

      {/* Neighborhood */}
      <FormField
        label="Neighborhood"
        htmlFor="neighborhood"
        description="This helps us connect you with nearby community members."
      >
        <Select
          id="neighborhood"
          options={neighborhoodOptions}
          placeholder="Select your neighborhood (optional)"
          value={formData.neighborhood}
          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
        />
      </FormField>

      {/* Availability */}
      <FormField
        label="When are you typically available?"
        description="Select the days you're usually free to help"
      >
        <div className="flex flex-wrap gap-3">
          {daysOfWeek.map((day) => (
            <Checkbox
              key={day.key}
              label={day.label.slice(0, 3)}
              checked={formData.availability[day.key]}
              onChange={(e) => handleAvailabilityChange(day.key, e.target.checked)}
            />
          ))}
        </div>
      </FormField>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-700">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>

      {/* Privacy Note */}
      <p className="text-sm text-stone-500 text-center">
        Your offer will be reviewed by an organizer before being posted publicly.
        We&apos;ll only share your contact information with matched requesters.
      </p>
    </form>
  );
}
