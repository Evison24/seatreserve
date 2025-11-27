import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected =
    pathname.startsWith('/events') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/admin');

  if (!token && isProtected) {
    const loginUrl = new URL('/auth/signin', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/events', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/events/:path*', '/bookings/:path*', '/admin/:path*'],
};
