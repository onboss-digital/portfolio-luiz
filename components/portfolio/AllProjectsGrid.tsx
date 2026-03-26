"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MonitorPlay, LayoutGrid } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  type: string;
  mediaUrl: string;
  thumbnail?: string | null;
  tags?: string | null;
  isFeatured: boolean;
}

interface AllProjectsGridProps {
  projects: Project[];
}

const LIMIT = 14;

export default function AllProjectsGrid({ projects }: AllProjectsGridProps) {
  const displayed = projects.slice(0, LIMIT);
  const hasMore   = projects.length > LIMIT;

  return (
    <section id="projetos-grid" className="w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <LayoutGrid className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Projetos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-featured font-bold tracking-tight text-foreground">
            Todos os projetos
          </h2>
          <p className="text-base text-zinc-500 mt-2 font-medium">
            {projects.length} {projects.length === 1 ? "projeto entregue" : "projetos entregues"} com excelência.
          </p>
        </div>
      </div>

      {/* Grid 4 colunas */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayed.map((project: Project) => (
            <a
              key={project.id}
              href={project.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-[1.75rem] border border-surface-border bg-surface/40 hover:bg-surface/70 hover:border-primary/20 overflow-hidden transition-all duration-500 relative"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-zinc-900 relative overflow-hidden flex-shrink-0">
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <MonitorPlay className="w-8 h-8" strokeWidth={1} />
                  </div>
                )}

                {/* Featured badge */}
                {project.isFeatured && (
                  <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                    Destaque
                  </div>
                )}

                {/* Arrow hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{project.type}</span>
                  {project.category && (
                    <>
                      <span className="text-foreground/20 text-xs">•</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{project.category}</span>
                    </>
                  )}
                </div>
                <h3 className="font-bold text-[14px] text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
                {project.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tags.split(",").filter(Boolean).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[9px] border border-surface-border px-1.5 py-0.5 rounded-md text-zinc-500 capitalize">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-surface-border rounded-3xl">
          <LayoutGrid className="w-10 h-10 text-zinc-700 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Projetos chegando em breve...</p>
        </div>
      )}

      {/* Ver mais */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Link
            href="/projetos"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-surface-border bg-surface/50 hover:bg-primary hover:border-primary hover:text-white transition-all duration-500 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500"
          >
            Ver todos os projetos
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      )}
    </section>
  );
}
