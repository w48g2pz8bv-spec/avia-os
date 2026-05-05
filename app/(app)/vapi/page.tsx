"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Vapi from "@vapi-ai/web";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import {
  Phone, Activity, Zap, Terminal, Shield, Brain, Database, Send,
  Loader2, Wand2, Rocket, Mic, BarChart3, BookOpen, Users, Play,
  Plus, X, CheckCircle2, AlertTriangle, TrendingUp, Clock, Target,
  RefreshCcw, Settings2, PhoneCall, PhoneMissed, PhoneIncoming,
  Star, Copy, ChevronRight, Calendar
} from "lucide-react";
import VapiWaveform from "@/components/ui/vapi-waveform";
import { useToast } from "@/lib/toast-context";

type MainTab = 'agents' | 'console' | 'campaigns' | 'playbook' | 'analytics';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: string };

// ─── VERİ MODELLERİ ─────────────────────────────────────────────────────────

const AGENT_ROSTER = [
  {
    id: 'appt', name: "Randevu Sihirbazı v4", sector: "Dental",
    role: "Gelen Çağrı & Lead Kalifikasyonu",
    status: "active",
    voice: "Jessica (Türkçe Nöral)",
    stats: { success: 94.2, latency: 840, calls: 1242, convRate: 34.1, avgDuration: "3m 12s" },
    prompt: `Sen AIVA adında profesyonel bir diş kliniği asistanısın. Dr. Mehmet Yılmaz Kliniği için randevu almak, hasta sorularını yanıtlamak ve yeni hasta kaydı yapmak konusunda uzmansın. Türkçe konuş, nazik ve güven verici ol. Hastanın acısını ve endişesini kabul et, ardından kliniğin üstün hijyen ve teknoloji standartlarını vurgula. Randevu almak için ısrarcı ama baskıcı olmayan bir yaklaşım benimse.`,
    defenses: [
      { trigger: "Fiyat Objeksiyonu", protocol: "Değer Çapalama", script: "Sistemimiz uzun vadede tasarruf sağlar. Şu an ki maliyetle karşılaştırırsak..." },
      { trigger: "Güven Sorgulaması", protocol: "Otorite Enjeksiyonu", script: "22 yıllık deneyimimiz ve 4.9 Google puanımız sizi güvence altına alır." },
      { trigger: "Erteleme", protocol: "Kıtlık Tetikleyici", script: "Bu hafta için sadece 2 slot kaldı. Bir sonraki müsaitlik 3 hafta sonra." },
    ],
    postCallActions: ["Google Review SMS", "CRM Sync", "Randevu Takvim Notu"],
    keywords: ["implant", "diş", "randevu", "ağrı", "protez"],
  },
  {
    id: 'review', name: "Review Optimizer v2", sector: "Dental",
    role: "Operasyon Sonrası Takip",
    status: "active",
    voice: "Ahmet (Sıcak Nöral)",
    stats: { success: 88.7, latency: 920, calls: 452, convRate: 71.2, avgDuration: "2m 05s" },
    prompt: `Sen hasta memnuniyetini ölçen ve 5 yıldızlı yorum bırakmalarını sağlayan bir asistansın. Operasyondan 24-48 saat sonra hastaları ara. Önce iyileşmelerini sor, rahatsızlıkları varsa kliniği bilgilendir. Memnunsa nazikçe Google yorumu iste ve direkt link gönder.`,
    defenses: [],
    postCallActions: ["Review SMS Gönder", "Memnuniyet DB Güncelle"],
    keywords: ["memnun", "ağrı", "iyileşme", "yorum", "stars"],
  },
  {
    id: 'winback', name: "Kayıp Hasta Geri Kazanma", sector: "Dental",
    role: "6+ Aydır Gelmeyen Hastalar",
    status: "paused",
    voice: "Jessica (Türkçe Nöral)",
    stats: { success: 61.4, latency: 880, calls: 203, convRate: 22.8, avgDuration: "4m 30s" },
    prompt: `Uzun süredir kliniğimizi ziyaret etmeyen hastalara ulaş. Onları özlediğimizi ifade et. Özel indirimli "hoş geldiniz geri" paketi teklif et. Neden gelmediklerini anla, objeksiyonlara hazır ol.`,
    defenses: [
      { trigger: "Başka Kliniğe Gittim", protocol: "Rekabet Savunması", script: "Sizi geri kazanmak için özel bir paket hazırladık..." },
    ],
    postCallActions: ["İndirim Kuponu SMS", "CRM Güncelle"],
    keywords: ["indirim", "geri", "paket", "teklif"],
  },
];

