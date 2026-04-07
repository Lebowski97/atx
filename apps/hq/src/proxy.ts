import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jsx|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|ico|bmp|avif)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
