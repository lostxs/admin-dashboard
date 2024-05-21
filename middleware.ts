import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/"
]);

export default clerkMiddleware((auth, request) => {
  // if (request.nextUrl.pathname.startsWith("/api/:path*")) return;

  if (isProtectedRoute(request)) auth().protect()
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};