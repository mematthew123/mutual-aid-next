import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

interface RequestBody {
  title: string;
  description: string;
  category: string;
  urgency: string;
  neighborhood?: string;
  contactPreference: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!body.urgency) {
      return NextResponse.json(
        { error: "Urgency is required" },
        { status: 400 }
      );
    }

    if (!body.contactPreference) {
      return NextResponse.json(
        { error: "Contact preference is required" },
        { status: 400 }
      );
    }

    // Create the document in Sanity as a draft
    const doc = {
      _type: "resourceRequest",
      title: body.title.trim(),
      description: body.description.trim(),
      category: {
        _type: "reference",
        _ref: body.category,
      },
      urgency: body.urgency,
      status: "open",
      isPublic: false, // Start as not public, coordinator reviews first
      contactPreference: body.contactPreference,
      ...(body.neighborhood && { neighborhood: body.neighborhood }),
    };

    const result = await writeClient.create(doc);

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted successfully",
        id: result._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}
