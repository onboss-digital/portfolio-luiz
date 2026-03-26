"use client";

import React from "react";
import { Zap, Star, Layers, MessageSquare } from "lucide-react";

export default function ServicesSection() {
  const specialties = ["Estratégia de Posicionamento", "Funis de Vendas", "IA & Automação"];
  const tech = ["React", "Node.js", "Python", "WordPress", "Next.js", "Tailwind"];

  return (
    <section className="mt-32 w-full max-w-5xl mx-auto px-0 relative selection:bg-primary/20">
      
      {/* Título de Seção UI/UX Pro Max - Centered Mobile */}
      <div className="flex items-center justify-center md:justify-start gap-3 text-primary mb-10 md:ml-6 group cursor-default">
         <div className="p-3 rounded-xl bg-primary/10 glass-aura border-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-5 h-5" strokeWidth={1.5} />
         </div>
         <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Consultoria</h2>
      </div>

      {/* Main Services Card - Full Width Mobile Context */}
      <div className="card-aura group flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left">
        
        {/* Deep Backdrop Glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-all duration-1000"></div>

        <div className="flex-1 relative z-10 flex flex-col items-center lg:items-start">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-featured font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
             Arquitetura & <br className="hidden md:block" /> Engenharia Técnica
          </h3>
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-2xl font-medium mb-12 opacity-90">
            Mentoria personalizada, estruturação de fluxos e code review de alto impacto para elevar o nível técnico do seu produto.
          </p>

          <div className="flex flex-col gap-12 w-full">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-zinc-500 mb-6">
                <Star className="w-5 h-5 text-primary opacity-60" strokeWidth={1.5} />
                <span className="text-lg font-bold tracking-tight">Foco de Atuação</span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {specialties.map(s => (
                  <span key={s} className="px-5 py-2.5 rounded-2xl glass-aura border-surface-border text-base text-zinc-500 dark:text-zinc-200 hover:text-primary hover:border-primary/20 transition-all duration-500 cursor-default">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-zinc-500 mb-6">
                <Layers className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                <span className="text-lg font-bold tracking-tight">Ecosistema & Stack</span>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {tech.map(t => (
                  <span key={t} className="px-5 py-2.5 rounded-2xl glass-aura border-surface-border text-base text-zinc-500 dark:text-zinc-200 hover:text-primary hover:border-primary/20 transition-all duration-500 cursor-default">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investment & CTA Box - Literal Centering */}
        <div className="flex flex-col lg:items-end lg:text-right pt-10 lg:pt-0 relative z-10 lg:w-80 w-full justify-between items-center lg:items-end border-t border-surface-border lg:border-t-0 mt-12 lg:mt-0">
          <div className="flex flex-col text-center lg:text-right mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 opacity-60 mb-2">Investimento Estimado</span>
            <span className="text-4xl font-featured font-bold tracking-tighter">Sob consulta</span>
            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:via-primary/0 lg:to-primary/30"></div>
          </div>

          <button 
            className="btn-primary w-full flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
            Agendar Sessão
          </button>
        </div>
      </div>
    </section>
  );
}
