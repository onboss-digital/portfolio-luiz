"use client";

import React from "react";
import Image from "next/image";
import { Youtube, MessageCircle, Linkedin, Instagram } from "lucide-react";

interface HeroSectionProps {
  settings: any;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const stack = settings?.heroStack 
    ? settings.heroStack.split(",").filter(Boolean).map((s: string) => s.trim()) 
    : ["SaaS", "IA", "Supabase", "Stripe", "NextJS"];

  return (
    <section className="md:col-span-6 lg:col-span-5 selection:bg-primary/20 flex flex-col items-center md:items-start text-center md:text-left">
      
      {/* Profile Image - Refined Technical Stacked Border */}
      <div className="relative inline-block group">
        <div className="w-44 h-44 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-surface-border bg-surface transition-transform duration-700 group-hover:scale-[1.02]">
          <Image 
            src={settings?.heroImageUrl || "/luiz-business.jpg"} 
            alt="Luiz Boss" 
            fill 
            className="object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-foreground/5 pointer-events-none"></div>
          {/* subtle technical overlay grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        {/* Floating tech element */}
        <div className="absolute -bottom-2 -right-2 glass-aura p-2 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
          <span className="w-2 h-2 rounded-full bg-primary block shadow-[0_0_10px_rgba(57,126,238,0.5)]"></span>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center md:items-start transition-all duration-700">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4 opacity-70">
            {settings?.heroGreeting || "Olá, me chamo"}
        </span>
        <h1 className="text-4xl sm:text-5xl font-featured font-bold tracking-tighter leading-tight mb-3 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
           {settings?.heroName || "Luiz Boss"}
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
           {settings?.heroTitle || "Desenvolvedor Full-stack e especialista em produtos digitais premium."}
        </p>
 
        {/* Badges - Premium Glass Style */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-10">
            {stack.map((item: string) => (
                <span 
                    key={item} 
                    className="px-5 py-2 rounded-2xl glass-aura text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-300 hover:text-primary hover:border-primary/30 transition-all duration-500 cursor-default"
                >
                    {item}
                </span>
            ))}
        </div>
 
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md font-medium tracking-tight">
           {settings?.heroDescription || "+10 anos construindo arquiteturas digitais escaláveis. Trabalho remoto especializado em SaaS e IA de alta precisão."}
        </p>
      </div>
 
    </section>
  );
}
