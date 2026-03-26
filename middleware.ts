import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "luiz-boss-secret-key-2026";

export async function middleware(request: NextRequest) {
  // Só protege o que entra na rota do painel (/admin/...)
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Deixa a porta de entrada (Login) acessível livremente
  if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/setup') {
    return NextResponse.next();
  }

  // Puxa a sessão do cookie
  const token = request.cookies.get('luiz_admin_session')?.value;

  if (!token) {
    // Redireciona para login se não houver token
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (err) {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
