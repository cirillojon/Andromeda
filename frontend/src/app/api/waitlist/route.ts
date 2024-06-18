import { NextRequest, NextResponse } from "next/server";

const REMOTE_URL = process.env.REMOTE_URL || "http://167.71.165.9";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let formData;
    try {
      formData = JSON.parse(rawBody);
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json(
        { error: "Form data is missing" },
        { status: 400 }
      );
    }

    // Extract and validate required fields
    const {
      email,
      name,
      contactPhone,
      location,
      serviceInterest,
    } = formData;

    if (!email || !name || !contactPhone || !location || !serviceInterest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      contact_email: email,
      name,
      contact_phone: contactPhone,
      location,
      service_interest: serviceInterest,
    };

    const response = await fetch(`${REMOTE_URL}/api/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create waitlist entry" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Waitlist entry created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
