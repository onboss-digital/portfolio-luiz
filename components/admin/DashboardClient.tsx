"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, Edit2, Trash2, X, Settings2, Video, CheckCircle2, 
  AlertCircle, Save, LayoutDashboard, Target, LogOut, 
  ChevronRight, ChevronLeft, BarChart3, Smartphone, 
  MonitorPlay, Star, MessageSquare, Users, MousePointer2, 
  Clock, ArrowUpRight, TrendingUp, Globe, Loader2, Menu
} from "lucide-react";
import { 
  createProjectAction, updateProjectAction, deleteProjectAction, 
  updateSettingsAction, createPixelAction, updatePixelAction, 
  deletePixelAction, updateAdminIdentityAction,
  createTestimonialAction, updateTestimonialAction, deleteTestimonialAction
} from "@/app/admin/actions";
import { getDashboardMetricsAction, getLiveUsersAction } from "@/app/admin/analytics_actions";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from "recharts";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  projects: any[];
  pixels: any[];
  settings: any;
  testimonials: any[];
  initialTab?: string;
  adminUser: any;
}

export default function DashboardClient({ 
  projects, pixels = [], settings, testimonials = [], initialTab = "dashboard", adminUser 
}: DashboardClientProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>(initialTab);

  const changeMenu = (menu: string) => {
    setFeedback(null);
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
    router.push(`/admin/${menu}`, { scroll: false });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Analytics States
  const [mt, setMt] = useState<any>(null);
  const [period, setPeriod] = useState("7d");
  const [isMtLoading, setIsMtLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState(0);

  useEffect(() => {
    if (activeMenu === "dashboard") {
      const load = async () => {
        setIsMtLoading(true);
        try {
          const data = await getDashboardMetricsAction(period);
          setMt(data);
          const live = await getLiveUsersAction();
          setLiveUsers(live);
        } catch (err) {
          console.error(err);
        } finally {
          setIsMtLoading(false);
        }
      };
      load();

      const interval = setInterval(async () => {
        try {
          const live = await getLiveUsersAction();
          setLiveUsers(live);
        } catch {}
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [period, activeMenu]);

  // Modais
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
  const [editingPixel, setEditingPixel] = useState<any>(null);

  // Form States - Projects
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pType, setPType] = useState("Web");
  const [pCategory, setPCategory] = useState("Site");
  const [pMediaUrl, setPMediaUrl] = useState("");
  const [pThumbnail, setPThumbnail] = useState("");
  const [pTags, setPTags] = useState("");
  const [pIsFeatured, setPIsFeatured] = useState(false);

  // Form States - Pixels
  const [pxTitle, setPxTitle] = useState("");
  const [pxProvider, setPxProvider] = useState("facebook");
  const [pxPixelId, setPxPixelId] = useState("");
  const [pxStatus, setPxStatus] = useState(true);
  const [pxEvents, setPxEvents] = useState<string[]>(["PageView"]);
  const [pxTargetType, setPxTargetType] = useState("all");
  const [pxTargetUrls, setPxTargetUrls] = useState("");

  const providerOptions: any = {
    facebook: { label: 'Facebook Ads', events: ['PageView', 'Lead', 'InitiateCheckout', 'Purchase', 'ViewContent'] },
    google_analytics: { label: 'Google Analytics (GA4)', events: ['page_view', 'generate_lead', 'begin_checkout', 'purchase', 'view_item'] },
    tiktok: { label: 'TikTok Ads', events: ['PageView', 'SubmitForm', 'InitiateCheckout', 'CompletePayment'] },
    kwai: { label: 'Kwai', events: ['PAGE_VIEW', 'ADD_TO_CART', 'ORDER'] },
    taboola: { label: 'Taboola', events: ['view', 'lead', 'purchase'] },
  };

  // Form States - Settings
  const [sHeroGreeting, setSHeroGreeting] = useState(settings?.heroGreeting || "");
  const [sHeroTitle, setSHeroTitle] = useState(settings?.heroTitle || "");
  const [sHeroName, setSHeroName] = useState(settings?.heroName || "");
  const [sWhatsappNumber, setSWhatsappNumber] = useState(settings?.whatsappNumber || "");
  const [sWhatsappMessage, setSWhatsappMessage] = useState(settings?.whatsappMessage || "");

  const handleLogout = async () => {
    document.cookie = "luiz_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  const resetProjectForm = () => {
    setPTitle(""); setPDescription(""); setPType("Web"); setPCategory("Site"); 
    setPMediaUrl(""); setPThumbnail(""); setPTags(""); setPIsFeatured(false);
    setEditingProject(null);
  };

  const resetPixelForm = () => {
    setPxTitle(""); setPxProvider("facebook"); setPxPixelId(""); setPxStatus(true);
    setPxEvents(["PageView"]); setPxTargetType("all"); setPxTargetUrls("");
    setEditingPixel(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'media' | 'thumb') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (target === 'thumb') setPThumbnail(data.url);
        else setPMediaUrl(data.url);
        setFeedback({ type: 'success', msg: 'Conteúdo enviado com sucesso!' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: 'Erro ao subir arquivo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateSettingsAction({
      heroGreeting: sHeroGreeting,
      heroName: sHeroName,
      heroTitle: sHeroTitle,
      whatsappNumber: sWhatsappNumber,
      whatsappMessage: sWhatsappMessage
    });
    setIsLoading(false);
    if (result.error) setFeedback({ type: "error", msg: result.error });
    else setFeedback({ type: "success", msg: "Configurações atualizadas!" });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
     const data = { title: pTitle, description: pDescription, type: pType, category: pCategory, mediaUrl: pMediaUrl, thumbnail: pThumbnail, tags: pTags, isFeatured: pIsFeatured };
     const result = editingProject ? await updateProjectAction(editingProject.id, data) : await createProjectAction(data);
     setIsLoading(false);
     if (result.error) setFeedback({ type: "error", msg: result.error });
     else { setFeedback({ type: "success", msg: "Projeto salvo!" }); setIsProjectModalOpen(false); router.refresh(); }
  };

  const handleDeleteProject = async (id: string) => {
     if (!confirm("Excluir?")) return;
     const result = await deleteProjectAction(id);
     if (result.error) setFeedback({ type: "error", msg: result.error });
     else router.refresh();
  };

  // Handlers: Pixels
  const handleSavePixel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { 
      title: pxTitle, 
      provider: pxProvider, 
      pixelId: pxPixelId, 
      status: pxStatus, 
      events: JSON.stringify(pxEvents), 
      targetType: pxTargetType, 
      targetUrls: pxTargetUrls 
    };
    const result = editingPixel ? await updatePixelAction(editingPixel.id, payload) : await createPixelAction(payload);
    setIsLoading(false);
    if (result.error) {
      setFeedback({ type: 'error', msg: result.error });
    } else {
      setFeedback({ type: 'success', msg: editingPixel ? 'Pixel atualizado!' : 'Novo pixel ativado!' });
      setIsPixelModalOpen(false);
      router.refresh();
    }
  };

  const handleDeletePixel = async (id: string) => {
    if (!confirm("Remover este pixel de rastreamento?")) return;
    setIsLoading(true);
    const result = await deletePixelAction(id);
    setIsLoading(false);
    if (result.error) {
      setFeedback({ type: "error", msg: result.error });
    } else {
      setFeedback({ type: 'success', msg: 'Pixel removido.' });
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 dark">
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl">
        <div className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Mobile Menu Toggle */}
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white transition-all">
                <Menu className="w-6 h-6" />
             </button>
             
             <div className="flex items-center gap-4 cursor-pointer" onClick={() => changeMenu("dashboard")}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-xl font-black italic text-white hidden sm:flex">A</div>
                <div>
                  <h1 className="text-lg font-bold text-white leading-none mb-0">Painel Aura</h1>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Admin</p>
                </div>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-[#111] p-1 rounded-full border border-white/5">
            {[ 
              {id: "dashboard", icon: LayoutDashboard, label: "Dashboard"},
              {id: "projects", icon: Video, label: "Projetos"},
              {id: "testimonials", icon: MessageSquare, label: "Depoimentos"},
              {id: "pixels", icon: Target, label: "Pixels"},
              {id: "settings", icon: Settings2, label: "Ajustes"}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => changeMenu(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase transition-all ${
                  activeMenu === tab.id ? 'bg-white/10 text-white shadow-xl border border-white/10' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
           <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-[#050505] border-r border-white/5 p-8 flex flex-col animate-in slide-in-from-left duration-500">
              <div className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-sm">A</div>
                    <span className="font-bold text-white tracking-tight">Menu Admin</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="space-y-2 flex-1">
                 {[ 
                    {id: "dashboard", icon: LayoutDashboard, label: "Dashboard"},
                    {id: "projects", icon: Video, label: "Projetos"},
                    {id: "testimonials", icon: MessageSquare, label: "Depoimentos"},
                    {id: "pixels", icon: Target, label: "Pixels"},
                    {id: "settings", icon: Settings2, label: "Ajustes"}
                 ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => changeMenu(tab.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase transition-all ${
                        activeMenu === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" /> {tab.label}
                    </button>
                 ))}
              </div>
              
              <button 
                onClick={handleLogout}
                className="mt-auto w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500/70 font-bold border border-red-500/20 hover:bg-red-500/10 hover:text-red-500 transition-all uppercase text-[10px] tracking-widest"
              >
                <LogOut className="w-4 h-4" /> Sair do Sistema
              </button>
           </div>
        </div>
      )}

      <main className="flex-1 w-full pt-12 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          {feedback && (
            <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
              feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-bold">{feedback.msg}</p>
              <button onClick={() => setFeedback(null)} className="ml-auto opacity-50"><X className="w-4 h-4" /></button>
            </div>
          )}

          {activeMenu === "dashboard" && (
            <div className="animate-in fade-in">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">Desempenho</h2>
                    <p className="text-zinc-500 text-sm mt-1">Visão geral estratégica da plataforma.</p>
                  </div>
                  <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
                     {['today', '7d', '30d', 'all'].map(p => (
                       <button key={p} onClick={() => setPeriod(p)} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                         {p === 'today' ? 'Hoje' : p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : 'Tudo'}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-[#111] border border-blue-500/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                     <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live</span>
                     </div>
                     <h3 className="text-5xl font-bold text-white tracking-tighter mb-1">{liveUsers}</h3>
                     <p className="text-[9px] uppercase font-bold text-zinc-500">Usuários online</p>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Visitantes</h4>
                     <h3 className="text-4xl font-bold text-white tracking-tighter">{mt?.totalVisits || 0}</h3>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">WhatsApp</h4>
                     <h3 className="text-4xl font-bold text-white tracking-tighter">{mt?.whatsappClicks || 0}</h3>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Conversão</h4>
                     <h3 className="text-4xl font-bold text-white tracking-tighter">{mt?.conversionRate || 0}%</h3>
                  </div>
               </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
                     <h3 className="text-lg font-bold text-white mb-8">Estatísticas de Tráfego</h3>
                     <div className="h-[300px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={mt?.chartData || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                              <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                              <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} />
                              <Bar dataKey="visitas" fill="#397EEE" radius={[4, 4, 0, 0]} barSize={20} />
                              <Bar dataKey="conversoes" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem]">
                     <h3 className="text-lg font-bold text-white mb-6">Qualidade de Sessão</h3>
                     <div className="flex items-end gap-3 mb-4">
                        <h4 className="text-5xl font-bold text-white">{mt?.bounceRate || 0}%</h4>
                        <span className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Taxa de Rejeição</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-12">
                        <div className="h-full bg-red-500/50" style={{ width: `${mt?.bounceRate || 0}%` }} />
                     </div>
                     
                     <h3 className="text-lg font-bold text-white mb-6">Tráfego por Fonte</h3>
                     <div className="space-y-4">
                        {(mt?.trafficSources || []).slice(0, 4).map((s:any, i:number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                             <span className="text-zinc-400 font-medium">{s.name}</span>
                             <span className="text-white font-mono font-bold">{s.value}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeMenu === "projects" && (
            <div className="animate-in fade-in">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Gerenciamento de Projetos</h2>
                    <p className="text-zinc-500 text-sm mt-1">Exiba seus melhores trabalhos na galeria principal.</p>
                  </div>
                  <button onClick={() => { resetProjectForm(); setIsProjectModalOpen(true); }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                     <Plus className="w-4 h-4" /> Novo Projeto
                  </button>
               </div>
               
               <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                     <tr>
                       <th className="px-8 py-6">Mídia & Identificação</th>
                       <th className="px-8 py-6">Tipo / Categoria</th>
                       <th className="px-8 py-6">Status Vitrine</th>
                       <th className="px-8 py-6 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {(projects || []).length === 0 && (
                       <tr>
                         <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 italic">Nenhum projeto cadastrado.</td>
                       </tr>
                     )}
                     {(projects || []).map(p => (
                       <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                           <div className="flex items-center gap-6">
                             <div className="w-24 h-14 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 shadow-lg relative group-hover:scale-105 transition-transform duration-500">
                               <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                               {p.type === 'Video' && (
                                 <div className="absolute inset-0 flex items-center justify-center">
                                   <div className="w-6 h-6 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                     <MonitorPlay className="w-3 h-3 text-white" />
                                   </div>
                                 </div>
                               )}
                             </div>
                             <div>
                               <p className="font-bold text-white text-base leading-tight">{p.title}</p>
                               <p className="text-xs text-zinc-500 mt-1 italic truncate max-w-[200px]">{p.description || "Sem descrição"}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-8 py-6">
                           <div className="flex flex-col gap-1.5">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md w-fit ${
                                p.type === 'Web' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {p.type === 'Web' ? '💻 Web App' : '🎬 Vídeo Production'}
                              </span>
                              <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-tighter">Categoria: {p.category || 'Geral'}</span>
                           </div>
                         </td>
                         <td className="px-8 py-6">
                           {p.isFeatured ? (
                             <div className="flex items-center gap-2 text-amber-500">
                               <Star className="w-4 h-4 fill-amber-500" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">Destaque</span>
                             </div>
                           ) : (
                             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 italic">Galeria Comum</span>
                           )}
                         </td>
                         <td className="px-8 py-6 text-right space-x-2">
                            <button onClick={() => { setEditingProject(p); setPTitle(p.title); setIsProjectModalOpen(true); }} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteProject(p.id)} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-red-500"><Trash2 className="w-4 h-4" /></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeMenu === "settings" && (
            <form onSubmit={handleSaveSettings} className="animate-in fade-in max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Perfil & Hero */}
                <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-blue-500" /> Perfil & Hero
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Saudação</label>
                      <input value={sHeroGreeting} onChange={e => setSHeroGreeting(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Nome Exibido</label>
                      <input value={sHeroName} onChange={e => setSHeroName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Título Principal (Especialidade)</label>
                    <textarea value={sHeroTitle} onChange={e => setSHeroTitle(e.target.value)} rows={3} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none transition-all text-sm resize-none" />
                  </div>
                </div>

                {/* Contato & WhatsApp */}
                <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Smartphone className="w-5 h-5 text-emerald-500" /> Contato & WhatsApp
                  </h2>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Número WhatsApp (com DDD)</label>
                    <input value={sWhatsappNumber} onChange={e => setSWhatsappNumber(e.target.value)} placeholder="Ex: 5511999999999" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-emerald-500 outline-none transition-all text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Mensagem Padrão</label>
                    <textarea value={sWhatsappMessage} onChange={e => setSWhatsappMessage(e.target.value)} rows={3} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-emerald-500 outline-none transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

              <div className="mt-12 flex justify-end">
                <button type="submit" disabled={isLoading} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}

          {activeMenu === "pixels" && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-white">Pixels de Rastreamento</h2>
                  <p className="text-zinc-500 text-sm mt-1">Monitore o comportamento técnico com pixels dinâmicos.</p>
                </div>
                <button onClick={() => { resetPixelForm(); setIsPixelModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all font-bold text-xs uppercase">
                  <Plus className="w-4 h-4" /> Novo Pixel
                </button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <tr>
                      <th className="px-8 py-6">Plataforma / Nome</th>
                      <th className="px-8 py-6">ID de Tracking</th>
                      <th className="px-8 py-6">Alvo (Target)</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(pixels || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 italic">Nenhum pixel configurado.</td>
                      </tr>
                    )}
                    {(pixels || []).map((px) => (
                      <tr key={px.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                              px.provider === 'facebook' ? 'bg-[#1877F2]' : 
                              px.provider === 'google_analytics' ? 'bg-[#EA4335]' : 
                              px.provider === 'tiktok' ? 'bg-black border border-white/20' : 'bg-blue-500'
                            }`}>
                              <Target className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{px.title}</p>
                              <p className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest mt-0.5">{(px.provider || "OUTRO").replace('_', ' ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono text-xs text-blue-400 group-hover:text-blue-300 transition-colors uppercase">
                          {px.pixelId}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                            px.targetType === 'all' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          }`}>
                            {px.targetType === 'all' ? 'Todo o Site' : 'Páginas Específicas'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${px.status ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${px.status ? 'text-emerald-500' : 'text-red-500'}`}>
                               {px.status ? 'Ativo' : 'Inativo'}
                             </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button onClick={() => { setEditingPixel(px); setPxTitle(px.title); setPxProvider(px.provider); setPxPixelId(px.pixelId); setPxStatus(px.status || true); try { setPxEvents(JSON.parse(px.events || '["PageView"]')); } catch { setPxEvents(['PageView']); } setPxTargetType(px.targetType || 'all'); setPxTargetUrls(px.targetUrls || ''); setIsPixelModalOpen(true); }} className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeletePixel(px.id)} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "testimonials" && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold italic text-white">Depoimentos</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {[...(testimonials || [])].sort((a,b) => Number(a.isActive) - Number(b.isActive)).map((t) => (
                  <div key={t.id} className="bg-[#111] border border-white/5 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start gap-6 transition-all hover:bg-[#151515]">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${t.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>{t.isActive ? "Ativo" : "Pendente"}</span>
                        <div className="flex gap-0.5">
                          {Array.from({length: 5}).map((_,i) => <Star key={i} className={`w-3 h-3 ${i < t.stars ? "text-blue-500 fill-blue-500" : "text-gray-800"}`} />)}
                        </div>
                      </div>
                      <p className="text-lg text-white font-medium mb-4 leading-relaxed line-clamp-3 italic">"{t.text}"</p>
                      <p className="text-sm font-bold text-gray-400">— {t.name} <span className="text-blue-500/50 text-xs ml-2">{t.role}</span></p>
                    </div>
                    {!t.isActive && (
                      <button onClick={async () => {
                         const { approveTestimonialAction } = await import("@/app/admin/actions");
                         await approveTestimonialAction(t.id);
                         router.refresh();
                      }} className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-emerald-500/20 transition-all">Aprovar Agora</button>
                    )}
                    <button onClick={async () => {
                       if(confirm("Excluir?")) {
                         const { deleteTestimonialAction } = await import("@/app/admin/actions");
                         await deleteTestimonialAction(t.id);
                         router.refresh();
                       }
                    }} className="shrink-0 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 border border-red-500/20"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: PROJETOS */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsProjectModalOpen(false)} />
          <form onSubmit={handleSaveProject} className="relative bg-[#111] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Título do Projeto</label>
                  <input required value={pTitle} onChange={e => setPTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Tipo</label>
                  <select value={pType} onChange={e => setPType(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none">
                    <option value="Web">Web App</option>
                    <option value="Video">Vídeo</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Categoria</label>
                  <input value={pCategory} onChange={e => setPCategory(e.target.value)} placeholder="Ex: SaaS, Landing Page, Reels" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Media URL (Site ou Vídeo)</label>
                  <input required value={pMediaUrl} onChange={e => setPMediaUrl(e.target.value)} placeholder="https://exemplo.com ou link do vídeo" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none text-white text-sm placeholder:text-zinc-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Thumbnail (Imagem de Capa)</label>
                  <div className="flex gap-2 items-center mt-2">
                    <input required value={pThumbnail} onChange={e => setPThumbnail(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none text-white text-sm placeholder:text-zinc-700" />
                    <label className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all text-white font-bold text-[10px] uppercase shrink-0">
                       Upload
                       <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'thumb')} />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                   <input type="checkbox" checked={pIsFeatured} onChange={e => setPIsFeatured(e.target.checked)} id="pfeat" className="w-5 h-5 rounded border-white/10 bg-black accent-blue-500" />
                   <label htmlFor="pfeat" className="text-sm font-bold text-gray-300">Marcar como Destaque</label>
                </div>
             </div>
             
             <div className="mt-10 flex gap-4">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase shadow-xl shadow-blue-500/20 disabled:opacity-50">
                  {isLoading ? 'Salvando...' : 'Confirmar & Salvar'}
                </button>
             </div>
          </form>
        </div>
      )}

      {/* MODAL: PIXELS */}
      {isPixelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsPixelModalOpen(false)} />
          <form onSubmit={handleSavePixel} className="relative bg-[#111] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{editingPixel ? 'Editar Rastreamento' : 'Novo Escaneamento'}</h3>
                <button type="button" onClick={() => setIsPixelModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Nome do Sensor</label>
                  <input required value={pxTitle} onChange={e => setPxTitle(e.target.value)} placeholder="Ex: Meta Ads - Campanha Março" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Provedor</label>
                  <select value={pxProvider} onChange={e => { setPxProvider(e.target.value); setPxEvents(['PageView']); }} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none text-white transition-all">
                    {Object.keys(providerOptions).map(key => (
                      <option key={key} value={key}>{providerOptions[key].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">ID de Identificação</label>
                  <input required value={pxPixelId} onChange={e => setPxPixelId(e.target.value)} placeholder="0000000000000" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Alvo de Tracking</label>
                  <select value={pxTargetType} onChange={e => setPxTargetType(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none">
                    <option value="all">Todo o Site</option>
                    <option value="include">Páginas Específicas</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                   <input type="checkbox" checked={pxStatus} onChange={e => setPxStatus(e.target.checked)} id="pxstatus" className="w-5 h-5 rounded border-white/10 bg-black accent-emerald-500 cursor-pointer" />
                   <label htmlFor="pxstatus" className="text-sm font-bold text-gray-300 cursor-pointer">Ativar Chat / Tracking</label>
                </div>
                
                {pxTargetType !== "all" && (
                   <div className="md:col-span-2">
                     <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">URLs Segmentadas (Separadas por vírgula)</label>
                     <input value={pxTargetUrls} onChange={e => setPxTargetUrls(e.target.value)} placeholder="/home, /contato" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-2 focus:border-blue-500 outline-none font-mono text-white" />
                   </div>
                )}

                <div className="md:col-span-2">
                   <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-3 block">Eventos para Ativar</label>
                   <div className="flex flex-wrap gap-2">
                     {(providerOptions[pxProvider]?.events || []).map((evt: string) => (
                       <button
                         key={evt}
                         type="button"
                         onClick={() => {
                           if (pxEvents.includes(evt)) setPxEvents(pxEvents.filter(e => e !== evt));
                           else setPxEvents([...pxEvents, evt]);
                         }}
                         className={`px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition-all flex items-center gap-2 group ${pxEvents.includes(evt) ? "bg-blue-600/20 border-blue-500 text-white" : "bg-black border-white/5 text-zinc-500 hover:border-white/10"}`}
                       >
                         <div className={`w-1.5 h-1.5 rounded-full ${pxEvents.includes(evt) ? "bg-blue-400 animate-pulse" : "bg-zinc-800"}`} />
                         {evt}
                       </button>
                     ))}
                   </div>
                </div>
             </div>
             
             <div className="mt-10 flex gap-4">
                <button type="button" onClick={() => setIsPixelModalOpen(false)} className="flex-1 py-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase shadow-xl shadow-blue-500/20 disabled:opacity-50">
                  {isLoading ? 'Iniciando...' : 'Confirmar e Ativar'}
                </button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}
