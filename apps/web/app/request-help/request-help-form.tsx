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
  FormField,
} from "@/components/ui";
import type { Category } from "@/lib/sanity/types";

interface RequestHelpFormProps {
  categories: Category[];
  neighborhoods: string[];
}

interface FormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  neighborhood: string;
  contactPreference: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  urgency?: string;
  contactPreference?: string;
}

export function RequestHelpForm({ categories, neighborhoods }: RequestHelpFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
    neighborhood: "",
    contactPreference: "throughCoordinator",
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

  const urgencyOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please provide a title for your request";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title should be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe what you need";
    } else if (formData.description.length < 20) {
      newErrors.description = "Please provide more details (at least 20 characters)";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.urgency) {
      newErrors.urgency = "Please select an urgency level";
    }

    if (!formData.contactPreference) {
      newErrors.contactPreference = "Please select how you'd like to be contacted";
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
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/requests?submitted=true");
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
          Request Submitted!
        </h2>
        <p className="text-stone-600">
          Thank you for reaching out. An organizer will review your request soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <FormField
        label="What do you need help with?"
        htmlFor="title"
        required
        error={errors.title}
      >
        <Input
          id="title"
          placeholder="e.g., Groceries for the week, ride to doctor's appointment"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </FormField>

      {/* Description */}
      <FormField
        label="Tell us more about your situation"
        htmlFor="description"
        description="The more details you provide, the better we can match you with help."
        required
        error={errors.description}
      >
        <Textarea
          id="description"
          placeholder="Please share any helpful details about your request..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </FormField>

      {/* Category & Urgency */}
      <div className="grid sm:grid-cols-2 gap-6">
        <FormField
          label="Category"
          htmlFor="category"
          required
          error={errors.category}
        >
          <Select
            id="category"
            options={categoryOptions}
            placeholder="Select a category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </FormField>

        <FormField
          label="Urgency"
          htmlFor="urgency"
          required
          error={errors.urgency}
        >
          <Select
            id="urgency"
            options={urgencyOptions}
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
          />
        </FormField>
      </div>

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

      {/* Contact Preference */}
      <FormField
        label="How would you like to be contacted?"
        required
        error={errors.contactPreference}
      >
        <RadioGroup
          name="contactPreference"
          value={formData.contactPreference}
          onChange={(value) => setFormData({ ...formData, contactPreference: value })}
        >
          <RadioGroupItem
            value="throughCoordinator"
            label="Through an organizer"
            description="A trusted team member will facilitate the connection"
          />
          <RadioGroupItem
            value="direct"
            label="Direct contact"
            description="Community members can reach out to you directly"
          />
          <RadioGroupItem
            value="anonymous"
            label="Keep me anonymous"
            description="Your identity will be protected"
          />
        </RadioGroup>
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
          {isSubmitting ? "Submitting..." : "Submit Request"}
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
        Your request will be reviewed by an organizer before being posted publicly.
        We never share your personal information without your consent.
      </p>
    </form>
  );
}
