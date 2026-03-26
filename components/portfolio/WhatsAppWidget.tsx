"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface WhatsAppWidgetProps {
  number: string;
  message: string;
}

export default function WhatsAppWidget({ number = "", message = "" }: WhatsAppWidgetProps) {
  const pathname = usePathname();
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const cleanNumber = (number || "").replace(/\D/g, "");
  const zapUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message || "")}`;

  useEffect(() => {
    // Efeito Sonoro
    const playSoftNotificationSound = () => {
      try {
        const audio = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_82e82545d8.mp3");
        audio.volume = 0.5;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Som bloqueado pelo navegador. Interaja com a página.", error);
          });
        }
      } catch (e) {
        console.warn("Erro ao reproduzir som.");
      }
    };

    // Delay para aparecer o widget geral
    const widgetTimer = setTimeout(() => {
      setIsWidgetVisible(true);
    }, 4000);

    // Delay de 60 segundos para a mensagem flutuante (engajamento qualificado)
    const fixedTime = 60000;
    const messageTimer = setTimeout(() => {
      setIsMessageOpen(true);
      playSoftNotificationSound();
      
      // Fecha a mensagem após 12 segundos
      setTimeout(() => setIsMessageOpen(false), 12000);
    }, fixedTime);

    return () => {
      clearTimeout(widgetTimer);
      clearTimeout(messageTimer);
    };
  }, []);


  return (
    <div className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] flex flex-col items-end gap-3 group transition-all duration-1000 transform origin-bottom-right ${isWidgetVisible ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"}`}>
      
      {/* Popover de mensagem */}
      <div className={`absolute bottom-full mb-5 right-0 w-[280px] bg-zinc-900/95 backdrop-blur-xl text-white p-6 rounded-[28px] rounded-br-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/5 transform origin-bottom-right transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMessageOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">Luiz • Agora</span>
        </div>
        <p className="font-sans text-sm font-medium leading-relaxed mb-5 text-zinc-100">
           Olá! Notei que você está vendo meu trabalho.<br />
          <span className="text-zinc-500 font-normal italic">Quer tirar uma ideia do papel hoje?</span>
        </p>
        <a 
          href={zapUrl} 
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[13px] px-5 py-3.5 rounded-2xl shadow-lg transition-all active:scale-[0.97]"
        >
          Conversar Agora
        </a>
      </div>

      {/* Botão Flutuante Principal */}
      <a 
        href={zapUrl} 
        target="_blank" rel="noopener noreferrer"
        className="relative block hover:scale-110 transition-all duration-500 hover:rotate-6 active:scale-95"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-[3px] border-[#25D366] shadow-[0_15px_35px_rgba(37,211,102,0.3)] bg-zinc-800 relative z-10 group-hover:shadow-[0_20px_45px_rgba(37,211,102,0.4)]">
          <div 
            className="w-full h-full bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" 
            style={{ backgroundImage: "url('/luiz-business.jpg')" }}
          ></div>
        </div>
        
        {/* Badge do WhatsApp */}
        <div className="absolute -bottom-1 -left-1 bg-[#25D366] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-xl border-[2.5px] border-white dark:border-zinc-950 z-20">
          <svg className="w-4 h-4 sm:w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.385 0 .004 5.383.004 12.029c0 2.127.553 4.201 1.604 6.035L.05 24l6.096-1.595c1.785.952 3.792 1.455 5.882 1.455 6.645 0 12.026-5.381 12.026-12.027S18.675 0 12.031 0zm3.877 17.513c-.927 2.228-3.058 2.378-5.336 2.05-.2.033-.61.054-1.071-.054-1.636-.379-3.213-1.229-4.524-2.54-1.579-1.58-2.607-3.411-2.924-4.832-.301-1.353-.024-2.583.743-3.475.253-.294.615-.469.96-.469h.123c.245 0 .487.114.636.312l1.642 2.18c.189.251.246.568.125.845l-.469 1.077c-.156.357-.038.77.279 1.006.77.575 1.583 1.026 2.396 1.341.343.133.738.032.966-.251l.81-1.002c.2-.25.524-.347.817-.233l2.456 1.065c.319.138.528.452.507.794-.038.56-.252 1.527-1.136 2.203z"/>
          </svg>
        </div>

        {/* Efeito de Ping (Onda) pulsante */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping -z-10 scale-125 opacity-20 group-hover:opacity-40 transition-opacity"></span>
      </a>
    </div>
  );
}
