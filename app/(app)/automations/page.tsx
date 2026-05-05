"use client";
import { useState, useEffect, useRef } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Zap,
  Play,
  GitBranch,
  Activity,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Clock,
  Split,
  Settings2,
  ChevronRight,
  Brain,
  BarChart3,
  Database,
  Layers,
  Phone,
  Star,
  Users,
  TrendingUp,
  Inbox,
  Send,
  Calendar,
  Search,
  Radio,
  AlertTriangle,
  Square,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type NodeType = "TRIGGER" | "CONDITION" | "ACTION" | "AI" | "WAIT" | "BRANCH";
type NodeStatus = "idle" | "running" | "success" | "error" | "skipped";

type FlowNode = {
  id: string;
  type: NodeType;
  icon: any;
  label: string;
  sublabel: string;
  config?: Record<string, string>;
  status?: NodeStatus;
};

type Workflow = {
  id: string;
  title: string;
  category: "Growth" | "Reputation" | "Retention" | "Operations" | "Crisis";
  trigger: string;
  description: string;
  nodes: FlowNode[];
  stats: { execTime: string; successRate: string; totalRuns: number; savedHours: number };
  status: "active" | "paused" | "draft";
  sector: string;
  lastRun?: string;
};

type MainTab = "flows" | "builder" | "triggers" | "analytics";

// ─── DATA ────────────────────────────────────────────────────────────────────

