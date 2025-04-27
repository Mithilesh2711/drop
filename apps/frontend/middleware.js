import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  console.log("Current path:", path);

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path.startsWith("/auth");
  console.log("Is public path:", isPublicPath);

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;
  console.log("Token exists:", !!token);

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("Token expiration:", new Date(decodedToken.exp * 1000));
      console.log("Current time:", new Date());
      
      if (decodedToken.exp < Date.now() / 1000) {
        console.log("Token expired");
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    console.log("Public path with token, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is protected and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    console.log("Protected path without token, redirecting to login");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }

  console.log("Allowing access to:", path);
  return NextResponse.next();
}

// Configure the paths that should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
