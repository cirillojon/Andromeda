"use server";
import { cookies } from "next/headers";
import NextCrypto from "next-crypto";

export default async function saveFormDataToCookies (formData: string) {
  const crypto = new NextCrypto('secret key');
  const encrypted = await crypto.encrypt(formData);
  cookies().set("formData", encrypted);
}