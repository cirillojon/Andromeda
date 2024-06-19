"use server";
import { cookies } from "next/headers";
import NextCrypto from "next-crypto";

export default async function saveFormDataToCookies(formData: string) {
  const secretKey = process.env.NEXT_FORMDATA_COOKIES_SK;
  const crypto = new NextCrypto(secretKey || "secret key");
  const encrypted = await crypto.encrypt(formData);
  cookies().set("formData", encrypted);
}
