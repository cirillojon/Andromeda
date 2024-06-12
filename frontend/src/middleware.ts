import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import fetchDbUser from "./utils/api";
import { DbUser } from "./utils/interfaces";

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
  if (dbUser === null || (dbUser.message && dbUser.message === "User not found")) {
    const postUrl = new URL(`/api/user`, req.url);
    const response = await fetch(postUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser?.email,
        name: currentUser?.given_name,
        sso_token: currentUser?.id,
      }),
    });

    if (!response.ok) {
      console.error('Failed to create user:', response.statusText);
      return NextResponse.json({ error: 'Failed to create user' }, { status: response.status });
    }

    dbUser = await fetchDbUser(currentUser.id);
  }

  if (!dbUser) {
    console.error('User not found after creation attempt');
    return NextResponse.json({ error: 'User not found' }, { status: 500 });
  }

  const userId = dbUser.id;
  const response = NextResponse.next();
  response.headers.set('x-user-id', userId);
  console.log('User ID added to headers:', userId);

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/form-submit"],
};
