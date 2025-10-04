import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const access_token = request.cookies.get('access_token')?.value;

  if (!access_token) {
    return NextResponse.redirect(new URL('/login?error=no_token', request.url));
  }

  try {

    const payload = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString());
    if (payload.role !== '15813709-24e6-4868-b913-022dc9b31d8e') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  } catch (error) {
    console.error('Middleware JWT Error:', error);
    return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/products/edit/:path*',
};
