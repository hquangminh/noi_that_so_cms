import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';

export async function middleware(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ success: false, message: 'authentication failed' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/order/:path*', '/api/product/:path*'],
};
