import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), "public/uploads");
    
    // Garantir que a pasta existe (redundante se já criamos no Step anterior mas bom ter aqui)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);
    
    // Retornar a URL relativa
    const url = `/uploads/${fileName}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro ao processar o upload." }, { status: 500 });
  }
}
