"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getStorefrontServerSecret } from "../lib/storefront-server";
import {
  STOREFRONT_SESSION_COOKIE_NAME,
  STOREFRONT_SESSION_MAX_AGE_SECONDS,
  createStorefrontSessionToken,
} from "../lib/storefront-session";

export async function validateAndSetCookie(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const passcode = formData.get("passcode") as string;

  if (!passcode || passcode.trim() === "") {
    return { error: "Please enter a passcode." };
  }

  const isValid = await fetchQuery(api.settings.validatePasscode, {
    passcode: passcode.trim(),
    storefrontSecret: getStorefrontServerSecret(),
  });

  if (!isValid) {
    return { error: "Invalid passcode. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    STOREFRONT_SESSION_COOKIE_NAME,
    await createStorefrontSessionToken(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: STOREFRONT_SESSION_MAX_AGE_SECONDS,
    },
  );

  redirect("/menu");
}
