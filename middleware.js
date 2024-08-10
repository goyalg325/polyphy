import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
  const access_token = request.cookies.get('token')?.value;

  if (!access_token) {
    console.log('There is no token for the middleware for admin');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const token = access_token.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    console.log('Token verified for user:', payload.username);
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
