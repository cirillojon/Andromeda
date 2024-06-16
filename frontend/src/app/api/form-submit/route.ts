import { NextRequest, NextResponse } from "next/server";

const REMOTE_URL = process.env.REMOTE_URL || "http://167.71.165.9";

export async function POST(request: NextRequest) {
  try {
    const user_id = request.headers.get("x-user-id");
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

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
    const { solar, roofing, battery, financing_detail = {} } = formData;

    const projects = [solar, roofing, battery];
    const countProjects = projects.filter(
      (project) => project && project.project_name
    ).length;

    if (countProjects === 0) {
      return NextResponse.json(
        { error: "Missing project details" },
        { status: 400 }
      );
    }

    // Create form payload
    // Eventually we will include more values in here that were included on the for
    // Parsed from formData like with project_details
    // pass the JSON to form

    const formResponse = await fetch(`${REMOTE_URL}/api/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!formResponse.ok) {
      return NextResponse.json(
        { error: "Failed to create form" },
        { status: formResponse.status }
      );
    }

    const { form_id } = await formResponse.json();

    if (!form_id) {
      return NextResponse.json(
        { error: "Form ID is missing" },
        { status: 400 }
      );
    }

    const formDataPayload = {
      form_id: form_id,
      data: {
        solar: {
          ...solar,
          financing_detail,
          user_id,
        },
        roofing: {
          ...roofing,
          financing_detail,
          user_id,
        },
        battery: {
          ...battery,
          financing_detail,
          user_id,
        },
      },
    };
    const formDataResponse = await fetch(`${REMOTE_URL}/api/form_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataPayload),
    });

    if (!formDataResponse.ok) {
      return NextResponse.json(
        { error: "Failed to Create FormData, Form_id: ", form_id },
        { status: formDataResponse.status }
      );
    }

    const projectResponse = await fetch(
      `${REMOTE_URL}/api/project?user_id=${user_id}`,
      {
        method: "POST",
      }
    );

    if (!projectResponse.ok) {
      return NextResponse.json(
        { error: "Failed to Create Projects from FormData" },
        { status: projectResponse.status }
      );
    }

    return NextResponse.json(
      { message: "Form data and project saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
