import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

export async function POST(req: NextRequest) {
  const { access_token } = await req.json();

  try {
    const response = await client.transactionsGet({
      access_token,
      start_date: "2023-01-01",
      end_date: "2024-01-01",
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    let errorMessage = "An unknown error occurred";
    if (error.response) {
      errorMessage = `Error: ${error.response.data.error_message}`;
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      errorMessage = "No response received from the server.";
      console.error("Request data:", error.request);
    } else {
      errorMessage = error.message;
      console.error("Error message:", error.message);
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
