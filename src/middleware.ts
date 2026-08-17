import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyTokenEdge(token) : null;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLokerSaya = pathname.startsWith("/loker-saya");

  if ((isDashboard || isLokerSaya) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isDashboard && session && session.role !== "MARKETER") {
    const url = req.nextUrl.clone();
    url.pathname = "/loker";
    return NextResponse.redirect(url);
  }

  if (isLokerSaya && session && session.role !== "PENCARI_KERJA") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/loker-saya/:path*"],
};
