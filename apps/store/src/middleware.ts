import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/menu", "/order", "/confirmation"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("tt-session");

  if (!session || session.value !== "authenticated") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/menu/:path*", "/order/:path*", "/confirmation/:path*"],
};
