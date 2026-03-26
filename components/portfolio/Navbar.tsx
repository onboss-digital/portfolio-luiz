"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Sun, Moon, Instagram } from "lucide-react";

// ── i18n dictionary ──────────────────────────────────────────────────────────
const dict = {
  pt: { home: "Início", projects: "Projetos", reviews: "Avaliações" },
  en: { home: "Home",   projects: "Projects", reviews: "Reviews"    },
} as const;

type Lang = keyof typeof dict;

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "home"     as const, href: "#inicio"    },
  { key: "projects" as const, href: "#projetos"  },
  { key: "reviews"  as const, href: "#avaliacoes"},
];

export default function Navbar() {
  const [isDark,    setIsDark]    = useState(true);
  const [lang,      setLang]      = useState<Lang>("pt");
  const [mounted,   setMounted]   = useState(false);
  const [active,    setActive]    = useState("home");
  const [scrolled,  setScrolled]  = useState(false);

  // ── Init theme & lang ───────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const savedTheme  = localStorage.getItem("theme");
    const savedLang   = localStorage.getItem("lang") as Lang | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark        = savedTheme === "dark" || (!savedTheme && prefersDark);

    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
    if (savedLang && (savedLang === "pt" || savedLang === "en")) setLang(savedLang);
  }, []);

  // ── Scroll → highlight active item + shrink navbar ─────────────────────────
  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    const sections = [
      { id: "inicio",     key: "home"     },
      { id: "projetos",   key: "projects" },
      { id: "avaliacoes", key: "reviews"  },
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && window.scrollY + 120 >= el.offsetTop) {
        setActive(sections[i].key);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // ── Theme toggle ────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // ── Lang toggle ─────────────────────────────────────────────────────────────
  const toggleLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  // ── Smooth scroll ───────────────────────────────────────────────────────────
  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const labels = dict[lang];

  return (
    <nav
      className={`w-full flex justify-between items-center px-0 transition-all duration-500 z-50
        ${scrolled ? "py-3" : "py-4"}`}
    >
      {/* ── Left: Instagram link ─────────────────────────────────────────── */}
      <a
        href="https://www.instagram.com/oluiz.business/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:gap-2 group text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors duration-300 bg-foreground/5 sm:bg-transparent rounded-full border border-foreground/5 sm:border-none"
      >
        <Instagram className="w-4 h-4 group-hover:text-primary transition-colors" strokeWidth={1.5} />
        <span className="hidden sm:inline group-hover:text-primary transition-colors">@oluiz.business</span>
      </a>

      {/* ── Center: Smart Nav pill ───────────────────────────────────────── */}
      <div className={`
        flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-500
        border-foreground/8 bg-background/60 backdrop-blur-2xl shadow-sm
        ${scrolled ? "shadow-md" : ""}
      `}>
        {NAV_ITEMS.map(({ key, href }) => (
          <button
            key={key}
            onClick={() => scrollTo(href)}
            className={`relative px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300
              ${active === key
                ? "text-white bg-primary shadow-[0_0_16px_rgba(57,126,238,0.4)]"
                : "text-zinc-500 hover:text-foreground hover:bg-foreground/5"
              }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {/* ── Right: Lang + Theme ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Language switch - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 bg-foreground/5 border border-foreground/8 rounded-full px-2 py-1">
          {(["pt", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => toggleLang(l)}
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-all duration-300
                ${lang === l
                  ? "bg-primary text-white shadow-[0_0_10px_rgba(57,126,238,0.4)]"
                  : "text-zinc-500 hover:text-foreground"
                }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/8 text-zinc-500 hover:text-primary hover:border-primary/30 transition-all duration-300"
          title="Alternar tema"
        >
          {mounted
            ? isDark
              ? <Sun  className="w-4 h-4" strokeWidth={1.5} />
              : <Moon className="w-4 h-4" strokeWidth={1.5} />
            : null}
        </button>
      </div>
    </nav>
  );
}
