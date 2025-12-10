import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

  // Skip auth if credentials not configured
  if (!basicAuthUser || !basicAuthPassword) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const authValue = authHeader.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === basicAuthUser && pwd === basicAuthPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Meta Dashboard"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
