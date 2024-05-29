import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface User {
  id: string,
  email: string,
  name: string,
  created_at: string,
}

export async function middleware(req: NextRequest) {
  const user = await getKindeServerSession(req);
  const isLoggedIn = await user.isAuthenticated();
  const currentUser = await user.getUser();

  //protect the route and redirect unauthorized users
  /*
  if (!isLoggedIn || !currentUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }*/

  //check to see if the user exists
  const response = await fetch(`/api/user/`);
  
  //might need to handle specific response on no user returned
  if (!response.ok) {
    console.log(response.statusText);
    return NextResponse.error(); 
  }

  const data: User = await response.json();

  //create a new user if it doesnt exist
  if (!data || !data.id) {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser.email,
        name: currentUser.given_name,
        sso_token: currentUser.id,
      })
    });

    if (!response.ok) {
      return NextResponse.error(); 
    }
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
// This applies to the dashboard route and any sub-routes
export const config = {
  matcher: ["/dashboard/:path*"],
};