"use client";

import React, { useState } from "react";
import { X, Star, Send, CheckCircle2, Loader2 } from "lucide-react";

interface ReviewModalProps {
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ReviewModal({ onClose }: ReviewModalProps) {
  const [name,    setName]    = useState("");
  const [role,    setRole]    = useState("");
  const [text,    setText]    = useState("");
  const [stars,   setStars]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [status,  setStatus]  = useState<Status>("idle");
  const [errMsg,  setErrMsg]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) { setErrMsg("Selecione uma nota de 1 a 5 estrelas."); return; }
    if (text.trim().length < 10) { setErrMsg("Escreva pelo menos 10 caracteres no comentário."); return; }
    setErrMsg("");
    setStatus("loading");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, text, stars }),
      });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || "Erro ao enviar."); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setErrMsg("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background border border-surface-border rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-10">

        {/* Glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-foreground/5 border border-surface-border flex items-center justify-center text-zinc-500 hover:text-foreground hover:bg-foreground/10 transition-all"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="p-8">
          {status === "success" ? (
            /* ── Estado de sucesso ── */
            <div className="flex flex-col items-center gap-5 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Avaliação recebida!</h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  Obrigado pelo seu depoimento. Ele será publicado após aprovação.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90"
              >
                Fechar
              </button>
            </div>
          ) : (
            /* ── Formulário ── */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header */}
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(57,126,238,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Avaliação</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Deixe sua avaliação</h3>
                <p className="text-sm text-zinc-500 mt-1">Sua experiência ajuda outros a conhecerem o trabalho.</p>
              </div>

              {/* Stars */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nota *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = n <= (hovered || stars);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStars(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-125 active:scale-110"
                        aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-9 h-9 transition-all duration-150 ${
                            active
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                              : "text-zinc-300 dark:text-zinc-500 fill-transparent"
                          }`}
                          strokeWidth={active ? 0 : 1.5}
                        />
                      </button>
                    );
                  })}
                  {stars > 0 && (
                    <span className="ml-1 text-xs font-bold text-amber-500">
                      {["", "Ruim", "Regular", "Bom", "Ótimo", "Excelente"][stars]}
                    </span>
                  )}
                </div>
              </div>

              {/* Nome + Cargo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full bg-transparent border border-surface-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cargo / Empresa</label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-transparent border border-surface-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Comentário */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Comentário *</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Conte sobre sua experiência com o trabalho..."
                  rows={4}
                  required
                  className="w-full bg-transparent border border-surface-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                />
                <span className="text-[10px] text-zinc-600 text-right">{text.length} caracteres</span>
              </div>

              {/* Erro */}
              {errMsg && (
                <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {errMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(57,126,238,0.3)]"
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" strokeWidth={1.5} /> Enviar Avaliação</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
