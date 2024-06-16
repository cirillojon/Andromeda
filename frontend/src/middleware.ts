import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import fetchDbUser from "./utils/api";
import { DbUser } from "./utils/interfaces";
import postNewUser from "./utils/actions/postNewUser";
import { cookies } from "next/headers";
import NextCrypto from "next-crypto";

export async function middleware(req: NextRequest) {
  const user = await getKindeServerSession();
  const isLoggedIn = await user.isAuthenticated();
  const currentUser = await user.getUser();

  //protect the route and redirect unauthorized users
  if (!isLoggedIn || !currentUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check if the user exists in the database
  let dbUser: DbUser | null = await fetchDbUser(currentUser.id);
  if (
    dbUser === null ||
    (dbUser.message && dbUser.message === "User not found")
  ) {
    const response = await postNewUser(currentUser);
    if (response === null) {
      console.error("Failed to create user: ", currentUser.id);
      return NextResponse.json({ error: "Failed to create user" });
    }
    dbUser = await fetchDbUser(currentUser.id);
  }

  if (!dbUser) {
    console.error("User not found after creation attempt");
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const formData = cookies().get("formData");

  if (typeof formData?.value === "string") {
    const secretKey = process.env.NEXT_FORMDATA_COOKIES_SK;
    const crypto = new NextCrypto(secretKey || "secret key");
    const decrypted = await crypto.decrypt(formData.value);
    if (decrypted) {
      const formSubmitUrl = new URL(
        "/api/form-submit",
        process.env.NEXT_FRONTEND_BASE_URL
      ).toString();
      try {
        const response = await fetch(formSubmitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": dbUser.id,
          },
          body: decrypted,
        });

        if (!response.ok) {
          throw new Error("Failed to submit form data");
        }
        const returnedResponse = NextResponse.next();
        returnedResponse.cookies.delete("formData");
        return returnedResponse;
      } catch (error) {
        console.error("Error posting form data:", error);
      }
    }
  }

  return NextResponse.next();
}
// Apply middleware to protected routes
// This applies to the dashboard route and any sub-routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
