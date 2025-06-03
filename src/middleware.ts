import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/register');
  const isRecipePage = request.nextUrl.pathname.startsWith('/recipes');
  const isApiRecipePage = request.nextUrl.pathname.startsWith('/api/recipes');

  if (!isAuth && (isRecipePage || isApiRecipePage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/recipes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/recipes/:path*',
    '/api/recipes/:path*',
    '/login',
    '/register',
  ],
};