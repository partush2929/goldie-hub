import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const username = process.env.AUTH_USER;
  const password = process.env.AUTH_PASS;

  // Skip auth if credentials are not set
  if (!username || !password) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('401 Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Restricted Area"',
      },
    });
  }

  // Decode the base64 credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [user, pass] = credentials.split(':');

  if (user === username && pass === password) {
    return NextResponse.next();
  }

  return new NextResponse('401 Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Restricted Area"',
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

