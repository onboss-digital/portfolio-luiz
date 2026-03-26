import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/portfolio/Navbar";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Avaliações - Luiz Longhi",
  description: "Todos os depoimentos e avaliações de clientes e parceiros.",
};

export default async function AvaliacoesPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/20 transition-colors duration-700">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 w-full max-w-4xl h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 animate-[aura-float_15s_infinite_ease-in-out]" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-zinc-800/5 dark:bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none z-0" />

      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        <Navbar />

        {/* Breadcrumb */}
        <div className="mt-16 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Voltar ao portfolio
          </Link>
        </div>

        <TestimonialsSection testimonials={testimonials} showAll />

        {/* Footer simples */}
        <footer className="mt-24 pt-8 pb-12 border-t border-surface-border flex justify-between items-center text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Luiz Longhi.</p>
          <Link href="/" className="hover:text-primary transition-colors">Voltar ao início</Link>
        </footer>
      </main>
    </div>
  );
}
