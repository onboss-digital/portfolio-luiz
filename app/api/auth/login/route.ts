import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || "luiz-boss-secret-key-2026";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Credenciais não encontradas ou inválidas." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: admin.id, email: admin.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    cookies().set("luiz_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, message: "Acesso autorizado." });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro crítico no servidor de Autenticação." }, { status: 500 });
  }
}
