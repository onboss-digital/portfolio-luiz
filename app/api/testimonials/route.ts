import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, role, text, stars } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
    }
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json({ error: "Comentário muito curto." }, { status: 400 });
    }
    const rating = Number(stars);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Nota inválida." }, { status: 400 });
    }

    await prisma.testimonial.create({
      data: {
        name:     name.trim(),
        role:     role?.trim() || null,
        text:     text.trim(),
        stars:    rating,
        isActive: false, // aguarda aprovação no admin
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/testimonials]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
