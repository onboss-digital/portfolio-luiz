"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackSessionAction, trackEventAction, updateDurationAction } from "@/app/actions/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Identificar ou Criar Visitor ID
    let vid = localStorage.getItem("lb_visitor_id");
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("lb_visitor_id", vid);
    }
    visitorIdRef.current = vid;

    // 2. Iniciar Sessão ou Registrar PageView
    const initSession = async () => {
      const utms = {
        source: searchParams.get("utm_source"),
        medium: searchParams.get("utm_medium"),
        campaign: searchParams.get("utm_campaign"),
      };

      const device = window.innerWidth < 768 ? "Mobile" : "Desktop";
      const browser = navigator.userAgent.includes("Chrome") ? "Chrome" : 
                      navigator.userAgent.includes("Firefox") ? "Firefox" : 
                      navigator.userAgent.includes("Safari") ? "Safari" : "Outro";

      try {
        const sid = await trackSessionAction(vid!, utms, device, browser, pathname);
        sessionIdRef.current = sid;
      } catch (err) {
        console.error("Erro ao iniciar rastreamento:", err);
      }
    };

    initSession();

    // 3. Lógica de Permanência (Duração)
    const interval = setInterval(() => {
      if (sessionIdRef.current && document.visibilityState === 'visible') {
        const now = Date.now();
        const diff = Math.floor((now - lastUpdateRef.current) / 1000);
        if (diff >= 10) {
          updateDurationAction(sessionIdRef.current, diff);
          lastUpdateRef.current = now;
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pathname, searchParams]); // Ativa ao trocar de página

  // Expor função global de rastreamento de clique para o WhatsApp
  useEffect(() => {
    const handleWhatsappClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[href*="wa.me"]') || target.closest('[href*="api.whatsapp.com"]')) {
        if (sessionIdRef.current) {
          trackEventAction(sessionIdRef.current, "whatsapp_click", pathname);
        }
      }
    };

    document.addEventListener("click", handleWhatsappClick);
    return () => document.removeEventListener("click", handleWhatsappClick);
  }, [pathname]);

  return null; // Componente invisível
}
