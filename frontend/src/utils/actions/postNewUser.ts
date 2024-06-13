"use server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { DbUser } from "../interfaces";

const postNewUser = async (currentUser: KindeUser): Promise<DbUser | null> => {
  const postNewUserUrl = new URL(
    `/api/user`,
    process.env.NEXT_FRONTEND_BASE_URL
  ).toString();
  try {
    const response = await fetch(postNewUserUrl.toString(), {
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
      throw new Error(`Error creating user: ${response.statusText}`);
    }
    const user: DbUser = await response.json();
    return user;
  } catch (error) {
    console.error(`Failed to create user with id: ${currentUser.id}`, error);
    return null;
  }
};

export default postNewUser;