const WORKFLOWS: Workflow[] = [
  {
    id: "wf-001",
    title: "Kaçırılan Çağrı → 60s Geri Arama",
    category: "Growth",
    trigger: "Missed Call Detected",
    description: "Kaçırılan her çağrı 60 saniye içinde AI agent tarafından geri aranır. Randevu oluşturulur.",
    sector: "Dental",
    lastRun: "2 dk önce",
    nodes: [
      { id: "n1", type: "TRIGGER", icon: Phone, label: "Missed Call Webhook", sublabel: "Vapi / Twilio entegrasyonu", config: { delay: "0s" } },
      { id: "n2", type: "WAIT", icon: Clock, label: "60 Saniye Bekle", sublabel: "Debounce — çift tetik önleme", config: { duration: "60s" } },
      { id: "n3", type: "CONDITION", icon: Split, label: "Hasta Sisteme Kayıtlı mı?", sublabel: "CRM lookup via Supabase", config: { db: "leads" } },
      { id: "n4", type: "AI", icon: Brain, label: "Randevu Sihirbazı v4 → Ara", sublabel: "Neural Voice Agent — TR/EN", config: { agent: "Randevu Sihirbazı v4" } },
      { id: "n5", type: "ACTION", icon: Database, label: "CRM'e Kaydet + Randevu Oluştur", sublabel: "Supabase leads tablosu", config: { table: "leads" } },
      { id: "n6", type: "ACTION", icon: Send, label: "WhatsApp Onay Mesajı Gönder", sublabel: "Twilio WA Business API", config: { template: "appointment_confirmation" } },
    ],
    stats: { execTime: "62s", successRate: "96.4%", totalRuns: 2841, savedHours: 47 },
    status: "active",
  },
  {
    id: "wf-002",
    title: "Reputation Crisis Shield",
    category: "Crisis",
    trigger: "1-Star Review Detected",
    description: "Şikayetvar / Google'da 1-2 yıldız yorum tespit edildiğinde 15 dakika içinde nötralize edilir.",
    sector: "Tüm Sektörler",
    lastRun: "14 dk önce",
    nodes: [
      { id: "n1", type: "TRIGGER", icon: Star, label: "Yorum Sensörü (1-2★)", sublabel: "Google + Şikayetvar webhook", config: {} },
      { id: "n2", type: "AI", icon: Brain, label: "Sentiment Analizi + Yanıt Taslağı", sublabel: "GPT-4o — Empati protokolü", config: { tone: "empathetic" } },
      { id: "n3", type: "BRANCH", icon: GitBranch, label: "Kriz Seviyesi?", sublabel: "Skor ≥ 8 → Hukuki hazırlık", config: { threshold: "8" } },
      { id: "n4", type: "ACTION", icon: Phone, label: "AI Özür Çağrısı Yap", sublabel: "Vapi agent — %50 indirim teklifi", config: { discount: "50%" } },
      { id: "n5", type: "ACTION", icon: Send, label: "Yöneticiye SMS Alert", sublabel: "Twilio SMS — anlık bildirim", config: {} },
    ],
    stats: { execTime: "8ms", successRate: "99.1%", totalRuns: 452, savedHours: 31 },
    status: "active",
  },
  {
    id: "wf-003",
    title: "Kayıp Hasta Geri Kazanma",
    category: "Retention",
    trigger: "90+ Days No Visit",
    description: "90 gün randevusuz hastaları AI call + WhatsApp sekansıyla geri kazanır.",
    sector: "Dental / Sağlık",
    lastRun: "3 saat önce",
    nodes: [
      { id: "n1", type: "TRIGGER", icon: Calendar, label: "90 Gün Ziyaretsiz Hasta", sublabel: "Supabase cron query", config: { days: "90" } },
      { id: "n2", type: "AI", icon: Brain, label: "Kişiselleştirilmiş Mesaj Üret", sublabel: "Son işlem + hasta geçmişi", config: {} },
      { id: "n3", type: "ACTION", icon: Send, label: "WhatsApp Mesajı (Gün 1)", sublabel: "Nostalji + özel teklif", config: { day: "1" } },
      { id: "n4", type: "WAIT", icon: Clock, label: "3 Gün Bekle", sublabel: "Yanıt gelirse durdur", config: { duration: "3d" } },
      { id: "n5", type: "CONDITION", icon: Split, label: "Yanıt Verdi mi?", sublabel: "WA webhook kontrolü", config: {} },
      { id: "n6", type: "AI", icon: Phone, label: "AI Geri Arama (Gün 4)", sublabel: "Kayıp Hasta Geri Kazanma agent", config: { agent: "Kayıp Hasta" } },
    ],
    stats: { execTime: "async", successRate: "34.2%", totalRuns: 1103, savedHours: 89 },
    status: "active",
  },
  {
    id: "wf-004",
    title: "Lead Skorlama + CRM Atama",
    category: "Growth",
    trigger: "New Lead Created",
    description: "Yeni lead'i otomatik skorlar, sektöre göre doğru AI agent'a atar, nurture sekansını başlatır.",
    sector: "Hukuk / SaaS",
    lastRun: "32 dk önce",
    nodes: [
      { id: "n1", type: "TRIGGER", icon: Inbox, label: "Yeni Lead (Form/Chat/Çağrı)", sublabel: "Omni-channel webhook", config: {} },
      { id: "n2", type: "AI", icon: Brain, label: "Intent Skoru Hesapla (0-100)", sublabel: "GPT-4o sınıflandırıcı", config: { model: "gpt-4o" } },
      { id: "n3", type: "BRANCH", icon: GitBranch, label: "Skor ≥ 70?", sublabel: "Sıcak lead → öncelikli hat", config: { threshold: "70" } },
      { id: "n4", type: "AI", icon: Phone, label: "Anında AI Ön Görüşme", sublabel: "Danışma Uzmanı agent", config: {} },
      { id: "n5", type: "ACTION", icon: Database, label: "CRM Güncelle + Segment Ata", sublabel: "Supabase + tag sistemi", config: {} },
    ],
    stats: { execTime: "18ms", successRate: "91.7%", totalRuns: 4219, savedHours: 126 },
    status: "active",
  },
];

const TRIGGER_LIBRARY = [
  { id: "t1", category: "İletişim", icon: Phone, label: "Kaçırılan Çağrı", sublabel: "Vapi / Twilio" },
  { id: "t2", category: "İletişim", icon: MessageCircle, label: "WhatsApp Mesajı", sublabel: "WA Business API" },
  { id: "t3", category: "Yorum", icon: Star, label: "Yeni Google Yorumu", sublabel: "Google My Business" },
  { id: "t4", category: "Yorum", icon: AlertTriangle, label: "Şikayetvar Şikayeti", sublabel: "Webhook scraper" },
  { id: "t5", category: "CRM", icon: Users, label: "Yeni Lead", sublabel: "Form / API" },
  { id: "t6", category: "CRM", icon: Calendar, label: "Randevu Oluşturuldu", sublabel: "Takvim entegrasyonu" },
  { id: "t7", category: "Zamanlama", icon: Clock, label: "Cron Zamanlayıcı", sublabel: "Her gün / hafta / ay" },
  { id: "t8", category: "CRM", icon: TrendingUp, label: "90 Gün Ziyaretsiz", sublabel: "Supabase sorgusu" },
];