const CAMPAIGNS = [
  {
    id: 'c1', name: "Bayram Öncesi Kontrol", status: "active",
    agent: "Randevu Sihirbazı v4", targetCount: 340, called: 218,
    connected: 142, converted: 48, startDate: "2026-05-01", endDate: "2026-05-10",
    script: "Değerli hastamız, bayram öncesi rutin kontrolünüzü tamamlamak için kliniğimizde uygun slot bulunmaktadır.",
    sector: "Dental",
  },
  {
    id: 'c2', name: "İmplant Kampanyası", status: "scheduled",
    agent: "Randevu Sihirbazı v4", targetCount: 150, called: 0,
    connected: 0, converted: 0, startDate: "2026-05-15", endDate: "2026-05-30",
    script: "Diş implantı hakkında bilgi almak istediğinizi öğrendik. Bu ay özel fiyatlarımız var.",
    sector: "Dental",
  },
  {
    id: 'c3', name: "Post-Op Review İsteme", status: "active",
    agent: "Review Optimizer v2", targetCount: 89, called: 67,
    connected: 58, converted: 41, startDate: "2026-04-28", endDate: "2026-05-28",
    script: "Geçtiğimiz günkü işleminizden sonra nasıl hissediyorsunuz?",
    sector: "Dental",
  },
];

const PLAYBOOKS = [
  {
    id: 'pb_dental_intake', sector: "Dental", icon: "🦷",
    name: "Yeni Hasta Karşılama",
    desc: "İlk kez arayan veya kliniğe gelen hasta için tam protokol. Endişeleri gider, güven kur, randevu al.",
    steps: [
      { step: "Karşılama", script: "Merhaba! [Klinik Adı]'nı aradınız, ben AIVA. Nasıl yardımcı olabilirim?" },
      { step: "Empati Kur", script: "Ne tür bir rahatsızlık yaşıyorsunuz? Sizi anlıyorum, diş ağrısı çok zorlayıcı." },
      { step: "Güven İnşa", script: "22 yıldır hizmet veriyoruz ve 4.9 Google puanımız var. Sizi en iyi şekilde bakacağız." },
      { step: "Randevu Teklif", script: "Bu hafta Salı 14:00 veya Çarşamba 10:00 uygun mu?" },
      { step: "Konfirmasyon", script: "Harika! SMS ile randevu detaylarını göndereceğim. İyi günler!" },
    ],
    convRate: 78, usedBy: 2
  },
  {
    id: 'pb_dental_price', sector: "Dental", icon: "💰",
    name: "Fiyat Objeksiyonu Yönetimi",
    desc: "Hasta fiyat itirazı yaptığında değer çapalama + finansman seçenekleri + kıtlık protokolü.",
    steps: [
      { step: "Kabul Et", script: "Haklısınız, kaliteli diş tedavisi bir yatırım gerektirir." },
      { step: "Değer Çapala", script: "Ama düşünün: tek seferlik doğru tedavi vs. tekrar tekrar düşük kaliteli tedavi maliyeti." },
      { step: "Finansman Sun", script: "Ayrıca 6 ay taksit seçeneğimiz var, aylık sadece X TL." },
      { step: "Kıtlık Yarat", script: "Bu ayki kampanya fiyatı için sadece 5 slot kaldı." },
    ],
    convRate: 52, usedBy: 1
  },
  {
    id: 'pb_law_consult', sector: "Law", icon: "⚖️",
    name: "Hukuki Danışmanlık İlk Temas",
    desc: "Hukuk bürosu için ilk çağrı protokolü. Güven, gizlilik ve randevu odaklı.",
    steps: [
      { step: "Karşılama", script: "Av. Yılmaz Hukuk Bürosu, nasıl yardımcı olabilirim?" },
      { step: "Gizlilik Güvencesi", script: "Konuştuklarımız tamamen gizli kalacaktır." },
      { step: "Durumu Anla", script: "Kısaca durumunuzu anlatabilir misiniz?" },
      { step: "Aciliyet Değerlendir", script: "Bu durumun hukuki süre sınırlamaları olabilir. En kısa sürede görüşelim." },
    ],
    convRate: 64, usedBy: 1
  },
  {
    id: 'pb_realestate', sector: "Real Estate", icon: "🏠",
    name: "Gayrimenkul Lead Kalifikasyonu",
    desc: "Alıcı veya satıcı adayını hızlıca qualify et, bütçe ve zaman çerçevesini anla.",
    steps: [
      { step: "Karşılama", script: "Merhaba, portföyümüzdeki ilan hakkında bilgi almak istediniz?" },
      { step: "İhtiyaç Analizi", script: "Kaç odalı düşünüyorsunuz? Hangi semtler ilginizi çekiyor?" },
      { step: "Bütçe Belirle", script: "Bütçeniz ne aralıkta? Kredi kullanmayı düşünüyor musunuz?" },
      { step: "Aciliyet Ölç", script: "Ne zaman taşınmayı planlıyorsunuz?" },
      { step: "Randevu Al", script: "Sizi yarın 3 mülk gezisine davet edebilirim, uygun musunuz?" },
    ],
    convRate: 45, usedBy: 1
  },
];

