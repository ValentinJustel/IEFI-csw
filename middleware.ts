import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verificamos si existe la cookie de sesión de Better Auth
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Si intenta entrar al dashboard y NO tiene token, lo enviamos al login
  if (request.nextUrl.pathname.startsWith("/dashboard") && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};