const ACTION_LIBRARY = [
  { id: "a1", category: "AI", icon: Brain, label: "AI Agent Ara", sublabel: "Vapi Voice" },
  { id: "a2", category: "Mesaj", icon: Send, label: "WhatsApp Gönder", sublabel: "Twilio WA" },
  { id: "a3", category: "Veri", icon: Database, label: "CRM Güncelle", sublabel: "Supabase" },
  { id: "a4", category: "AI", icon: Sparkles, label: "AI İçerik Üret", sublabel: "GPT-4o" },
  { id: "a5", category: "Bildirim", icon: Activity, label: "Slack / SMS Alert", sublabel: "Twilio SMS" },
  { id: "a6", category: "Bekleme", icon: Clock, label: "Bekle / Debounce", sublabel: "Zamanlama mantığı" },
];

// ─── NODE STATUS COLORS ───────────────────────────────────────────────────────

const nodeTypeStyles: Record<NodeType, { bg: string; border: string; icon: string; badge: string }> = {
  TRIGGER:   { bg: "bg-[#00ffd1]/10",  border: "border-[#00ffd1]/30",  icon: "text-[#00ffd1]",  badge: "bg-[#00ffd1]/20 text-[#00ffd1]" },
  CONDITION: { bg: "bg-amber-500/10",  border: "border-amber-500/30",  icon: "text-amber-400",  badge: "bg-amber-500/20 text-amber-400" },
  ACTION:    { bg: "bg-indigo-500/10", border: "border-indigo-500/30", icon: "text-indigo-400", badge: "bg-indigo-500/20 text-indigo-400" },
  AI:        { bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "text-purple-400", badge: "bg-purple-500/20 text-purple-400" },
  WAIT:      { bg: "bg-white/5",       border: "border-white/10",      icon: "text-white/40",   badge: "bg-white/10 text-white/40" },
  BRANCH:    { bg: "bg-orange-500/10", border: "border-orange-500/30", icon: "text-orange-400", badge: "bg-orange-500/20 text-orange-400" },
};

