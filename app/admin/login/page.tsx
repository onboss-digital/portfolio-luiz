"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocorreu um erro ao tentar acessar.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background Abstrato */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        
        <div className="flex flex-col items-center justify-center mb-10 gap-3">
          <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sala de Comando - Luiz Boss</h1>
          <p className="text-gray-500 text-sm">Acesso restrito ao painel.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {error && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 ml-1">E-mail</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="onbossdigital@gmail.com"
                className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 ml-1">Senha</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono tracking-widest"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 flex items-center justify-center w-full gap-3 text-xs tracking-widest uppercase font-bold text-white bg-blue-600 px-6 py-4 rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg"
            >
              <span>{isLoading ? "Autenticando..." : "Liberar Acesso"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}
