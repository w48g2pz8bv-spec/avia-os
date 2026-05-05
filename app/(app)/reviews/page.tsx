"use client";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import {
  Activity, Zap, CheckCircle2, Loader2, Globe, Brain, Star,
  RefreshCcw, AlertTriangle, MessageSquare, PhoneCall,
  Gift, Calendar, Send, FileText, BarChart3, Shield,
  ChevronRight, Copy, Sparkles, Target, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";

type MainTab = 'overview' | 'inbox' | 'winback' | 'content' | 'campaigns';

const PLATFORMS = [
  { name: 'Google Maps', icon: '🟢', reviews: 142, avg: 4.8, trend: +3, color: '#4285F4', weight: 'Birincil' },
  { name: 'Şikayetvar', icon: '🟠', reviews: 8, avg: 3.2, trend: -1, color: '#FF6B35', weight: 'Kritik' },
  { name: 'Zocdoc', icon: '🟣', reviews: 34, avg: 4.6, trend: +2, color: '#6366F1', weight: 'İkincil' },
  { name: 'Sahibinden', icon: '🟡', reviews: 12, avg: 4.1, trend: 0, color: '#F59E0B', weight: 'İkincil' },
];

const INBOX_REVIEWS = [
  {
    id: 1, user: "Melih Akkali", source: "Google Maps", platform: 'google',
    time: "14 dk önce", rating: 5,
    comment: "Klinikteki ilgi muazzamdı. İmplant süreci beklediğimden çok daha hızlı ve ağrısız geçti. Hijyen standartları en üst seviyede.",
    sentiment: "POSITIVE", safetyScore: 99,
    frameworks: {
      ack: "Hızlı iyileşme ve ağrısız süreç deneyiminizi takdir ediyoruz.",
      reframe: "Teknolojimiz, geleneksel implant korkularını konfora dönüştürmek için tasarlandı.",
      pivot: "Bir sonraki kontrolünüzde yeni dijital tarama sistemimizi de deneyimleyeceksiniz."
    },
    injectedKeywords: ["Painless Implant", "Digital Dentistry", "Hygienic Standards"]
  },
  {
    id: 2, user: "Selin K.", source: "Şikayetvar", platform: 'sikayetvar',
    time: "5 saat önce", rating: 1,
    comment: "Doktor çok aceleciydi, sorularıma tam cevap alamadım. İletişim konusunda hayal kırıklığı yaşadım. Kesinlikle tavsiye etmiyorum.",
    sentiment: "NEGATIVE", safetyScore: 94,
    frameworks: {
      ack: "İletişim sürecinde yaşadığınız aksaklık için samimiyetle özür dileriz.",
      reframe: "Hızlı hizmet anlayışımız bazen detaylı açıklama beklentisinin önüne geçebiliyor.",
      pivot: "Sizin için 20 dakikalık özel bir ücretsiz konsültasyon tanımladık."
    },
    injectedKeywords: ["Patient Satisfaction", "Dedicated Care", "Quality Communication"]
  },
  {
    id: 3, user: "Ahmet Y.", source: "Zocdoc", platform: 'zocdoc',
    time: "1 gün önce", rating: 4,
    comment: "Genel olarak memnunum. Randevu bekleme süresi biraz uzun oldu ama doktor ilgiliydi.",
    sentiment: "POSITIVE", safetyScore: 88,
    frameworks: {
      ack: "Olumlu değerlendirmeniz için teşekkür ederiz.",
      reframe: "Yoğun talep nedeniyle oluşan bekleme sürelerini optimize etmek için çalışıyoruz.",
      pivot: "Öncelikli randevu sistemimizden yararlanmak ister misiniz?"
    },
    injectedKeywords: ["Expert Dentist", "Priority Appointment", "Patient Care"]
  }
];

const COMPETITOR_LEADS = [
  { name: "Rival Klinik Hastası", signal: "HIGH", distance: "1.2km", platform: "Şikayetvar", intent: "İmplant için alternatif arıyorum. Mevcut kliniğimde 3 haftadır randevu alamıyorum.", score: 94 },
  { name: "Yorumdan Lead", signal: "HIGH", distance: "800m", platform: "Google Maps", intent: "DrSmile çok pahalı diyorlar, başka bir yer önerir misiniz?", score: 88 },
  { name: "Forum Kullanıcısı", signal: "MED", distance: "2.8km", platform: "Şikayetvar", intent: "Diş beyazlatma için doğru kliniği arıyorum. Şikayetvarda kötü yorumlar gördüm.", score: 72 },
];

const SEASONAL_CAMPAIGNS = [
  {
    id: 'bayram', icon: '🌙', name: 'Ramazan Bayramı Kampanyası',
    desc: 'Bayram öncesi temizlik + kontrol hatırlatması. Geçen yıl %34 dönüşüm.',
    timing: '3 gün öncesinde', channel: 'SMS + Arama', status: 'ready',
    message: "Değerli hastamız, Ramazan Bayramı öncesinde sizi memnuniyetle karşılamak istiyoruz. Bayram öncesi diş kontrolünüz için bu hafta özel uygunluk var. Randevu için yanıtlayın."
  },
  {
    id: 'yilbasi', icon: '🎄', name: 'Yılbaşı Gülüşü Kampanyası',
    desc: 'Yeni yıla taze gülüşle girin. Beyazlatma + kontrol paketi.',
    timing: 'Aralık 25-31', channel: 'SMS + E-posta', status: 'scheduled',
    message: "Yeni yıla mükemmel bir gülüşle başlayın! Yılbaşı özel paketimizde diş beyazlatma + kontrol kombosunda %20 indirim sizi bekliyor."
  },
  {
    id: 'postop', icon: '💊', name: 'Operasyon Sonrası Review İsteme',
    desc: 'İşlem bittikten 48 saat sonra otomatik memnuniyet + yorum isteği.',
    timing: 'İşlemden 48 saat sonra', channel: 'SMS', status: 'active',
    message: "Sayın [AD], geçtiğimiz gün kliniğimizi ziyaret ettiniz. Umarız iyileşme süreciniz sorunsuz geçmektedir. Deneyiminizi Google'da paylaşır mısınız? [LINK]"
  },
  {
    id: 'winback', icon: '🤝', name: 'Kayıp Hasta Geri Kazanma',
    desc: '6+ aydır gelmeyen hastalara otomatik özel teklif.',
    timing: '6. ayda tetiklenir', channel: 'SMS + Arama', status: 'ready',
    message: "Sizi uzun süredir göremedik! Size özel %15 indirimli kontrol + röntgen paketimiz için bu ay randevu alabilirsiniz."
  },
];

export default function ReputationPage() {
  const { toast } = useToast();
  const { addActivity, supabase } = useApp();

  const [mainTab, setMainTab] = useState<MainTab>('overview');

  // Overview Stats
  const [sentimentScore] = useState(92.4);
  const [sentimentVelocity] = useState("ACCELERATING");
  const [crisisScore] = useState(18);
  const [isRecoveryActive] = useState(false);

  // Inbox & State
  const [selectedTone, setSelectedTone] = useState("Empathetic");
  const [draftingId, setDraftingId] = useState<number | null>(null);
  const [activeDrafts, setActiveDrafts] = useState<Record<string, string>>({});
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());
  const [platformFilter, setPlatformFilter] = useState('all');

  // Database Data
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [realLeads, setRealLeads] = useState<any[]>([]);
  const [knowledgeContext, setKnowledgeContext] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: reviewsData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (reviewsData) setRealReviews(reviewsData);

        const { data: leadsData } = await supabase.from('competitor_leads').select('*').order('created_at', { ascending: false });
        if (leadsData) setRealLeads(leadsData);

        const { data: kbData } = await supabase.from('documents').select('content').limit(5);
        if (kbData) setKnowledgeContext(kbData.map((d: any) => d.content).join("\n"));
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, [supabase]);

  // Handlers
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);

  const handleStartCampaign = () => {
    setIsCampaignActive(true);
    setCampaignProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 25;
      setCampaignProgress(p);
      if (p >= 100) { clearInterval(iv); setIsCampaignActive(false); }
    }, 800);
    addActivity("AI Reputation Multiplier başlatıldı.", "system");
    toast("Neural Competitor Displacement Active", "success");
  };

  const [isScanning, setIsScanning] = useState(false);
  const [winBackModal, setWinBackModal] = useState<any | null>(null);

  const handleScanLeads = async () => {
    setIsScanning(true);
    addActivity("Bölgesel rakip tarama başlatıldı.", "system");
    toast("Şikayetvar + Google Maps taranıyor...", "info");
    setTimeout(async () => {
      const { data } = await supabase.from('competitor_leads').select('*').order('created_at', { ascending: false });
      if (data) setRealLeads(data);
      setIsScanning(false);
      toast("3 yeni lead tespit edildi", "success");
    }, 3000);
  };

  const generateDraft = async (reviewId: string) => {
    setDraftingId(parseInt(reviewId as any) || 999);
    const review = realReviews.find(r => r.id === reviewId);
    if (!review) return;
    try {
      const res = await fetch('/api/reputation/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewContent: review.content,
          authorName: review.author_name,
          rating: review.rating,
          context: knowledgeContext
        })
      });
      const data = await res.json();
      setActiveDrafts(prev => ({ ...prev, [reviewId]: data.reply }));
      addActivity(`Yapay zeka yanıtı üretildi: ${review.author_name}`, 'agent');
      toast("Neural Reply Generated", "success");
    } catch {
      toast("Yanıt üretilemedi", "error");
    } finally {
      setDraftingId(null);
    }
  };

  const markResponded = (id: string) => {
    setRespondedIds(prev => new Set([...Array.from(prev), id]));
    toast("Yanıt gönderildi", "success");
    addActivity(`Yorum yanıtlandı`, 'agent');
  };

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'instagram' | 'story' | 'linkedin' | 'schema'>('instagram');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    if (!selectedReviewId) return;
    setGeneratingContent(true);
    const review = realReviews.find(r => r.id === selectedReviewId);
    if (!review) return;
    try {
      const res = await fetch('/api/vapi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Bu yorumdan ${contentType} oluştur: ${review.content}`,
          context: [],
          agentName: 'Content Factory'
        })
      });
      const data = await res.json();
      setGeneratedContent(data.response || '');
      toast("İçerik üretildi", "success");
    } catch {
      toast("Hata", "error");
    } finally {
      setGeneratingContent(false);
    }
  };

  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const launchCampaign = (id: string) => {
    setActiveCampaignId(id);
    toast("Kampanya aktifleştirildi", "success");
    setTimeout(() => setActiveCampaignId(null), 4000);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader
        title="Reputation Command Center"
        statusText={`Sentiment: ${sentimentScore}% // Kriz Skoru: ${crisisScore}/100`}
        action={
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartCampaign}
              disabled={isCampaignActive}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-[#00ffd1] transition-all disabled:opacity-50"
            >
              {isCampaignActive ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="black" />}
              {isCampaignActive ? `Scaling ${campaignProgress}%` : 'Reputation Multiplier'}
            </button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div className="flex items-center bg-white/5 p-1.5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
            { id: 'inbox', label: 'Yorum Kutusu', icon: MessageSquare },
            { id: 'winback', label: 'Rakip Kanalı', icon: Target },
            { id: 'content', label: 'İçerik Fabrikası', icon: Sparkles },
            { id: 'campaigns', label: 'Kampanyalar', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id as MainTab)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-500 ${mainTab === tab.id
                  ? 'bg-[#00ffd1] text-black shadow-[0_0_50px_rgba(0,255,209,0.3)] scale-105'
                  : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                }`}
            >
              <tab.icon size={14} className={mainTab === tab.id ? 'animate-pulse' : ''} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════
            TAB: GENEL BAKIŞ
        ════════════════════════════════════════════════ */}
        {mainTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            {/* Üst KPI Şeridi */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Ortalama Yıldız', value: '4.7', sub: '+0.2 bu ay', color: '#00ffd1', icon: Star },
                { label: 'Toplam Yorum', value: '196', sub: '+12 bu hafta', color: '#6366F1', icon: MessageSquare },
                { label: 'Yanıt Oranı', value: '%88', sub: 'Hedef: %95', color: '#F59E0B', icon: CheckCircle2 },
                { label: 'Kriz Skoru', value: `${crisisScore}/100`, sub: crisisScore < 30 ? 'Düşük Risk' : 'DİKKAT', color: crisisScore < 30 ? '#00ffd1' : '#EF4444', icon: Shield },
              ].map((kpi, i) => (
                <div key={i} className="glass-panel p-6 flex items-center gap-5">
                  <div className="p-3 rounded-2xl" style={{ backgroundColor: `${kpi.color}15` }}>
                    <kpi.icon size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{kpi.label}</p>
                    <p className="text-xl font-black italic" style={{ color: kpi.color }}>{kpi.value}</p>
                    <p className="text-[8px] text-white/30 mt-0.5">{kpi.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Monitör */}
            <div className="glass-panel p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-[#00ffd1]" />
                  <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Platform Dağılımı</h3>
                </div>
                <span className="text-[8px] font-mono text-white/20 uppercase italic">Canlı Senkronizasyon</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {PLATFORMS.map((p, i) => (
                  <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 blur-3xl -mr-8 -mt-8 opacity-10 rounded-full" style={{ backgroundColor: p.color }} />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.icon}</span>
                        <div>
                          <p className="text-[10px] font-black text-white">{p.name}</p>
                          <p className="text-[7px] font-mono uppercase tracking-widest" style={{ color: p.color }}>{p.weight}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-mono font-black ${p.trend > 0 ? 'text-emerald-400' : p.trend < 0 ? 'text-red-400' : 'text-white/20'}`}>
                        {p.trend > 0 ? `+${p.trend}` : p.trend}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>{p.reviews} yorum</span>
                        <span style={{ color: p.avg >= 4 ? '#00ffd1' : p.avg >= 3 ? '#F59E0B' : '#EF4444' }}>{p.avg} ★</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(p.avg / 5) * 100}%`, backgroundColor: p.color }} />
                      </div>
                    </div>
                    {p.name === 'Şikayetvar' && p.avg < 4 && (
                      <div className="mt-3 flex items-center gap-2 text-[8px] text-amber-400 font-mono">
                        <AlertTriangle size={10} />
                        <span>Acil yanıt gerekiyor</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kriz Tespit + Sentiment Grafiği */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 glass-panel p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-[#00ffd1]" />
                    <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Sentiment Telemetrisi (Son 8 Gün)</h3>
                  </div>
                  <span className={`text-[8px] font-mono font-black uppercase px-3 py-1 rounded-full ${sentimentVelocity === 'ACCELERATING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {sentimentVelocity}
                  </span>
                </div>
                <div className="flex items-end gap-3 h-32">
                  {[68, 72, 65, 80, 88, 85, 90, 92].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[7px] font-mono text-white/10 group-hover:text-white/40 transition-all">{h}%</span>
                      <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden" style={{ height: '100px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 0.6 }}
                          className={`absolute bottom-0 inset-x-0 ${isRecoveryActive && i > 5 ? 'bg-red-500' : 'bg-gradient-to-t from-indigo-500 to-[#00ffd1]'} opacity-60 group-hover:opacity-100 transition-all`}
                        />
                      </div>
                      <span className="text-[7px] font-mono text-white/10">G-{8 - i}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 glass-panel p-8 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle size={18} className={crisisScore > 50 ? 'text-red-500' : 'text-amber-400'} />
                  <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Kriz Öngörü Motoru</h3>
                </div>
                <div className="text-center space-y-4 py-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={crisisScore < 30 ? '#00ffd1' : crisisScore < 60 ? '#F59E0B' : '#EF4444'} strokeWidth="8"
                        strokeDasharray={`${crisisScore * 2.51} 251`} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black italic text-white">{crisisScore}</span>
                      <span className="text-[7px] font-mono text-white/20 uppercase">/100</span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase italic ${crisisScore < 30 ? 'text-[#00ffd1]' : 'text-amber-400'}`}>
                      {crisisScore < 30 ? 'Düşük Risk' : crisisScore < 60 ? 'İzleme Modu' : 'KRİZ ALARMI'}
                    </p>
                    <p className="text-[9px] text-white/30 mt-2 leading-relaxed">
                      {crisisScore < 30
                        ? 'Reputation sağlıklı. Şikayetvar skorunuzu takip edin.'
                        : 'Son 48 saatte negatif yorum artışı tespit edildi.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { addActivity("Kriz simülasyonu başlatıldı", "system"); toast("Kriz protokolü devrede", "info"); }}
                  className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Kriz Kalkanını Test Et
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: YORUM KUTUSU (INBOX)
        ════════════════════════════════════════════════ */}
        {mainTab === 'inbox' && (
          <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Filtreler + Ton Seçici */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mr-2">Platform:</span>
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'google', label: 'Google' },
                  { id: 'sikayetvar', label: 'Şikayetvar' },
                  { id: 'zocdoc', label: 'Zocdoc' },
                ].map(f => (
                  <button key={f.id} onClick={() => setPlatformFilter(f.id)}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-mono font-black uppercase transition-all ${platformFilter === f.id ? 'bg-[#00ffd1] text-black' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                {["Empathetic", "Professional", "Strategic", "Assertive"].map(tone => (
                  <button key={tone} onClick={() => setSelectedTone(tone)}
                    className={`px-5 py-2 rounded-xl text-[9px] font-mono font-black uppercase transition-all ${selectedTone === tone ? 'bg-[#00ffd1] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}>
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {realReviews.filter(item => platformFilter === 'all' || item.platform.toLowerCase().includes(platformFilter)).map(item => (
                <motion.div key={item.id} layout
                  className={`glass-panel p-8 space-y-6 group transition-all duration-500 hover:border-white/20 ${item.sentiment === 'Negative' ? 'border-red-500/20' : ''} ${respondedIds.has(item.id) ? 'opacity-50' : ''}`}>

                  <div className="flex justify-between items-start">
                    <div className="flex gap-5 items-start">
                      <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 text-lg font-black italic text-white/40 relative uppercase">
                        {item.author_name[0]}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black border border-white/10 rounded-full flex items-center justify-center text-[7px]">
                          {item.platform[0]}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-white flex items-center gap-3 flex-wrap">
                          {item.author_name}
                          <span className={`text-[7px] px-2 py-0.5 rounded-full font-mono font-black ${item.sentiment === 'Positive' ? 'bg-[#00ffd1]/10 text-[#00ffd1]' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>
                            {item.sentiment}
                          </span>
                          {respondedIds.has(item.id) && <span className="text-[7px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono uppercase">Yanıtlandı</span>}
                        </h4>
                        <p className="text-[9px] font-mono text-white/20 mt-1">{item.platform} • saniyeler önce</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className={i < item.rating ? 'text-[#00ffd1] fill-[#00ffd1]' : 'text-white/5'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-white/10 pl-4">"{item.content}"</p>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain size={11} className="text-[#00ffd1]" />
                          <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest font-black">Neural Strategy Injected</span>
                        </div>
                        <p className="text-[9px] text-white/40 leading-relaxed line-clamp-3">AIVA is matching this review with your {item.sentiment} engagement protocols.</p>
                      </div>
                  </div>

                  {/* Yanıt Alanı */}
                  {activeDrafts[item.id] && (
                    <div className="p-5 bg-[#00ffd1]/5 border border-[#00ffd1]/20 rounded-2xl">
                      <p className="text-[8px] font-mono text-[#00ffd1] uppercase tracking-widest mb-3 font-black">AI Yanıt Taslağı ({selectedTone})</p>
                      <p className="text-sm text-white/80 leading-relaxed">{activeDrafts[item.id]}</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => { navigator.clipboard.writeText(activeDrafts[item.id]); toast("Kopyalandı", "success"); }}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-mono text-white/40 hover:text-white transition-all uppercase">
                          <Copy size={11} /> Kopyala
                        </button>
                        <button onClick={() => markResponded(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black transition-all hover:scale-105 uppercase">
                          <CheckCircle2 size={11} /> Gönderildi Olarak İşaretle
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-black border border-white/10 rounded text-[7px] font-mono text-[#00ffd1] uppercase">Real-Time Insight</span>
                      <span className={`px-2 py-0.5 bg-black border border-white/10 rounded text-[7px] font-mono uppercase ${item.sentiment === 'Positive' ? 'text-emerald-500' : 'text-red-500'}`}>{item.sentiment} Matrix</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.sentiment === 'NEGATIVE' && (
                        <button onClick={() => { setWinBackModal(null); setMainTab('winback'); }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-mono font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                          <PhoneCall size={11} /> Geri Kazan
                        </button>
                      )}
                      <button onClick={() => generateDraft(item.id)} disabled={draftingId === item.id || respondedIds.has(item.id)}
                        className="flex items-center gap-2 bg-[#00ffd1] text-black px-6 py-2.5 rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all disabled:opacity-40">
                        {draftingId === item.id ? <Loader2 size={11} className="animate-spin" /> : <Brain size={11} />}
                        AI Yanıt Üret
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: RAKİP KANALI (WIN-BACK)
        ════════════════════════════════════════════════ */}
        {mainTab === 'winback' && (
          <motion.div key="winback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            <div className="grid grid-cols-12 gap-8">
              {/* Tarama Paneli */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Target size={18} className="text-red-400" />
                      <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Rakip Tarayıcı</h3>
                    </div>
                    <span className="text-[8px] font-mono text-[#00ffd1] border border-[#00ffd1]/20 px-2 py-0.5 rounded-full uppercase">Canlı</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed mb-6">
                    AIVA, Şikayetvar ve Google Maps'te rakip kliniğinize negatif yorum yazan hastaları tespit eder ve size lead olarak sunar.
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Tarama Yarıçapı', value: '5 km' },
                      { label: 'Platform', value: 'Şikayetvar + Google' },
                      { label: 'Güncelleme', value: 'Her 2 saatte' },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-mono">
                        <span className="text-white/20 uppercase">{s.label}</span>
                        <span className="text-white/60 font-black">{s.value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleScanLeads} disabled={isScanning}
                    className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00ffd1] transition-all disabled:opacity-50">
                    {isScanning ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Manuel Tarama Başlat'}
                  </button>
                </div>

                {/* Win-Back Akış Şeması */}
                <div className="glass-panel p-8">
                  <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-6">Otomatik Geri Kazanma Akışı</h3>
                  <div className="space-y-4">
                    {[
                      { step: '01', label: 'Şikayet Tespit', desc: 'Rakibe negatif yorum', icon: AlertTriangle, color: 'red' },
                      { step: '02', label: 'Lead Oluştur', desc: 'Niyet puanı hesapla', icon: Target, color: 'amber' },
                      { step: '03', label: 'SMS Gönder', desc: 'Özel teklif mesajı', icon: Send, color: 'indigo' },
                      { step: '04', label: 'AI Arama', desc: 'Randevu teklif çağrısı', icon: PhoneCall, color: 'emerald' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                          <s.icon size={13} className={`text-${s.color}-400`} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-white uppercase">{s.label}</p>
                          <p className="text-[8px] text-white/20">{s.desc}</p>
                        </div>
                        {i < 3 && <ChevronRight size={12} className="text-white/10 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lead Listesi */}
              <div className="col-span-12 lg:col-span-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Tespit Edilen Leadler</h2>
                  <span className="text-[9px] font-mono text-white/20">{realLeads.length} aktif lead</span>
                </div>
                <div className="space-y-4">
                  {realLeads.length === 0 ? (
                    <div className="p-12 text-center border border-white/5 bg-white/[0.02] rounded-3xl mt-4">
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Veritabanında Lead Kaydı Bulunamadı</p>
                      <p className="text-[8px] text-white/10 mt-2 font-mono">Lütfen SQL Editor üzerinden verilerin eklendiğinden emin olun.</p>
                    </div>
                  ) : (
                    realLeads.map((lead, i) => (
                      <div key={i} className="glass-panel p-8 hover:border-white/20 transition-all group">

                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-[7px] font-mono font-black uppercase ${lead.signal_level === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {lead.signal_level} SINYAL
                          </div>
                          <div className="px-3 py-1 bg-white/5 rounded-full text-[7px] font-mono text-white/40 uppercase">{lead.platform}</div>
                          <span className="text-[8px] text-white/20">{lead.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-white/20">Niyet Skoru</span>
                          <span className="text-sm font-black text-[#00ffd1]">{lead.score}%</span>
                        </div>
                      </div>
                      <h5 className="text-lg font-black text-white mb-3 group-hover:text-[#00ffd1] transition-all">{lead.name}</h5>
                      <div className="p-4 bg-black/60 rounded-2xl border border-white/5 mb-5">
                        <p className="text-[8px] text-indigo-400 font-mono font-black uppercase mb-1">Yakalanan Niyet</p>
                        <p className="text-[10px] text-white/60 italic leading-relaxed">"{lead.intent}"</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setWinBackModal(lead)}
                          className="flex items-center gap-2 px-6 py-3 bg-[#00ffd1] text-black rounded-xl text-[9px] font-mono font-black uppercase hover:scale-105 transition-all">
                          <Gift size={12} /> Teklif Gönder
                        </button>
                        <button onClick={() => { addActivity(`Lead aranıyor: ${lead.name}`, 'agent'); toast("AI arama kuyruğa eklendi", "success"); }}
                          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono font-black uppercase hover:text-white transition-all">
                          <PhoneCall size={12} /> AI ile Ara
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Win-Back Modal */}
            {winBackModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="w-full max-w-lg bg-[#050506] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-[0_0_60px_rgba(0,255,209,0.1)]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Gift size={18} className="text-[#00ffd1]" />
                      <h3 className="text-xs font-mono font-black text-white/60 uppercase tracking-widest">Geri Kazanma Teklifi</h3>
                    </div>
                    <button onClick={() => setWinBackModal(null)} className="text-white/20 hover:text-white transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl">
                    <p className="text-[8px] font-mono text-white/20 uppercase mb-2">{winBackModal.name} · {winBackModal.platform}</p>
                    <p className="text-xs text-white/60 italic">"{winBackModal.intent}"</p>
                  </div>
                  <textarea
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/80 font-mono resize-none focus:border-[#00ffd1]/40 outline-none"
                    defaultValue={`Merhaba, rakibinizde yaşadığınız sorunu duyduğumuza üzüldük. Size özel %20 indirimli ilk konsültasyon paketimizi sunmak istiyoruz. Uygun bir zaman ayarlayabilir miyiz?`}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { toast("SMS gönderildi", "success"); setWinBackModal(null); addActivity(`Win-back SMS: ${winBackModal.name}`, 'agent'); }}
                      className="py-4 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all">
                      SMS Gönder
                    </button>
                    <button onClick={() => { toast("AI arama kuyruğa eklendi", "success"); setWinBackModal(null); }}
                      className="py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all">
                      AI ile Ara
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: İÇERİK FABRİKASI
        ════════════════════════════════════════════════ */}
        {mainTab === 'content' && (
          <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Yorum Seçici */}
              <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="glass-panel p-8">
                  <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-6">1. Yorum Seç</h3>
                  <div className="space-y-3">
                    {INBOX_REVIEWS.filter(r => r.sentiment === 'POSITIVE').map(review => (
                      <div key={review.id} onClick={() => setSelectedReviewId(review.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedReviewId === review.id ? 'border-[#00ffd1]/40 bg-[#00ffd1]/5' : 'border-white/5 hover:border-white/10 bg-white/[0.02]'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black text-white">{review.user}</span>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} className="text-[#00ffd1] fill-[#00ffd1]" />)}
                          </div>
                        </div>
                        <p className="text-[9px] text-white/40 line-clamp-2 italic">"{review.comment}"</p>
                        <p className="text-[7px] font-mono text-white/20 mt-2 uppercase">{review.source}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-8">
                  <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic mb-6">2. İçerik Türü</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'instagram', label: 'Instagram Post', icon: Send },
                      { id: 'story', label: 'Story Metni', icon: Sparkles },
                      { id: 'linkedin', label: 'LinkedIn', icon: FileText },
                      { id: 'schema', label: 'Schema Markup', icon: BarChart3 },
                    ].map(t => (
                      <button key={t.id} onClick={() => setContentType(t.id as any)}
                        className={`p-4 rounded-2xl border text-[9px] font-mono font-black uppercase transition-all flex flex-col items-center gap-2 ${contentType === t.id ? 'border-[#00ffd1]/40 bg-[#00ffd1]/5 text-[#00ffd1]' : 'border-white/5 text-white/20 hover:text-white'}`}>
                        <t.icon size={16} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={generateContent} disabled={!selectedReviewId || generatingContent}
                    className="w-full mt-6 py-4 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all disabled:opacity-40">
                    {generatingContent ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'İçerik Üret'}
                  </button>
                </div>
              </div>

              {/* Üretilen İçerik */}
              <div className="col-span-12 lg:col-span-7">
                <div className="glass-panel p-8 h-full min-h-[500px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">3. Önizleme & Yayınla</h3>
                    {generatedContent && (
                      <button onClick={() => { navigator.clipboard.writeText(generatedContent); toast("İçerik kopyalandı", "success"); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-mono text-white/40 hover:text-white transition-all uppercase">
                        <Copy size={10} /> Kopyala
                      </button>
                    )}
                  </div>
                  {generatedContent ? (
                    <div className="flex-1 space-y-6">
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex-1">
                        <pre className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">{generatedContent}</pre>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { addActivity("Instagram'a içerik gönderildi", "sync"); toast("Instagram'a gönderildi", "success"); }}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-all">
                          <Send size={12} /> Instagram'a Gönder
                        </button>
                        <button onClick={() => { toast("Takvime eklendi", "success"); }}
                          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-black uppercase hover:text-white transition-all">
                          <Calendar size={12} /> Zamanla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-10">
                      <Sparkles size={64} strokeWidth={0.5} className="animate-pulse" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-center">Soldan yorum ve içerik türü seç, üret butonuna bas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: KAMPANYALAR
        ════════════════════════════════════════════════ */}
        {mainTab === 'campaigns' && (
          <motion.div key="campaigns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SEASONAL_CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className={`glass-panel p-8 space-y-6 transition-all ${activeCampaignId === campaign.id ? 'border-[#00ffd1]/40 shadow-[0_0_40px_rgba(0,255,209,0.05)]' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{campaign.icon}</span>
                      <div>
                        <h3 className="font-black text-white text-lg">{campaign.name}</h3>
                        <p className="text-[9px] font-mono text-white/20 uppercase mt-1">{campaign.timing} · {campaign.channel}</p>
                      </div>
                    </div>
                    <span className={`text-[7px] px-3 py-1 rounded-full font-mono font-black uppercase border ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' : campaign.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                      {campaign.status === 'active' ? 'Aktif' : campaign.status === 'scheduled' ? 'Planlandı' : 'Hazır'}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">{campaign.desc}</p>
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-3">Mesaj Şablonu</p>
                    <p className="text-[10px] text-white/60 italic leading-relaxed">{campaign.message}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => launchCampaign(campaign.id)}
                      disabled={activeCampaignId === campaign.id || campaign.status === 'active'}
                      className="flex-1 py-3 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all disabled:opacity-50">
                      {activeCampaignId === campaign.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Kampanyayı Başlat'}
                    </button>
                    <button className="px-5 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono font-black uppercase hover:text-white transition-all">
                      Düzenle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Özel Kampanya Oluştur */}
            <div className="glass-panel p-8 border-dashed border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={16} className="text-[#00ffd1]" />
                <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Özel Kampanya Oluştur</h3>
              </div>
              <p className="text-[10px] text-white/20 mb-6">Kendi hedef kitleniz, mesajınız ve zamanlamanızla özel review kampanyası oluşturun.</p>
              <button onClick={() => toast("Özel kampanya editörü yakında", "info")}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[9px] font-mono font-black uppercase hover:text-white transition-all">
                + Özel Kampanya
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div >
  );
}
