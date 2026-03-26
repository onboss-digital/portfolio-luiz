import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectList from "@/components/portfolio/ProjectList";
import AllProjectsGrid from "@/components/portfolio/AllProjectsGrid";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch data from database
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  // Projetos em destaque (max 3) — primeira dobra
  const featuredProjects = await prisma.project.findMany({
    where: { isFeatured: true },
    orderBy: { order: 'asc' },
    take: 3,
  });

  // Todos os projetos — segunda dobra
  const allProjects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/20 transition-colors duration-700">
      
      {/* Background Quantum Aura Glows - Animated */}
      <div className="absolute top-0 left-1/2 w-full max-w-4xl h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 animate-[aura-float_15s_infinite_ease-in-out]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-zinc-800/5 dark:bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none z-0 animate-[aura-float_20s_infinite_reverse_ease-in-out]"></div>

      <main id="inicio" className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        
        <Navbar />

        {/* 1a Dobra: Hero + Projetos em Destaque */}
        <div id="projetos" className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mt-32">
            <HeroSection settings={settings} />
            <ProjectList projects={featuredProjects} />
        </div>

        {/* 2a Dobra: Todos os Projetos (grid 4 colunas) */}
        <div className="mt-32">
          <AllProjectsGrid projects={allProjects} />
        </div>

        <div id="avaliacoes" className="mt-32">
          <TestimonialsSection testimonials={testimonials} />
        </div>

        {/* Footer Premium */}
        <footer className="mt-32 relative">
          {/* Glow superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Marca */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-surface-border flex-shrink-0 shadow-md">
                  <img src="/luiz.jpeg" alt="Luiz Longhi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm tracking-tight">Luiz Longhi</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Transformando ideias em realidade</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                Construindo produtos digitais de alta performance com foco em design, escalabilidade e resultados reais.
              </p>
            </div>

            {/* Navegação */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Navegação</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Início",    href: "#inicio"     },
                  { label: "Projetos",  href: "#projetos"   },
                  { label: "Avaliações",href: "#avaliacoes" },
                ].map(({ label, href }) => (
                  <a key={href} href={href} className="text-sm text-zinc-500 hover:text-primary transition-colors duration-300 font-medium w-fit">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contato */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Contato</p>
              <a
                href="mailto:onbossdigital@gmail.com"
                className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary transition-colors duration-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                onbossdigital@gmail.com
              </a>
              <a
                href="https://www.instagram.com/oluiz.business/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-primary transition-colors duration-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                @oluiz.business
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-surface-border pt-8 pb-6 flex flex-col items-center gap-3 text-[12px] text-zinc-600">
            <p className="italic text-center text-zinc-500 text-[13px]">
              "Deus disse: Eu irei com você, e lhe darei vitória." &mdash; Êxodo 33:14
            </p>
            <p className="text-center opacity-60">© {new Date().getFullYear()} Luiz Boss. Todos os direitos reservados.</p>
          </div>
        </footer>

      </main>
    </div>
  );
}
