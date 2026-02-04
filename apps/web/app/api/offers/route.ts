import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

interface Availability {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
}

interface RequestBody {
  title: string;
  description: string;
  categories: string[];
  offerType: string;
  travelRadius: string;
  neighborhood?: string;
  availability?: Availability;
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

    if (!body.categories || body.categories.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    if (!body.offerType) {
      return NextResponse.json(
        { error: "Offer type is required" },
        { status: 400 }
      );
    }

    if (!body.travelRadius) {
      return NextResponse.json(
        { error: "Travel radius is required" },
        { status: 400 }
      );
    }

    // Create category references
    const categoryRefs = body.categories.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: id, // Required for arrays in Sanity
    }));

    // Create the document in Sanity as a draft (inactive until reviewed)
    const doc = {
      _type: "resourceOffer",
      title: body.title.trim(),
      description: body.description.trim(),
      categories: categoryRefs,
      offerType: body.offerType,
      travelRadius: body.travelRadius,
      status: "paused", // Start as paused until coordinator reviews
      ...(body.neighborhood && { neighborhood: body.neighborhood }),
      ...(body.availability && { availability: body.availability }),
    };

    const result = await writeClient.create(doc);

    return NextResponse.json(
      {
        success: true,
        message: "Offer submitted successfully",
        id: result._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Failed to submit offer. Please try again." },
      { status: 500 }
    );
  }
}
