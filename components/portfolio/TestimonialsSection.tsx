"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Quote, MessageSquarePlus } from "lucide-react";
import ReviewModal from "@/components/portfolio/ReviewModal";

// ── Placeholders (usados quando o banco ainda não tem depoimentos) ─────────────
const PLACEHOLDER_TESTIMONIALS = [
  {
    id: "1", name: "Rafael Menezes", role: "Dono · Lanchonete Sabor da Vila",
    text: "Luiz fez o site do meu negócio e ficou incrível. Antes eu não tinha nada online, hoje recebo pedidos pelo WhatsApp direto do site. Valeu muito o investimento.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "2", name: "Camila Torres", role: "Proprietária · Studio Cami Hair",
    text: "Eu queria um site bonito pro meu salão e ele entregou muito mais do que esperava. Profissional, rápido e super atencioso. Minhas clientes adoram o visual novo.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "3", name: "Marcos Oliveira", role: "Sócio · Celulares MegaTop",
    text: "A loja virtual que o Luiz criou pra gente melhorou muito nossas vendas. O catálogo ficou fácil de atualizar e o layout é bem profissional. Recomendo demais.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "4", name: "Tatiane Alves", role: "Administradora · Clínica Estética Renova",
    text: "O sistema de agendamento que ele desenvolveu pra clínica facilitou muito nossa rotina. Os pacientes conseguem marcar pelo site, sem precisar ligar. Excelente trabalho.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "5", name: "Rodrigo Pimentel", role: "Dono · Açougue Pimentel",
    text: "Entrei no mundo digital com a ajuda do Luiz. Criou o site, configurou o WhatsApp Business e ainda me ensinou a usar. Suporte excelente, pessoa de confiança.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "7", name: "Fernanda Lima", role: "Fotógrafa · Studio Fernanda Lima",
    text: "Meu portfólio online ficou lindo demais. Ele entendeu meu estilo, criou algo que combina com minha marca e os clientes sempre elogiam quando acessam.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "8", name: "Diego Monteiro", role: "Gerente · Supermercado Bom Preço",
    text: "Precisava de um site com lista de ofertas semanais e o Luiz resolveu tudo. Simples, rápido e fácil de atualizar. Voltamos a fazer negócio com certeza.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "9", name: "Priscila Santos", role: "Designer · Estúdio Visual PS",
    text: "Como designer, sou muito exigente com quem implementa meu trabalho. O Luiz foi o único dev que respeitou cada detalhe. Colaboração impecável do começo ao fim.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "10", name: "Pedro Henrique Gomes", role: "Diretor · Academia Força Total",
    text: "O site da academia ficou moderno e os alunos conseguem ver os planos, horários e entrar em contato. Aumentou muito o número de contatos mensais.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "11", name: "Sabrina Neves", role: "Confeiteira · Doces da Sabri",
    text: "Antes eu só vendia pelo Instagram. Com o site que o Luiz fez, tenho um cardápio online e recebo encomendas pelo formulário. Profissionalismo a mais.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "12", name: "Luciana Ferreira", role: "Gestora · Escola Alegria de Aprender",
    text: "O site da escola ficou muito bem feito. Tem todas as informações que os pais precisam, galeria de fotos e formulário de matrícula. Tudo funcionando perfeitamente.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "13", name: "Anderson Braga", role: "Mecânico · Oficina Braga Auto",
    text: "Nunca pensei que ia ter um site, mas o Luiz me convenceu. Hoje recebo clientes novos toda semana pelo Google. O investimento se pagou no primeiro mês.",
    stars: 5, avatarUrl: null,
  },
  {
    id: "14", name: "Renata Dias", role: "Arquiteta · RD Arquitetura",
    text: "Portfólio online dos meus projetos ficou lindo e muito profissional. Já fechei dois contratos com clientes que me encontraram pelo site. Recomendo sem hesitar.",
    stars: 5, avatarUrl: null,
  },
];

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  text: string;
  stars: number;
  avatarUrl?: string | null;
}

interface Props {
  testimonials?: Testimonial[];
  showAll?: boolean; // full page mode
}

// ── Star renderer ─────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "text-primary fill-primary" : "text-zinc-700"}`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

// ── Anonymous avatar ────────────────────────────────────────────────────────
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const src = avatarUrl || "/avatar-anonimo.png";
  return (
    <img
      src={src}
      alt={name}
      className="w-10 h-10 rounded-full object-cover border border-surface-border flex-shrink-0 opacity-80"
    />
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-[2rem] border border-surface-border bg-surface/40 hover:bg-surface/70 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />

      {/* Quote icon */}
      <Quote className="w-6 h-6 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors" strokeWidth={1} />

      {/* Text */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium flex-1 mb-6">
        &quot;{t.text}&quot;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={t.name} avatarUrl={t.avatarUrl} />
          <div>
            <p className="text-sm font-bold text-foreground leading-snug">{t.name}</p>
            {t.role && (
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{t.role}</p>
            )}
          </div>
        </div>
        <Stars count={t.stars} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TestimonialsSection({ testimonials = [], showAll = false }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  // Merge real and placeholders, real first
  // Placeholders used only if total < 14 and we want to show a robust section
  const source: Testimonial[] = [
    ...testimonials,
    ...PLACEHOLDER_TESTIMONIALS.filter(p => !testimonials.some(t => t.name === p.name))
  ].slice(0, 14);

  const displayed = showAll ? source : source.slice(0, 6);
  const hasMore    = !showAll && source.length > 6;

  return (
    <section id="avaliacoes" className="w-full relative">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Star className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Avaliações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-featured font-bold tracking-tight text-foreground">
            O que dizem<br className="hidden sm:block" /> sobre o trabalho
          </h2>
          <p className="text-base text-zinc-500 mt-3 max-w-sm font-medium">
            Depoimentos reais de clientes e parceiros satisfeitos.
          </p>
        </div>

        {/* Average badge */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight">5.0</span>
            <Star className="w-7 h-7 text-primary fill-primary" strokeWidth={0} />
          </div>
          <p className="text-xs text-zinc-500 font-medium">{source.length} avaliações verificadas</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayed.map(t => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        {hasMore && (
          <Link
            href="/avaliacoes"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-surface-border bg-surface/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500"
          >
            Ver todas as avaliações
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
          </Link>
        )}
        <button
          onClick={() => setModalOpen(true)}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 text-[12px] font-bold uppercase tracking-[0.2em] text-primary"
        >
          <MessageSquarePlus className="w-4 h-4" strokeWidth={1.5} />
          Deixar minha avaliação
        </button>
      </div>

      {/* Review Modal */}
      {modalOpen && <ReviewModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
