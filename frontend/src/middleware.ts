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
  console.log(req)
  const user = await getKindeServerSession();
  const isLoggedIn = await user.isAuthenticated();
  const currentUser = await user.getUser();

  //protect the route and redirect unauthorized users
  /*
  if (!isLoggedIn || !currentUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }*/

  //check to see if the user exists
  const getUrl = new URL(`/api/user/${currentUser?.id}`, req.url);
  console.log("URL: " + req.url)
  const response = await fetch(getUrl.toString());
  
  //might need to handle specific response on no user returned
  if (!response.ok) {
    return NextResponse.error(); 
  }

  const data: User = await response.json();

  //create a new user if it doesnt exist
  if (!data || !data.id) {
    console.log("USER DOESNT EXIST")
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