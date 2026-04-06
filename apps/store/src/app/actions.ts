"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function validateAndSetCookie(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const passcode = formData.get("passcode") as string;

  if (!passcode || passcode.trim() === "") {
    return { error: "Please enter a passcode." };
  }

  const isValid = await convex.query(api.settings.validatePasscode, {
    passcode: passcode.trim(),
  });

  if (!isValid) {
    return { error: "Invalid passcode. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set("tt-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect("/menu");
}
