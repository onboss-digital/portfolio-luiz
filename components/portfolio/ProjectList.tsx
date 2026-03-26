"use client";

import React from "react";
import { ArrowUpRight, Mail, MonitorPlay } from "lucide-react";
import Image from "next/image";

interface ProjectListProps {
  projects: any[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-4 mt-12 md:mt-0">
      
      {/* Technical Header for Projects */}
      <div className="flex items-center justify-center md:justify-start gap-3 mb-6 opacity-60">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(57,126,238,0.5)]"></div>
        <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Projetos em destaque</span>
      </div>

      {projects.length > 0 ? projects.map((project, index) => (
        <a 
          key={project.id}
          href={project.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center p-4 rounded-3xl border border-surface-border bg-surface/40 hover:bg-surface/60 hover:border-primary/20 transition-all duration-500 overflow-hidden relative"
        >
          {/* Badge de Segmento - Mobile Only */}
          <div className="md:hidden absolute top-0 left-0 px-4 py-1.5 bg-primary text-white rounded-br-2xl text-[8px] font-black uppercase tracking-[0.2em] z-20 border-r border-b border-primary/10 shadow-lg-primary">
            {project.category || 'PROJETO'}
          </div>

          {/* Subtle Background Interaction Glow */}
          <div className="absolute -right-10 -top-10 w-20 h-20 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors"></div>

          {/* Thumbnail - Rectangular Landscape */}
          <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-5 border border-foreground/5 bg-black relative z-10 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
            {project.thumbnail ? (
              <Image 
                src={project.thumbnail} 
                alt={project.title} 
                fill 
                className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" 
              />
            ) : (
                <div className="flex items-center justify-center h-full text-zinc-700 bg-zinc-900">
                   <MonitorPlay className="w-6 h-6" strokeWidth={1} />
                </div>
            )}
          </div>
          
          <div className="flex flex-col flex-grow relative z-10 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base sm:text-[17px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {project.title}
              </h3>
              {project.category && (
                <span className="hidden md:inline-block text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-tight">
                  {project.category}
                </span>
              )}
            </div>
            <p className="text-[13px] text-zinc-500 font-medium line-clamp-1 group-hover:text-zinc-400 transition-colors">{project.description || "Solução digital personalizada."}</p>
          </div>
          
          <div className="relative z-10 ml-auto pr-2">
            <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" strokeWidth={1.5} />
          </div>
        </a>
      )) : (
        <div className="py-12 text-center border border-dashed border-surface-border rounded-2xl">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Selected projects arriving soon...</p>
        </div>
      )}

    </div>
  );
}
