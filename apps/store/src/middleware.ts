import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  STOREFRONT_SESSION_COOKIE_NAME,
  verifyStorefrontSessionToken,
} from "./lib/storefront-session";

const protectedPaths = ["/menu", "/order", "/confirmation"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get(STOREFRONT_SESSION_COOKIE_NAME);
  let isValidSession = false;

  try {
    isValidSession = await verifyStorefrontSessionToken(session?.value);
  } catch (error) {
    console.error("Storefront session validation failed", error);
  }

  if (!isValidSession) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(STOREFRONT_SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/menu/:path*", "/order/:path*", "/confirmation/:path*"],
};