const CALL_HISTORY = [
  { id: 'call1', prospect: "Ahmet Yılmaz", duration: "4m 12s", outcome: "CONVERTED", sentiment: 91, agent: "Randevu Sihirbazı v4", time: "14:32", objections: ["Fiyat"], postActions: ["SMS Gönderildi", "CRM Güncellendi"] },
  { id: 'call2', prospect: "Selin Kaya", duration: "1m 45s", outcome: "FOLLOW_UP", sentiment: 62, agent: "Randevu Sihirbazı v4", time: "13:15", objections: ["Zaman"], postActions: ["Hatırlatma Planlandı"] },
  { id: 'call3', prospect: "Mehmet D.", duration: "0m 38s", outcome: "NO_ANSWER", sentiment: 0, agent: "Review Optimizer v2", time: "11:00", objections: [], postActions: ["Otomatik Geri Arama Planlandı"] },
  { id: 'call4', prospect: "Zeynep A.", duration: "6m 02s", outcome: "CONVERTED", sentiment: 97, agent: "Randevu Sihirbazı v4", time: "10:20", objections: ["Güven"], postActions: ["SMS Gönderildi", "Google Review İstendi"] },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function VapiPage() {
  const { toast } = useToast();
  const { addActivity, knowledgeBase, user, supabase, trackEvent } = useApp();

  const [mainTab, setMainTab] = useState<MainTab>('agents');
  const [selectedAgentId, setSelectedAgentId] = useState('appt');

  // Real Database Data
  const [realCallHistory, setRealCallHistory] = useState<any[]>([]);

  useEffect(() => {
    if (mainTab === 'analytics') {
      const fetchCalls = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('vapi_calls').select('*').order('created_at', { ascending: false }).limit(20);
        if (data && !error) setRealCallHistory(data);
      };
      fetchCalls();
    }
  }, [mainTab, supabase]);

  // Console
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callStatus, setCallStatus] = useState<'inactive' | 'loading' | 'active'>('inactive');
  const [neuralLogs, setNeuralLogs] = useState<string[]>([]);
  const [whisperLogs, setWhisperLogs] = useState<string[]>([]);
  const vapiRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Campaign
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', agent: 'appt', targetCount: '', script: '' });

  // Playbook
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [activeSectorFilter, setActiveSectorFilter] = useState('all');

  // Agent editor
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  const currentAgent = AGENT_ROSTER.find(a => a.id === selectedAgentId) || AGENT_ROSTER[0];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, neuralLogs]);

  const addNeuralLog = (msg: string) =>
    setNeuralLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 6));

  useEffect(() => {
    // Initialize Vapi only once
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
      
      vapiRef.current.on('call-start', () => {
        setCallStatus('active');
        addNeuralLog("Vapi araması başladı");
      });

      vapiRef.current.on('call-end', () => {
        setCallStatus('inactive');
        addNeuralLog("Vapi araması sonlandı");
      });

      vapiRef.current.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
           setMessages(prev => [...prev, {
             role: message.role === 'user' ? 'user' : 'assistant',
             content: message.transcript,
             timestamp: new Date().toLocaleTimeString()
           }]);
        }
      });

      vapiRef.current.on('error', (e: any) => {
        console.error("Vapi Error:", e);
        setCallStatus('inactive');
        addNeuralLog("HATA: Vapi bağlantı sorunu");
      });
    }

    return () => {
      // Cleanup
      if (vapiRef.current && callStatus === 'active') {
        vapiRef.current.stop();
      }
    };
  }, []);

  const toggleCall = () => {
    if (callStatus === 'active') {
      setCallStatus('loading');
      vapiRef.current.stop();
    } else {
      setCallStatus('loading');
      setMessages([]);
      addNeuralLog("Agent'a bağlanılıyor...");
      
      // Start call with overrides using currentAgent
      vapiRef.current.start({
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: currentAgent.prompt
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "cjVigY5qzO86Hznl2qN5" // Ex: Jessica voice placeholder
        }
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const TABS: { id: MainTab; label: string; icon: any }[] = [
    { id: 'agents', label: 'Agent Merkezi', icon: Users },
    { id: 'console', label: 'Canlı Konsol', icon: Terminal },
    { id: 'campaigns', label: 'Kampanyalar', icon: Rocket },
    { id: 'playbook', label: 'Playbook', icon: BookOpen },
    { id: 'analytics', label: 'Çağrı Analitik', icon: BarChart3 },
  ];

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader
        title="Neural Voice Command Center"
        statusText={`${AGENT_ROSTER.filter(a => a.status === 'active').length} Agent Aktif // ${CAMPAIGNS.filter(c => c.status === 'active').length} Kampanya Canlı // Latency: 840ms`}
        action={
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 px-6 border-r border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-mono text-white/20 uppercase">Bu Ay Dönüşüm</span>
                <span className="text-sm font-black text-[#00ffd1]">₺1.4M+</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-mono text-white/20 uppercase">Ort. Close Rate</span>
                <span className="text-sm font-black text-indigo-400">34.2%</span>
              </div>
            </div>
            <button
              onClick={() => { addActivity("Canlı agent başlatıldı", "agent"); toast("Agent Canlıya Alındı", "success"); }}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all shadow-[0_0_30px_rgba(0,255,209,0.2)]"
            >
              <Phone size={14} fill="black" /> Canlı Agent Başlat
            </button>
          </div>
        }
      />

      {/* TAB BAR */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setMainTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-5 text-[10px] font-mono font-black uppercase tracking-widest whitespace-nowrap transition-all border-r border-white/5 ${mainTab === tab.id ? 'bg-white/5 text-[#00ffd1] shadow-[inset_0_-2px_0_#00ffd1]' : 'text-white/20 hover:text-white'}`}>
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════
            TAB: AGENT MERKEZİ
        ════════════════════════════════ */}
        {mainTab === 'agents' && (
          <motion.div key="agents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="grid grid-cols-12 gap-8">

              {/* Agent Listesi */}
              <div className="col-span-12 lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Aktif Agent Filosu</h2>
                  <button onClick={() => toast("Yeni agent editörü yakında", "info")}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono text-white/40 hover:text-white transition-all uppercase">
                    <Plus size={11} /> Yeni Agent
                  </button>
                </div>
                {AGENT_ROSTER.map(agent => (
                  <div key={agent.id} onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all group relative overflow-hidden ${selectedAgentId === agent.id ? 'bg-[#00ffd1]/5 border-[#00ffd1]/40 shadow-[0_0_40px_rgba(0,255,209,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                    {selectedAgentId === agent.id && <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffd1]/5 blur-3xl -mr-16 -mt-16" />}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-[#00ffd1] shadow-[0_0_8px_#00ffd1]' : 'bg-white/20'} flex-shrink-0`} />
                          <span className={`text-sm font-black uppercase italic tracking-tight ${selectedAgentId === agent.id ? 'text-[#00ffd1]' : 'text-white/60'}`}>{agent.name}</span>
                        </div>
                        <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{agent.role}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {agent.status === 'active' ? 'AKTİF' : 'DURDURULDU'}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 relative z-10">
                      {[
                        { label: 'Başarı', value: `%${agent.stats.success}` },
                        { label: 'Dönüşüm', value: `%${agent.stats.convRate}` },
                        { label: 'Çağrı', value: agent.stats.calls.toLocaleString('en-US') },
                      ].map((s, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[7px] font-mono text-white/20 uppercase">{s.label}</p>
                          <p className={`text-xs font-black italic ${selectedAgentId === agent.id ? 'text-[#00ffd1]' : 'text-white/60'}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Agent Detay */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="glass-panel p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{currentAgent.name}</h3>
                      <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest mt-1">{currentAgent.role} · {currentAgent.voice}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setSelectedAgentId(currentAgent.id); setMainTab('console'); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all">
                        <Play size={11} /> Test Et
                      </button>
                      <button onClick={() => setEditingAgentId(currentAgent.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono font-black uppercase hover:text-white transition-all">
                        <Settings2 size={11} /> Düzenle
                      </button>
                    </div>
                  </div>

                  {/* Performans Metrikleri */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Başarı Oranı', value: `%${currentAgent.stats.success}`, color: '#00ffd1', icon: TrendingUp },
                      { label: 'Dönüşüm', value: `%${currentAgent.stats.convRate}`, color: '#6366F1', icon: Target },
                      { label: 'Ort. Süre', value: currentAgent.stats.avgDuration, color: '#F59E0B', icon: Clock },
                      { label: 'Latency', value: `${currentAgent.stats.latency}ms`, color: '#10B981', icon: Zap },
                    ].map((m, i) => (
                      <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <m.icon size={14} style={{ color: m.color }} className="mx-auto mb-2" />
                        <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-sm font-black italic" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Agent Prompt */}
                  <div className="space-y-3 mb-6">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Davranışsal DNA</p>
                    <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                      <p className="text-[10px] text-white/60 leading-relaxed font-mono italic">{currentAgent.prompt}</p>
                    </div>
                  </div>

                  {/* Defense Protocols */}
                  {currentAgent.defenses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Savunma Protokolleri</p>
                      <div className="space-y-2">
                        {currentAgent.defenses.map((d, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <Shield size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[8px] font-mono text-red-400 uppercase font-black">{d.trigger} → {d.protocol}</p>
                              <p className="text-[9px] text-white/40 italic mt-1">"{d.script}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post-Call Actions */}
                  <div className="space-y-3">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Çağrı Sonrası Otomasyonlar</p>
                    <div className="flex flex-wrap gap-2">
                      {currentAgent.postCallActions.map((action, i) => (
                        <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-full text-[8px] font-mono text-[#00ffd1] uppercase font-black">
                          <CheckCircle2 size={9} />
                          {action}
                        </span>
                      ))}
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-mono text-white/20 hover:text-white transition-all uppercase">
                        <Plus size={9} /> Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Düzenleme Modal */}
            {editingAgentId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="w-full max-w-2xl bg-[#050506] border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-[0_0_60px_rgba(0,255,209,0.1)]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-mono font-black text-white/60 uppercase tracking-widest">Agent DNA Kalibrasyonu</h3>
                    <button onClick={() => setEditingAgentId(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-2">Agent Adı</label>
                      <input defaultValue={currentAgent.name} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none" />
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-2">Ses Profili</label>
                      <select defaultValue={currentAgent.voice} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none">
                        <option>Jessica (Türkçe Nöral)</option>
                        <option>Ahmet (Sıcak Nöral)</option>
                        <option>Ayşe (Profesyonel)</option>
                        <option>Mehmet (Güven Verici)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-2">Davranışsal DNA (Prompt)</label>
                      <textarea defaultValue={currentAgent.prompt} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono resize-none focus:border-[#00ffd1]/40 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => { setEditingAgentId(null); toast("Agent güncellendi", "success"); }}
                    className="w-full py-4 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                    DNA'yı Kaydet
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════
            TAB: CANLI KONSOL
        ════════════════════════════════ */}
        {mainTab === 'console' && (
          <motion.div key="console" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-12 gap-8">
              {/* Sol: Whisper + Defense */}
              <div className="col-span-12 lg:col-span-4 space-y-6">

                {/* Agent Seçici */}
                <div className="glass-panel p-6 space-y-3">
                  <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Test Edilecek Agent</p>
                  {AGENT_ROSTER.filter(a => a.status === 'active').map(agent => (
                    <div key={agent.id} onClick={() => setSelectedAgentId(agent.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAgentId === agent.id ? 'border-[#00ffd1]/40 bg-[#00ffd1]/5' : 'border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase italic ${selectedAgentId === agent.id ? 'text-[#00ffd1]' : 'text-white/40'}`}>{agent.name}</span>
                        {selectedAgentId === agent.id && <Zap size={12} className="text-[#00ffd1]" />}
                      </div>
                      <p className="text-[7px] font-mono text-white/20 mt-0.5">{agent.voice}</p>
                    </div>
                  ))}
                </div>

                {/* Neural Whisper */}
                <div className="glass-panel p-6 bg-indigo-500/5 border-indigo-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain size={14} className="text-indigo-400" />
                    <h3 className="text-[8px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Neural Whisper Coach</h3>
                  </div>
                  <div className="space-y-2 min-h-[140px] max-h-[180px] overflow-y-auto scrollbar-hide">
                    {whisperLogs.length === 0
                      ? <p className="text-[8px] text-white/5 italic">Konuşma bekleniyor...</p>
                      : whisperLogs.map((log, i) => (
                        <div key={i} className="text-[8px] p-2.5 bg-black/40 border border-indigo-500/10 rounded-xl text-indigo-300/70 italic animate-in slide-in-from-left-2">
                          {log}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Defense Matrix */}
                <div className="glass-panel p-6 bg-red-500/5 border-red-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={14} className="text-red-400" />
                    <h3 className="text-[8px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Aktif Savunma Matrisi</h3>
                  </div>
                  <div className="space-y-2">
                    {currentAgent.defenses.length > 0
                      ? currentAgent.defenses.map((d, i) => (
                        <div key={i} className="p-3 bg-black/40 rounded-xl border border-red-500/10">
                          <p className="text-[7px] font-black text-red-400 uppercase mb-0.5">{d.trigger}</p>
                          <p className="text-[8px] text-white/40 italic line-clamp-2">→ {d.script}</p>
                        </div>
                      ))
                      : <p className="text-[8px] text-white/10 italic">Bu agent için savunma tanımlı değil.</p>
                    }
                  </div>
                </div>
              </div>

              {/* Sağ: Chat Konsol */}
              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel flex flex-col min-h-[700px] overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#00ffd1]/10 rounded-2xl flex items-center justify-center">
                        <Mic size={16} className="text-[#00ffd1]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase italic">{currentAgent.name}</p>
                        <p className="text-[7px] font-mono text-white/20 uppercase">{currentAgent.voice} // {currentAgent.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-[#00ffd1] rounded-full animate-pulse shadow-[0_0_8px_#00ffd1]" />
                      <span className="text-[8px] font-mono text-white/20 uppercase">Simülasyon Modu</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-8 overflow-y-auto scrollbar-hide space-y-6" ref={scrollRef}>
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10 min-h-[400px]">
                        <Phone size={64} strokeWidth={0.5} className="animate-pulse" />
                        <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-center">Prospekt mesajı yaz — agent yanıt verir</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[8px] font-black ${msg.role === 'assistant' ? 'bg-[#00ffd1]/10 text-[#00ffd1]' : 'bg-white/5 text-white/20'}`}>
                          {msg.role === 'assistant' ? 'AI' : 'SEN'}
                        </div>
                        <div className={`max-w-[75%] p-5 rounded-[1.5rem] ${msg.role === 'assistant' ? 'bg-[#00ffd1]/5 border border-[#00ffd1]/20' : 'bg-white/5 border border-white/5'}`}>
                          <p className="text-sm text-white/80 leading-relaxed">"{msg.content}"</p>
                          <p className="text-[7px] font-mono text-white/20 mt-2 uppercase">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex gap-4 items-center animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-[#00ffd1]/10 flex items-center justify-center text-[8px] font-black text-[#00ffd1]">AI</div>
                        <div className="flex items-center gap-2 text-white/20 font-mono text-xs">
                          <Loader2 size={12} className="animate-spin text-[#00ffd1]" /> Nöral yol hesaplanıyor...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Son Çağrı Metrikleri */}
                  {messages.length > 2 && (
                    <div className="px-8 pb-2">
                      <VapiWaveform />
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { label: 'Niyet Skoru', value: '92%', color: '#00ffd1' },
                          { label: 'Duygusal Yansıma', value: 'Yüksek', color: '#6366F1' },
                          { label: 'Dönüşüm Olasılığı', value: '%78', color: '#10B981' },
                        ].map((m, i) => (
                          <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5 text-center">
                            <p className="text-[7px] font-mono text-white/20 uppercase">{m.label}</p>
                            <p className="text-[10px] font-black italic" style={{ color: m.color }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input / Voice Control */}
                  <div className="p-6 border-t border-white/5 bg-black/60 flex flex-col items-center justify-center space-y-4">
                    <button 
                      onClick={toggleCall}
                      disabled={callStatus === 'loading'}
                      className={`flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all ${
                        callStatus === 'active' 
                          ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                          : callStatus === 'loading'
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-[#00ffd1] text-black hover:bg-[#00ffd1]/80 shadow-[0_0_30px_rgba(0,255,209,0.2)] hover:scale-105'
                      }`}
                    >
                      {callStatus === 'loading' ? (
                        <><Loader2 size={18} className="animate-spin" /> Bağlanıyor...</>
                      ) : callStatus === 'active' ? (
                        <><Phone size={18} className="animate-pulse" /> Aramayı Sonlandır</>
                      ) : (
                        <><Mic size={18} /> Canlı Sesli Görüşme Başlat</>
                      )}
                    </button>
                    {callStatus === 'active' && (
                      <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-widest animate-pulse">
                        Mikrofon Aktif — Agent Sizi Dinliyor
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════
            TAB: KAMPANYALAR
        ════════════════════════════════ */}
        {mainTab === 'campaigns' && (
          <motion.div key="campaigns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            {/* Kampanya KPI'ları */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Toplam Aranan', value: '285', sub: '3 kampanya', color: '#fff', icon: PhoneCall },
                { label: 'Bağlantı Oranı', value: '%71', sub: 'Sektör ort: %48', color: '#00ffd1', icon: PhoneIncoming },
                { label: 'Dönüşüm', value: '89', sub: '₺246K gelir', color: '#6366F1', icon: TrendingUp },
                { label: 'Cevapsız → Geri Arama', value: '100%', sub: 'Otomatik 60sn', color: '#10B981', icon: PhoneMissed },
              ].map((k, i) => (
                <div key={i} className="glass-panel p-6 flex items-center gap-4">
                  <div className="p-3 rounded-2xl" style={{ backgroundColor: `${k.color}15` }}>
                    <k.icon size={18} style={{ color: k.color }} />
                  </div>
                  <div>
                    <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{k.label}</p>
                    <p className="text-xl font-black italic" style={{ color: k.color }}>{k.value}</p>
                    <p className="text-[7px] text-white/20 mt-0.5">{k.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Kampanya Listesi + Oluşturma */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Kampanya Merkezi</h2>
                  <button onClick={() => setShowCampaignModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all">
                    <Plus size={12} /> Yeni Kampanya
                  </button>
                </div>
                {CAMPAIGNS.map(campaign => (
                  <div key={campaign.id} className="glass-panel p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${campaign.status === 'active' ? 'bg-[#00ffd1] shadow-[0_0_8px_#00ffd1] animate-pulse' : 'bg-indigo-400'}`} />
                          <h3 className="text-lg font-black text-white italic">{campaign.name}</h3>
                        </div>
                        <p className="text-[8px] font-mono text-white/20 uppercase">{campaign.agent} · {campaign.startDate} – {campaign.endDate}</p>
                      </div>
                      <span className={`text-[7px] px-3 py-1 rounded-full font-mono font-black uppercase border ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                        {campaign.status === 'active' ? 'CANLI' : 'PLANLI'}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase mb-2">
                        <span>İlerleme</span>
                        <span>{campaign.called}/{campaign.targetCount} arındı</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(campaign.called / campaign.targetCount) * 100}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-[#00ffd1] rounded-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-5">
                      {[
                        { label: 'Hedef', value: campaign.targetCount, color: 'text-white/40' },
                        { label: 'Arındı', value: campaign.called, color: 'text-white/60' },
                        { label: 'Bağlandı', value: campaign.connected, color: 'text-indigo-400' },
                        { label: 'Dönüştü', value: campaign.converted, color: 'text-[#00ffd1]' },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-3 bg-black/40 rounded-xl border border-white/5">
                          <p className="text-[7px] font-mono text-white/20 uppercase mb-1">{s.label}</p>
                          <p className={`text-base font-black italic ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
                      <p className="text-[7px] font-mono text-white/20 uppercase mb-1">Kampanya Scripti</p>
                      <p className="text-[10px] text-white/50 italic">"{campaign.script}"</p>
                    </div>

                    <div className="flex gap-3">
                      {campaign.status === 'active'
                        ? <button className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-mono font-black uppercase hover:bg-red-500 hover:text-white transition-all">Durdur</button>
                        : <button className="px-5 py-2.5 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all">Başlat</button>
                      }
                      <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono font-black uppercase hover:text-white transition-all">
                        Rapor
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cevapsız Arama Engine */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 bg-emerald-500/5 border-emerald-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <PhoneMissed size={18} className="text-emerald-400" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Cevapsız Arama Motoru</h3>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed mb-6">
                    Bir lead kliniği aradığında telefon açılmazsa, AIVA <strong className="text-white/80">60 saniye içinde</strong> otomatik geri arar. Rakipler bu hizmeti sunmuyor.
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Geri Arama Süresi', value: '< 60sn' },
                      { label: 'Bugün Geri Aranan', value: '14 çağrı' },
                      { label: 'Geri Kazanılan', value: '9 lead' },
                      { label: 'Kazanım Oranı', value: '%64' },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-mono p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-white/20 uppercase">{s.label}</span>
                        <span className="text-emerald-400 font-black">{s.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`p-4 rounded-xl border flex items-center gap-3 bg-emerald-500/10 border-emerald-500/20`}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-black">Motor Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kampanya Oluşturma Modal */}
            {showCampaignModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl">
                <div className="w-full max-w-xl bg-[#050506] border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-[0_0_60px_rgba(0,255,209,0.1)]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-mono font-black text-white/60 uppercase tracking-widest">Yeni Kampanya</h3>
                    <button onClick={() => setShowCampaignModal(false)} className="text-white/20 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))}
                      placeholder="Kampanya Adı" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none" />
                    <select onChange={e => setNewCampaign(p => ({ ...p, agent: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none">
                      {AGENT_ROSTER.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <input value={newCampaign.targetCount} onChange={e => setNewCampaign(p => ({ ...p, targetCount: e.target.value }))}
                      placeholder="Hedef Lead Sayısı" type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none" />
                    <textarea value={newCampaign.script} onChange={e => setNewCampaign(p => ({ ...p, script: e.target.value }))}
                      placeholder="Kampanya script metni..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 font-mono resize-none focus:border-[#00ffd1]/40 outline-none" />
                  </div>
                  <button onClick={() => { setShowCampaignModal(false); toast("Kampanya oluşturuldu", "success"); addActivity(`Yeni kampanya: ${newCampaign.name || 'İsimsiz'}`, 'system'); }}
                    className="w-full py-4 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                    Kampanyayı Oluştur ve Başlat
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════
            TAB: PLAYBOOK KÜTÜPHANESİ
        ════════════════════════════════ */}
        {mainTab === 'playbook' && (
          <motion.div key="playbook" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            {/* Sektör Filtresi */}
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mr-2">Sektör:</span>
              {['all', 'Dental', 'Law', 'Real Estate', 'SaaS'].map(s => (
                <button key={s} onClick={() => setActiveSectorFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-mono font-black uppercase transition-all ${activeSectorFilter === s ? 'bg-[#00ffd1] text-black' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                  {s === 'all' ? 'Tümü' : s}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Playbook Listesi */}
              <div className="col-span-12 lg:col-span-5 space-y-4">
                {PLAYBOOKS.filter(p => activeSectorFilter === 'all' || p.sector === activeSectorFilter).map(pb => (
                  <div key={pb.id} onClick={() => setSelectedPlaybook(pb.id)}
                    className={`glass-panel p-7 cursor-pointer transition-all ${selectedPlaybook === pb.id ? 'border-[#00ffd1]/40 bg-[#00ffd1]/5' : 'hover:border-white/10'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pb.icon}</span>
                        <div>
                          <h3 className={`text-sm font-black italic ${selectedPlaybook === pb.id ? 'text-[#00ffd1]' : 'text-white/80'}`}>{pb.name}</h3>
                          <p className="text-[7px] font-mono text-white/20 uppercase">{pb.sector} · {pb.usedBy} agent kullanıyor</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] font-mono text-white/20 uppercase">Dönüşüm</p>
                        <p className="text-sm font-black text-[#00ffd1]">%{pb.convRate}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-white/30 leading-relaxed">{pb.desc}</p>
                  </div>
                ))}
              </div>

              {/* Playbook Detay */}
              <div className="col-span-12 lg:col-span-7">
                {selectedPlaybook ? (() => {
                  const pb = PLAYBOOKS.find(p => p.id === selectedPlaybook)!;
                  return (
                    <div className="glass-panel p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{pb.icon}</span>
                          <div>
                            <h3 className="text-xl font-black italic text-white">{pb.name}</h3>
                            <p className="text-[9px] font-mono text-white/20 uppercase">{pb.sector} · %{pb.convRate} dönüşüm</p>
                          </div>
                        </div>
                        <button onClick={() => { toast(`${pb.name} agent'a atandı`, "success"); addActivity(`Playbook atandı: ${pb.name}`, 'agent'); }}
                          className="flex items-center gap-2 px-6 py-3 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all">
                          <Rocket size={12} /> Agent'a Ata
                        </button>
                      </div>

                      <div className="space-y-3">
                        {pb.steps.map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-[#00ffd1]/10 border border-[#00ffd1]/20 rounded-xl flex items-center justify-center text-[9px] font-black text-[#00ffd1] flex-shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </div>
                              {i < pb.steps.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2 mb-1" />}
                            </div>
                            <div className="pb-4">
                              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">{step.step}</p>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-white/70 leading-relaxed italic">"{step.script}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => { navigator.clipboard.writeText(pb.steps.map(s => `${s.step}: "${s.script}"`).join('\n')); toast("Playbook kopyalandı", "success"); }}
                        className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono uppercase hover:text-white transition-all">
                        <Copy size={11} /> Tüm Scripti Kopyala
                      </button>
                    </div>
                  );
                })() : (
                  <div className="glass-panel h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 opacity-10">
                    <BookOpen size={64} strokeWidth={0.5} />
                    <p className="text-[9px] font-mono uppercase tracking-[0.5em]">Bir playbook seç</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════
            TAB: ÇAĞRI ANALİTİK
        ════════════════════════════════ */}
        {mainTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            {/* Üst Metrik Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Toplam Çağrı', value: '1,897', color: '#fff', icon: Phone },
                { label: 'Bağlantı Oranı', value: '%71', color: '#00ffd1', icon: PhoneIncoming },
                { label: 'Dönüşüm', value: '%34', color: '#6366F1', icon: TrendingUp },
                { label: 'Ort. Süre', value: '3m 12s', color: '#F59E0B', icon: Clock },
                { label: 'Ortalama Duygu', value: '88/100', color: '#10B981', icon: Star },
              ].map((m, i) => (
                <div key={i} className="glass-panel p-5 flex items-center gap-3">
                  <m.icon size={16} style={{ color: m.color }} />
                  <div>
                    <p className="text-[7px] font-mono text-white/20 uppercase">{m.label}</p>
                    <p className="text-base font-black italic" style={{ color: m.color }}>{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Çağrı Geçmişi + Duygu Haritası */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">
                <h2 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-4">Son Çağrılar</h2>
                <div className="space-y-3">
                  {realCallHistory.length === 0 ? (
                    <div className="p-8 text-center text-white/30 font-mono text-[10px] uppercase tracking-widest border border-white/5 rounded-2xl bg-black/40">
                      Henüz gerçek çağrı verisi yok.
                    </div>
                  ) : realCallHistory.map(call => {
                    const durationSec = call.duration || 0;
                    const durString = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;
                    const timeStr = new Date(call.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    const outcome = call.status === 'completed' ? 'CONVERTED' : call.status === 'failed' ? 'NO_ANSWER' : 'FOLLOW_UP';
                    const prospect = call.prospect_name || "Web Arayan";
                    const agent = "Vapi Agent";
                    const sentiment = call.success_eval ? 95 : 50; // Geçici hesaplama
                    const objections = []; // Gelecekte AI analizinden gelecek

                    return (
                      <div key={call.id} className="glass-panel p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${outcome === 'CONVERTED' ? 'bg-[#00ffd1]/10' : outcome === 'FOLLOW_UP' ? 'bg-indigo-500/10' : 'bg-red-500/10'}`}>
                              {outcome === 'CONVERTED' ? <CheckCircle2 size={14} className="text-[#00ffd1]" /> : outcome === 'FOLLOW_UP' ? <Clock size={14} className="text-indigo-400" /> : <PhoneMissed size={14} className="text-red-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white">{prospect}</p>
                              <p className="text-[8px] font-mono text-white/20 uppercase">{agent} · {timeStr} · {durString}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {outcome !== 'NO_ANSWER' && (
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${sentiment}%`, backgroundColor: sentiment > 80 ? '#00ffd1' : sentiment > 60 ? '#F59E0B' : '#EF4444' }} />
                                </div>
                                <span className="text-[8px] font-mono text-white/20">{sentiment}</span>
                              </div>
                            )}
                            <span className={`text-[7px] px-2 py-0.5 rounded-full font-mono font-black uppercase border ${outcome === 'CONVERTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : outcome === 'FOLLOW_UP' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {outcome === 'CONVERTED' ? 'TAMAMLANDI' : outcome === 'FOLLOW_UP' ? 'DEVAM EDİYOR' : 'BAŞARISIZ'}
                            </span>
                          </div>
                        </div>
                        {call.summary && (
                          <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-white/50 italic leading-relaxed">
                            {call.summary}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duygu & İtiraz Haritası */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="glass-panel p-8">
                  <h3 className="text-[8px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-6">En Sık İtirazlar</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Fiyat', count: 142, pct: 72 },
                      { name: 'Zaman', count: 89, pct: 45 },
                      { name: 'Güven', count: 61, pct: 31 },
                      { name: 'Rekabet', count: 38, pct: 19 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[8px] font-mono mb-1">
                          <span className="text-white/40 uppercase">{item.name}</span>
                          <span className="text-white/20">{item.count}x</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-8">
                  <h3 className="text-[8px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-6">En Yüksek Dönüşüm Zamanları</h3>
                  <div className="space-y-3">
                    {[
                      { time: 'Sal 14:00-16:00', rate: '%52', insight: 'İdeal slot' },
                      { time: 'Çar 10:00-12:00', rate: '%48', insight: 'Güçlü' },
                      { time: 'Pzt 09:00-11:00', rate: '%41', insight: 'İyi' },
                      { time: 'Cum 15:00-17:00', rate: '%28', insight: 'Zayıf' },
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                        <div>
                          <p className="text-[9px] font-black text-white/60">{t.time}</p>
                          <p className={`text-[7px] font-mono uppercase ${i === 0 ? 'text-[#00ffd1]' : 'text-white/20'}`}>{t.insight}</p>
                        </div>
                        <span className={`text-sm font-black italic ${i === 0 ? 'text-[#00ffd1]' : 'text-white/40'}`}>{t.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
