import { NextRequest, NextResponse } from 'next/server';

const REMOTE_URL = process.env.REMOTE_URL || "http://167.71.165.9";

export async function POST(request: NextRequest) {
  try {
    const user_id = request.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
    }

    const rawBody = await request.text();
    let formData;
    try {
      formData = JSON.parse(rawBody);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: 'Form data is missing' }, { status: 400 });
    }

    // Extract and validate required fields
    const { project_details, financing_detail = {} } = formData;

    if (!project_details || !project_details.project_name || !project_details.project_type) {
      return NextResponse.json({ error: 'Missing project details' }, { status: 400 });
    }

    // Create form payload
    // Eventually we will include more values in here that were included on the for
    // Parsed from formData like with project_details
    const formPayload = {
      user_id,
      project_name: project_details.project_name,
      project_type: project_details.project_type,
      financing_detail,
    };

    const formResponse = await fetch(`${REMOTE_URL}/api/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });

    if (!formResponse.ok) {
      return NextResponse.json({ error: 'Failed to create form' }, { status: formResponse.status });
    }

    const { form_id } = await formResponse.json();

    if (!form_id) {
      return NextResponse.json({ error: 'Form ID is missing' }, { status: 400 });
    }

    const formDataPayload = { form_id, data: formPayload };

    const formDataResponse = await fetch(`${REMOTE_URL}/api/form_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataPayload),
    });

    if (!formDataResponse.ok) {
      return NextResponse.json({ error: 'Failed to save form data' }, { status: formDataResponse.status });
    }

    const projectPayload = {};

    const projectResponse = await fetch(`${REMOTE_URL}/api/project?user_id=${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectPayload),
    });

    if (!projectResponse.ok) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: projectResponse.status });
    }

    return NextResponse.json({ message: 'Form data and project saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
