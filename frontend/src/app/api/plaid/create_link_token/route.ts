import { NextResponse } from "next/server";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} from "plaid";

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

export async function GET() {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "unique-user-id",
      },
      client_name: "Your App Name",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({ link_token: response.data.link_token });
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