const statusStyles: Record<NodeStatus, string> = {
  idle:    "border-white/10",
  running: "border-[#00ffd1] shadow-[0_0_20px_rgba(0,255,209,0.3)]",
  success: "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
  error:   "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  skipped: "border-white/5 opacity-30",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AutomationsPage() {
  const { addActivity, toast } = useApp();
  const [activeTab, setActiveTab] = useState<MainTab>("flows");
  const [selectedId, setSelectedId] = useState("wf-001");
  const [isSimulating, setIsSimulating] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  const [builderStep, setBuilderStep] = useState(0);
  const [builderTrigger, setBuilderTrigger] = useState<string | null>(null);
  const [builderActions, setBuilderActions] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null);

  const currentFlow = WORKFLOWS.find(f => f.id === selectedId) || WORKFLOWS[0];

  const filteredFlows = WORKFLOWS.filter(f => {
    const matchCat = filterCategory === "Tümü" || f.category === filterCategory;
    const matchSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addLog = (msg: string, type: "info" | "success" | "warn" | "error" = "info") => {
    const prefix = { info: "›", success: "✓", warn: "⚠", error: "✗" }[type];
    setSimulationLogs(prev => [`${prefix} [${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 12));
  };

  useEffect(() => {
    const resetStatuses: Record<string, NodeStatus> = {};
    currentFlow.nodes.forEach(n => { resetStatuses[n.id] = "idle"; });
    setNodeStatuses(resetStatuses);
    setSimulationLogs([]);
    setActiveNodeIndex(null);
  }, [selectedId]);

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    const resetStatuses: Record<string, NodeStatus> = {};
    currentFlow.nodes.forEach(n => { resetStatuses[n.id] = "idle"; });
    setNodeStatuses(resetStatuses);

    addLog(`FLOW BAŞLATILDI: "${currentFlow.title}"`, "info");
    addLog(`Tetikleyici: ${currentFlow.trigger}`, "info");
    addActivity(`Automation test: ${currentFlow.title}`, 'system');

    let step = 0;
    const interval = setInterval(() => {
      if (step < currentFlow.nodes.length) {
        const node = currentFlow.nodes[step];
        setActiveNodeIndex(step);
        setNodeStatuses(prev => ({ ...prev, [node.id]: "running" }));

        setTimeout(() => {
          const success = Math.random() > 0.05;
          setNodeStatuses(prev => ({ ...prev, [node.id]: success ? "success" : "error" }));
          addLog(
            success
              ? `[${node.type}] ${node.label} — BAŞARILI`
              : `[${node.type}] ${node.label} — HATA (yeniden deneniyor...)`,
            success ? "success" : "error"
          );
        }, 900);

        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveNodeIndex(null);
        addLog("FLOW TAMAMLANDI — Tüm node'lar başarıyla çalıştı.", "success");
        toast("Automation başarıyla çalıştı", "success");
      }
    }, 1600);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    setActiveNodeIndex(null);
    addLog("Simülasyon kullanıcı tarafından durduruldu.", "warn");
  };

  const totalSavedHours = WORKFLOWS.reduce((s, f) => s + f.stats.savedHours, 0);
  const totalRuns = WORKFLOWS.reduce((s, f) => s + f.stats.totalRuns, 0);
  const activeCount = WORKFLOWS.filter(f => f.status === "active").length;

  const TABS: { id: MainTab; label: string; icon: any }[] = [
    { id: "flows",    label: "Flow Merkezi",    icon: GitBranch },
    { id: "builder",  label: "Flow Builder",    icon: Layers },
    { id: "triggers", label: "Trigger Kütüphanesi", icon: Zap },
    { id: "analytics",label: "Performans",      icon: BarChart3 },
  ];

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20">
      <PageHeader
        title="Decision Engine"
        statusText={`${activeCount} Aktif Flow // ${totalRuns.toLocaleString()} Çalışma // ${totalSavedHours} Saat Tasarruf`}
        action={
          <div className="flex gap-3">
            <button
              onClick={() => { setActiveTab("builder"); setBuilderStep(0); }}
              className="flex items-center gap-2 bg-[#00ffd1] text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
            >
              <Plus size={14} /> Yeni Flow
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-[#00ffd1]/40 transition-all disabled:opacity-50"
            >
              {isSimulating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Simüle Et
            </button>
          </div>
        }
      />

      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: "Aktif Flow", value: `${activeCount}`, icon: Radio, color: "#00ffd1" },
          { label: "Toplam Çalışma", value: totalRuns.toLocaleString(), icon: Activity, color: "#a78bfa" },
          { label: "Başarı Oranı", value: "95.3%", icon: CheckCircle2, color: "#34d399" },
          { label: "Tasarruf Edilen Saat", value: `${totalSavedHours}h`, icon: Clock, color: "#f59e0b" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-panel p-6 flex items-center gap-5">
            <div className="p-3 rounded-xl" style={{ background: `${kpi.color}15` }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-white italic">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TAB BAR */}
      <div className="flex gap-2 mb-10 border-b border-white/5 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-[#00ffd1] text-black"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: FLOWS ── */}
      <AnimatePresence mode="wait">
        {activeTab === "flows" && (
          <motion.div key="flows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-12 gap-8">
            {/* LEFT: FLOW LIST */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              {/* SEARCH + FILTER */}
              <div className="flex gap-3 mb-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Flow ara..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs outline-none focus:border-[#00ffd1]/30 font-mono"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 text-white/50 text-[10px] font-mono outline-none"
                >
                  {["Tümü", "Growth", "Crisis", "Retention", "Operations"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {filteredFlows.map(flow => {
                const isSelected = flow.id === selectedId;
                const catColors: Record<string, string> = {
                  Growth: "#00ffd1", Crisis: "#ef4444", Retention: "#a78bfa", Operations: "#60a5fa",
                };
                return (
                  <div
                    key={flow.id}
                    onClick={() => { setSelectedId(flow.id); setActiveTab("flows"); }}
                    className={`glass-panel p-7 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? "border-l-[#00ffd1] bg-[#00ffd1]/5 border-[#00ffd1]/20"
                        : "border-l-transparent hover:border-l-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-mono"
                            style={{ background: `${catColors[flow.category] || "#00ffd1"}20`, color: catColors[flow.category] || "#00ffd1" }}
                          >
                            {flow.category}
                          </span>
                          <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            flow.status === "active" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/20"
                          }`}>
                            {flow.status === "active" ? "● AKTIF" : "○ DURDURULDU"}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white italic uppercase tracking-tight leading-tight">{flow.title}</h3>
                        <p className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-widest">{flow.sector}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed mb-4">{flow.description}</p>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                      {[
                        { label: "Çalışma", val: flow.stats.totalRuns.toLocaleString() },
                        { label: "Başarı", val: flow.stats.successRate },
                        { label: "Tasarruf", val: `${flow.stats.savedHours}h` },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{s.label}</p>
                          <p className="text-sm font-black text-white italic">{s.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* SIMULATION TERMINAL */}
              <div className="glass-panel p-6 bg-black/80 font-mono">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-[#00ffd1]/50">
                    <Terminal size={12} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Execution_Terminal</span>
                  </div>
                  <div className="flex gap-2">
                    {isSimulating ? (
                      <button onClick={handleStopSimulation} className="flex items-center gap-1 text-red-400 text-[9px] font-mono hover:text-red-300">
                        <Square size={10} /> Durdur
                      </button>
                    ) : (
                      <button onClick={() => setSimulationLogs([])} className="text-white/10 hover:text-white/30 text-[9px] font-mono">Temizle</button>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 min-h-[140px] max-h-[200px] overflow-y-auto">
                  {simulationLogs.length === 0 ? (
                    <p className="text-[10px] text-white/10 italic font-mono">Bekleniyor... "Simüle Et" ile başlat.</p>
                  ) : (
                    simulationLogs.map((log, i) => (
                      <p key={i} className={`text-[10px] font-mono ${
                        log.startsWith("✓") ? "text-green-400" :
                        log.startsWith("✗") ? "text-red-400" :
                        log.startsWith("⚠") ? "text-amber-400" :
                        "text-white/50"
                      }`}>
                        {log}
                      </p>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>

            {/* RIGHT: FLOW VISUALIZER */}
            <div className="col-span-12 lg:col-span-7">
              <div className="glass-panel h-full min-h-[700px] flex flex-col p-10 bg-black/40 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/5 pb-8 mb-10">
                  <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">{currentFlow.title}</h4>
                    <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest mt-1">
                      Trigger: {currentFlow.trigger} // Sektör: {currentFlow.sector}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="p-3 rounded-xl bg-[#00ffd1]/10 border border-[#00ffd1]/20 text-[#00ffd1] hover:bg-[#00ffd1] hover:text-black transition-all disabled:opacity-30"
                    >
                      {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    </button>
                    <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:border-white/20 transition-all">
                      <Settings2 size={16} />
                    </button>
                  </div>
                </div>

                {/* NODES */}
                <div className="flex-1 space-y-6 relative pl-2">
                  {/* Vertical line */}
                  <div className="absolute left-7 top-6 bottom-6 w-[1px] bg-gradient-to-b from-[#00ffd1]/20 via-white/5 to-transparent" />

                  {currentFlow.nodes.map((node, i) => {
                    const style = nodeTypeStyles[node.type];
                    const status = nodeStatuses[node.id] || "idle";
                    const isActive = activeNodeIndex === i;
                    const Icon = node.icon;
                    return (
                      <div key={node.id} className="relative flex gap-6">
                        {/* Node circle on line */}
                        <div className={`relative z-10 w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 transition-all duration-500 ${style.bg} ${statusStyles[status]}`}>
                          {status === "running" ? (
                            <Loader2 size={20} className={`${style.icon} animate-spin`} />
                          ) : status === "success" ? (
                            <CheckCircle2 size={20} className="text-green-400" />
                          ) : status === "error" ? (
                            <AlertCircle size={20} className="text-red-400" />
                          ) : (
                            <Icon size={20} className={style.icon} />
                          )}
                        </div>

                        {/* Node card */}
                        <div className={`flex-1 glass-panel p-6 transition-all duration-500 ${isActive ? "scale-[1.02] border-[#00ffd1]/20" : "opacity-60"}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-mono ${style.badge}`}>
                                  {node.type}
                                </span>
                                {isActive && (
                                  <span className="text-[8px] font-mono text-[#00ffd1] animate-pulse uppercase tracking-widest">
                                    ● ÇALIŞIYOR
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-black text-white italic uppercase tracking-tight">{node.label}</p>
                              <p className="text-[10px] font-mono text-white/30 mt-1 italic">{node.sublabel}</p>
                            </div>
                            <ChevronRight size={14} className="text-white/10 mt-1 flex-shrink-0" />
                          </div>
                          {node.config && Object.keys(node.config).length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {Object.entries(node.config).map(([k, v]) => (
                                <span key={k} className="text-[8px] font-mono bg-white/5 text-white/30 px-2 py-1 rounded-lg">
                                  {k}: <span className="text-[#00ffd1]/60">{v}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: BUILDER ── */}
        {activeTab === "builder" && (
          <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-panel p-12 border border-[#00ffd1]/10 rounded-[2rem]">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Visual Flow Builder</h3>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">Sürükle-bırak ile kendi automation'ını oluştur</p>
                </div>
                <div className="flex items-center gap-3">
                  {["Trigger Seç", "Node Ekle", "Yapılandır", "Yayınla"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${builderStep >= i ? "bg-[#00ffd1] text-black" : "bg-white/10 text-white/30"}`}>{i + 1}</div>
                      <span className={`text-[9px] font-mono uppercase tracking-widest hidden lg:block ${builderStep >= i ? "text-white/60" : "text-white/20"}`}>{s}</span>
                      {i < 3 && <ChevronRight size={12} className="text-white/10 hidden lg:block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 0: Trigger seç */}
              {builderStep === 0 && (
                <div className="space-y-6">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Adım 1 — Tetikleyici seç: Bu flow ne zaman başlasın?</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRIGGER_LIBRARY.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setBuilderTrigger(t.id); setBuilderStep(1); }}
                        className={`glass-panel p-6 text-left hover:border-[#00ffd1]/30 transition-all group ${builderTrigger === t.id ? "border-[#00ffd1]/40 bg-[#00ffd1]/5" : ""}`}
                      >
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#00ffd1]/10 w-fit mb-4 transition-all">
                          <t.icon size={20} className="text-white/40 group-hover:text-[#00ffd1] transition-colors" />
                        </div>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{t.label}</p>
                        <p className="text-[9px] font-mono text-white/30 mt-1">{t.sublabel}</p>
                        <span className="text-[8px] font-mono text-[#00ffd1]/40 uppercase tracking-widest">{t.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Action seç */}
              {builderStep === 1 && (
                <div className="space-y-6">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Adım 2 — Action'lar ekle: Bu tetikleyiciden sonra ne yapılsın?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ACTION_LIBRARY.map(a => {
                      const selected = builderActions.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => setBuilderActions(prev => selected ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                          className={`glass-panel p-6 text-left transition-all group ${selected ? "border-[#00ffd1]/40 bg-[#00ffd1]/5" : "hover:border-[#00ffd1]/20"}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-white/5 w-fit">
                              <a.icon size={18} className={selected ? "text-[#00ffd1]" : "text-white/30"} />
                            </div>
                            {selected && <CheckCircle2 size={16} className="text-[#00ffd1]" />}
                          </div>
                          <p className="text-sm font-black text-white italic uppercase tracking-tight">{a.label}</p>
                          <p className="text-[9px] font-mono text-white/30 mt-1">{a.sublabel}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setBuilderStep(0)} className="px-6 py-3 rounded-xl border border-white/10 text-white/30 text-[10px] font-mono uppercase tracking-widest hover:border-white/20 transition-all">Geri</button>
                    <button
                      onClick={() => { if (builderActions.length > 0) setBuilderStep(2); else toast("En az 1 action seç", "error"); }}
                      className="px-6 py-3 rounded-xl bg-[#00ffd1] text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Devam ({builderActions.length} seçili)
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Önizleme */}
              {builderStep === 2 && (
                <div className="space-y-6">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Adım 3 — Önizleme ve yayınla</p>
                  <div className="glass-panel p-8 space-y-4 bg-black/40">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-[#00ffd1]/10"><Zap size={18} className="text-[#00ffd1]" /></div>
                      <div>
                        <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest">TETIKLEYICI</p>
                        <p className="text-sm font-black text-white italic">{TRIGGER_LIBRARY.find(t => t.id === builderTrigger)?.label}</p>
                      </div>
                    </div>
                    {builderActions.map(aId => {
                      const a = ACTION_LIBRARY.find(x => x.id === aId)!;
                      return (
                        <div key={aId} className="flex items-center gap-4 ml-8 pl-4 border-l border-white/10">
                          <div className="p-3 rounded-xl bg-indigo-500/10"><a.icon size={16} className="text-indigo-400" /></div>
                          <div>
                            <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">ACTION</p>
                            <p className="text-sm font-black text-white italic">{a.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setBuilderStep(1)} className="px-6 py-3 rounded-xl border border-white/10 text-white/30 text-[10px] font-mono uppercase tracking-widest hover:border-white/20 transition-all">Geri</button>
                    <button
                      onClick={() => { setBuilderStep(0); setBuilderTrigger(null); setBuilderActions([]); setActiveTab("flows"); toast("Flow yayınlandı!", "success"); addActivity("Yeni automation oluşturuldu", "system"); }}
                      className="px-8 py-3 rounded-xl bg-[#00ffd1] text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                    >
                      Yayınla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TAB: TRIGGERS ── */}
        {activeTab === "triggers" && (
          <motion.div key="triggers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Mevcut Trigger'lar</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRIGGER_LIBRARY.map(t => (
                    <div key={t.id} className="glass-panel p-6 group hover:border-[#00ffd1]/20 transition-all">
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#00ffd1]/10 w-fit mb-4 transition-all">
                        <t.icon size={20} className="text-white/30 group-hover:text-[#00ffd1] transition-colors" />
                      </div>
                      <p className="text-sm font-black text-white italic uppercase tracking-tight">{t.label}</p>
                      <p className="text-[9px] font-mono text-white/30 mt-1">{t.sublabel}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">{t.category}</span>
                        <span className="text-[8px] font-mono text-green-400 uppercase">● Aktif</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Kullanılabilir Action'lar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ACTION_LIBRARY.map(a => (
                    <div key={a.id} className="glass-panel p-6 group hover:border-indigo-500/20 transition-all">
                      <div className="p-3 rounded-xl bg-indigo-500/10 w-fit mb-4">
                        <a.icon size={18} className="text-indigo-400" />
                      </div>
                      <p className="text-sm font-black text-white italic uppercase tracking-tight">{a.label}</p>
                      <p className="text-[9px] font-mono text-white/30 mt-1">{a.sublabel}</p>
                      <span className="text-[8px] font-mono text-indigo-400/50 uppercase tracking-widest mt-2 block">{a.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: ANALYTICS ── */}
        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-12 gap-8">
              {/* Flow Performans Tablosu */}
              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel p-8">
                  <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-6">Flow Performans Matrisi</h3>
                  <div className="space-y-4">
                    {WORKFLOWS.map(flow => {
                      const successNum = parseFloat(flow.stats.successRate);
                      const catColors: Record<string, string> = { Growth: "#00ffd1", Crisis: "#ef4444", Retention: "#a78bfa", Operations: "#60a5fa" };
                      const color = catColors[flow.category] || "#00ffd1";
                      return (
                        <div key={flow.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded font-black" style={{ background: `${color}20`, color }}>{flow.category}</span>
                              <span className="text-sm font-black text-white italic uppercase tracking-tight">{flow.title}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-[9px] font-mono text-white/30">{flow.stats.totalRuns.toLocaleString()} çalışma</span>
                              <span className="text-sm font-black italic" style={{ color }}>{flow.stats.successRate}</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${successNum}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: color, boxShadow: `0 0 12px ${color}60` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sağ: Tasarruf & İstatistik */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="glass-panel p-8 bg-[#00ffd1]/5 border-[#00ffd1]/20">
                  <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest mb-2">Toplam Tasarruf</p>
                  <p className="text-5xl font-black text-[#00ffd1] italic">{totalSavedHours}h</p>
                  <p className="text-xs text-white/30 mt-2 font-mono">Bu ay manuel işlem yerine AI çalıştı</p>
                </div>
                <div className="glass-panel p-8">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4">Kategori Dağılımı</p>
                  {[
                    { cat: "Growth", count: 2, color: "#00ffd1" },
                    { cat: "Crisis", count: 1, color: "#ef4444" },
                    { cat: "Retention", count: 1, color: "#a78bfa" },
                  ].map(c => (
                    <div key={c.cat} className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-white italic uppercase">{c.cat}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(c.count / WORKFLOWS.length) * 100}%`, background: c.color }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: c.color }}>{c.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="glass-panel p-8 bg-green-500/5 border-green-500/10">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <p className="text-[9px] font-mono text-green-400 uppercase tracking-widest">Sistem Durumu</p>
                  </div>
                  <p className="text-sm font-black text-white italic uppercase">Tüm Flowlar Sağlıklı</p>
                  <p className="text-[9px] font-mono text-white/20 mt-1">Son kontrol: {new Date().toLocaleTimeString("tr-TR")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
