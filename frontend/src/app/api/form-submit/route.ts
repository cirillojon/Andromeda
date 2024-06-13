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

    /*
    const defaultValues = {
          project_name: "Default Project Name",
          project_type: "Default Project Type",
          financing_detail: {},
          user_id: user_id
      };
      const formDataPayload = { form_id, data: defaultValues };
    */
    const formDataPayload = { form_id, data: formData };


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
