/**
 * localReasoner — GPT kullanmadan yerel mantık yürütme motoru.
 *
 * Yetenekler:
 *   - Konu analizi (subject, tension, audience, emotion)
 *   - Psikolojik mekanizma seçimi (geçmiş feedback'ten öğrenir)
 *   - Hook üretimi (şablon × mekanizma × niş)
 *   - Sahne planlaması (platform × mekanizma)
 *   - A/B kazananlarından kalıcı öğrenme
 *
 * Sıfır GPT token. Tüm işlem lokal.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PsychMechanism =
  | "MERAK_BOSLUGU"
  | "INANC_KIRMA"
  | "KIMLIK_TEHDIDI"
  | "SPESIFIK_GERCEKLIK"
  | "SOSYAL_TEHDIT";

export type TopicIntent = {
  subject:   string;
  tension:   string;
  audience:  string;
  emotion:   string;
  mechanism: PsychMechanism;
};

export type LocalScene = {
  index:   number;
  time:    string;
  purpose: string;
  text:    string;
  overlay: string;
};

type ReasonerMemory = {
  hookScores:      Record<string, number>;
  topicMechanisms: Record<string, PsychMechanism>;
  nicheMechanisms: Record<string, PsychMechanism>;
  abWinners:       { hook: string; mechanism: PsychMechanism; score: number; ts: string }[];
  lastUpdated:     string;
};

// ─── Persistent memory ────────────────────────────────────────────────────────

const MEMORY_FILE = path.join(process.cwd(), "data", "reasoner-memory.json");

function loadMemory(): ReasonerMemory {
  try {
    return JSON.parse(readFileSync(MEMORY_FILE, "utf-8")) as ReasonerMemory;
  } catch {
    return {
      hookScores:      {},
      topicMechanisms: {},
      nicheMechanisms: {},
      abWinners:       [],
      lastUpdated:     new Date().toISOString(),
    };
  }
}

function saveMemory(mem: ReasonerMemory): void {
  try {
    mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
    writeFileSync(MEMORY_FILE, JSON.stringify(mem, null, 2), "utf-8");
  } catch {}
}

// ─── Niche → default mechanism (eğitim verisinden türetilmiş defaults) ─────────

const NICHE_DEFAULTS: Record<string, PsychMechanism> = {
  science:           "SPESIFIK_GERCEKLIK",
  money:             "KIMLIK_TEHDIDI",
  psychology:        "INANC_KIRMA",
  technology:        "INANC_KIRMA",
  history:           "MERAK_BOSLUGU",
  health:            "INANC_KIRMA",
  culture:           "MERAK_BOSLUGU",
  education:         "KIMLIK_TEHDIDI",
  general:           "SPESIFIK_GERCEKLIK",
  creator_growth:    "SOSYAL_TEHDIT",
  business_money:    "KIMLIK_TEHDIDI",
  ai_tech:           "INANC_KIRMA",
  health_fitness:    "INANC_KIRMA",
  relationship:      "KIMLIK_TEHDIDI",
  documentary_science: "MERAK_BOSLUGU",
  book_ideas:        "INANC_KIRMA",
};

// ─── Topic signal detectors ───────────────────────────────────────────────────

const TENSION_MAP: { pattern: RegExp; tension: string }[] = [
  { pattern: /neden|why/i,             tension: "neden-sonuç paradoksu" },
  { pattern: /nasıl|how/i,             tension: "yöntem bilinmezliği" },
  { pattern: /hata|yanlış|mistake/i,   tension: "kaçırılan fırsatlar" },
  { pattern: /para|kazanç|gelir/i,     tension: "finansal kayıp riski" },
  { pattern: /büyüme|growth|takipçi/i, tension: "büyüme engelinin kaynağı" },
  { pattern: /sağlık|health|diyet/i,   tension: "yaygın inanç çürütmesi" },
  { pattern: /tarih|history/i,         tension: "gizli kalmış gerçek" },
  { pattern: /teknoloji|ai|yapay/i,    tension: "hız farkı tehlikesi" },
  { pattern: /psikoloji|davranış/i,    tension: "bilinçsiz kalıp tuzağı" },
  { pattern: /ilişki|çift|evlilik/i,   tension: "anlaşılmamış kök neden" },
  { pattern: /kitap|okuma|öğren/i,     tension: "bilginin eylem boşluğu" },
  { pattern: /uyku|sleep|dinlenme/i,   tension: "mitin bilimle çatışması" },
];

const AUDIENCE_MAP: { pattern: RegExp; audience: string }[] = [
  { pattern: /girişim|startup|patron/i,  audience: "girişimciler" },
  { pattern: /creator|içerik|kanal/i,    audience: "içerik üreticileri" },
  { pattern: /öğrenci|okul|üniversite/i, audience: "öğrenciler" },
  { pattern: /fitness|spor|antrenman/i,  audience: "spor yapanlar" },
  { pattern: /yatırım|borsa|kripto/i,    audience: "yatırımcılar" },
  { pattern: /pazarlama|satış|reklam/i,  audience: "pazarlamacılar" },
  { pattern: /ailesi|çocuk|ebeveyn/i,    audience: "ebeveynler" },
  { pattern: /kod|yazılım|developer/i,   audience: "yazılımcılar" },
];

// ─── Topic intent analysis ────────────────────────────────────────────────────

export function analyzeTopicIntent(topic: string, niche = "general"): TopicIntent {
  const lower = topic.toLowerCase();
  const mem   = loadMemory();

  const tensionMatch   = TENSION_MAP.find(s => s.pattern.test(lower));
  const audienceMatch  = AUDIENCE_MAP.find(s => s.pattern.test(lower));

  // Mechanism: learned > niche default
  const mechanism: PsychMechanism =
    (mem.nicheMechanisms[niche] as PsychMechanism) ||
    NICHE_DEFAULTS[niche] ||
    "SPESIFIK_GERCEKLIK";

  const emotionMap: Record<PsychMechanism, string> = {
    MERAK_BOSLUGU:      "merak",
    INANC_KIRMA:        "şok + aydınlanma",
    KIMLIK_TEHDIDI:     "aciliyet + tehdit",
    SPESIFIK_GERCEKLIK: "güven + güç",
    SOSYAL_TEHDIT:      "rekabet korkusu",
  };

  return {
    subject:   topic.slice(0, 60),
    tension:   tensionMatch?.tension ?? "bilinmeyen fark",
    audience:  audienceMatch?.audience ?? "meraklı izleyiciler",
    emotion:   emotionMap[mechanism],
    mechanism,
  };
}

// ─── Hook templates (mechanism × 5 varyant) ──────────────────────────────────
// {KONU} = topic placeholder

const HOOK_TEMPLATES: Record<PsychMechanism, string[]> = {
  MERAK_BOSLUGU: [
    "{KONU} hakkında kimsenin sormadığı soru: gerçekte ne oluyor?",
    "{KONU}'nun arka planında ne var — çoğu kaynak bunu atlıyor.",
    "Neden {KONU} hakkındaki her şey yüzeysel kalıyor? Cevap şaşırtıcı.",
    "{KONU}'da gözden kaçan tek detay en kritik olanı.",
    "{KONU}'yu araştırdıkça çözmek yerine daha derin bir soru çıkıyor.",
  ],
  INANC_KIRMA: [
    "{KONU} hakkında öğrendiklerinin çoğu yanlış — işte veri ne diyor.",
    "Herkesin {KONU} için doğru sandığı şey aslında tam tersi çalışıyor.",
    "{KONU} ile ilgili en yaygın inanç bir yanlış anlamanın ürünü.",
    "Uzmanların {KONU} hakkında söylemediği şey: popüler yaklaşım işe yaramıyor.",
    "{KONU}'ya dair ne kadar çok öğrenirsen, o kadar çok yanlış bildiğini görürsün.",
  ],
  KIMLIK_TEHDIDI: [
    "{KONU} konusunda hâlâ eski yöntemi kullanıyorsan, kaybediyorsun.",
    "Çevrendekiler {KONU}'yu çözdü — sen hâlâ aynı noktada mısın?",
    "2025'te hâlâ {KONU} için eski sistemi kullanmak ciddi bir risk.",
    "{KONU}'da sonuç alamıyorsan, asıl sorun yönteminle değil — başka bir şeyle.",
    "Eğer {KONU}'yu bilmiyorsan, sektörden bir adım geride başlıyorsun.",
  ],
  SPESIFIK_GERCEKLIK: [
    "{KONU}: 3 ayda sonucu belirleyen tek faktör neydi?",
    "Araştırmalar {KONU}'da başarıyı belirleyen 1 değişkeni ortaya koydu.",
    "{KONU} hakkında veri ne diyor — rakamlar konuşuyor.",
    "{KONU}'da fark yaratan %10'luk grup ne yapıyor? Sayılar açık.",
    "Veri {KONU}'da neyin işe yaradığını net olarak gösteriyor.",
  ],
  SOSYAL_TEHDIT: [
    "Rakiplerin {KONU}'yu nasıl kullandığını bilsen, bu videoyu kaçırmazdın.",
    "{KONU}'da önde olanlar bunu yıllardır sessizce yapıyor.",
    "{KONU}'yu bilen azınlık ile bilmeyen çoğunluk arasındaki fark büyüyor.",
    "Sektörün geri kalanı {KONU}'ya geçti — sen hâlâ bekliyor musun?",
    "Bu {KONU} bilgisine sahip olanlar, olmayanlardan 3 adım önde.",
  ],
};

// ─── Hook generation ──────────────────────────────────────────────────────────

export function generateLocalHooks(
  topic:     string,
  mechanism: PsychMechanism,
  count    = 5,
): string[] {
  const templates = HOOK_TEMPLATES[mechanism] || HOOK_TEMPLATES.SPESIFIK_GERCEKLIK;
  const mem       = loadMemory();
  const topicShort = topic.slice(0, 50);

  const hooks = templates.map(t => t.replace(/\{KONU\}/g, topicShort));

  const scored = hooks.map(h => ({
    hook:  h,
    score: mem.hookScores[h.slice(0, 40)] ?? 50,
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.hook);
}

// ─── Scene planner (GPT olmadan, platform × mekanizma) ───────────────────────

const SCENE_FRAMES: Record<string, { purpose: string; timeRange: string }[]> = {
  TikTok: [
    { purpose: "hook",     timeRange: "0:00–0:06" },
    { purpose: "problem",  timeRange: "0:06–0:20" },
    { purpose: "evidence", timeRange: "0:20–0:38" },
    { purpose: "payoff",   timeRange: "0:38–0:52" },
    { purpose: "cta",      timeRange: "0:52–1:00" },
  ],
  "Instagram Reels": [
    { purpose: "hook",     timeRange: "0:00–0:05" },
    { purpose: "setup",    timeRange: "0:05–0:18" },
    { purpose: "value",    timeRange: "0:18–0:32" },
    { purpose: "payoff",   timeRange: "0:32–0:42" },
    { purpose: "cta",      timeRange: "0:42–0:48" },
  ],
  "YouTube Shorts": [
    { purpose: "hook",     timeRange: "0:00–0:07" },
    { purpose: "problem",  timeRange: "0:07–0:20" },
    { purpose: "context",  timeRange: "0:20–0:35" },
    { purpose: "evidence", timeRange: "0:35–0:48" },
    { purpose: "payoff",   timeRange: "0:48–0:54" },
    { purpose: "cta",      timeRange: "0:54–1:00" },
  ],
  X: [
    { purpose: "hook",     timeRange: "tweet-1" },
    { purpose: "evidence", timeRange: "tweet-2" },
    { purpose: "insight",  timeRange: "tweet-3" },
    { purpose: "cta",      timeRange: "tweet-4" },
  ],
};

const SCENE_TEXTS: Record<string, Partial<Record<PsychMechanism, string>>> = {
  hook: {
    MERAK_BOSLUGU:      "{KONU} hakkında gerçekten ne biliyorsun? Çoğu insan yanlış noktaya bakıyor.",
    INANC_KIRMA:        "{KONU} hakkında öğrendiklerinin büyük kısmı yanlış. Ve bu sadece başlangıç.",
    KIMLIK_TEHDIDI:     "Hâlâ {KONU} için eski yöntemi mi kullanıyorsun? Bu video tam sana göre.",
    SPESIFIK_GERCEKLIK: "{KONU}'da fark yaratan %10'luk grup ne yapıyor? Sayılar şaşırtıcı.",
    SOSYAL_TEHDIT:      "Rakiplerin {KONU}'yu nasıl kullandığını görsen, hemen harekete geçerdin.",
  },
  problem: {
    MERAK_BOSLUGU:      "{KONU} hakkında konuşulan her şey yüzeysel kalıyor. Asıl soruya kimse girmiyor.",
    INANC_KIRMA:        "{KONU}'da en yaygın yaklaşım neden işe yaramıyor? Araştırmalar başka şey söylüyor.",
    KIMLIK_TEHDIDI:     "Çevrendeki herkes {KONU}'da ilerledi. Sen aynı noktada mısın?",
    SPESIFIK_GERCEKLIK: "Verilere bakarsak, {KONU}'da çoğunluğun yaptığı şey sonucu %60 düşürüyor.",
    SOSYAL_TEHDIT:      "Sektördeki öncüler {KONU}'ya çoktan geçti. Geride kalmak risk.",
  },
  evidence: {
    MERAK_BOSLUGU:      "Araştırmacılar {KONU} üzerinde yıllarca çalıştı. Ortaya çıkan sonuç: asıl mesele başka yerde.",
    INANC_KIRMA:        "Çalışmalar {KONU}'da popüler yöntemin, alternatifine göre çok daha az etkili olduğunu gösteriyor.",
    KIMLIK_TEHDIDI:     "{KONU}'da başarılı olanlar ortak bir yol izliyor — ve bu yol çoğunun sandığından çok farklı.",
    SPESIFIK_GERCEKLIK: "3 ay boyunca {KONU}'yu test ettik. Tek değişken %340 fark yarattı.",
    SOSYAL_TEHDIT:      "Pazar liderlerinin {KONU} için ayırdığı kaynak geçen yıla göre 4 katına çıktı.",
  },
  payoff: {
    MERAK_BOSLUGU:      "Sonuç: {KONU}'da asıl fark yaratan şey görünmez olanda saklı. Bunu gördüğünde her şey değişiyor.",
    INANC_KIRMA:        "Doğruyu bilmek {KONU}'da seni ilk %10'a sokar. Çünkü çoğu hâlâ yanlışı yapıyor.",
    KIMLIK_TEHDIDI:     "{KONU}'yu çözmen için gereken tek şey bu bakış açısı değişikliği.",
    SPESIFIK_GERCEKLIK: "{KONU}'da bu veriyi bilen biri artık rastgele hareket etmez. Sistem çalışıyor.",
    SOSYAL_TEHDIT:      "{KONU} bilgisi artık bir avantaj değil, zorunluluk. Erken öğrenmek fark yaratıyor.",
  },
  cta: {
    MERAK_BOSLUGU:      "Devam videosu için takipte kal. Asıl hikaye bitmedi.",
    INANC_KIRMA:        "Yaygın inanışları çürüten diğer içerikler için profili ziyaret et.",
    KIMLIK_TEHDIDI:     "Hemen uygula. İlk adım her zaman en kritik olanı.",
    SPESIFIK_GERCEKLIK: "Veriyi doğrulamak istiyorsan yorumlarda sor.",
    SOSYAL_TEHDIT:      "Bu bilgiyi bilmeyenlerle paylaş — ya da paylaşma. Seçim sende.",
  },
  setup:   { INANC_KIRMA: "{KONU} hakkında öğrenilenlerin büyük çoğunluğu tek bir kaynaktan geliyor — o kaynağın sınırlı olduğu yerde." },
  value:   { SPESIFIK_GERCEKLIK: "{KONU}'da pratik fark yaratan 3 unsur var. Çoğu sadece birini biliyor." },
  context: { MERAK_BOSLUGU: "{KONU}'nun arka planını anlamak için önce bir adım geri çekilmek gerekiyor." },
  insight: { INANC_KIRMA: "Bu bilgi {KONU} alanında çoğunun aksine çalışıyor — ama veri bunu destekliyor." },
};

export function planLocalScenes(
  topic:     string,
  platform:  string,
  mechanism: PsychMechanism,
): LocalScene[] {
  const frames    = SCENE_FRAMES[platform] || SCENE_FRAMES.TikTok;
  const topicShort = topic.slice(0, 40);

  return frames.map((frame, i) => {
    const texts    = SCENE_TEXTS[frame.purpose];
    const template = texts?.[mechanism] || texts?.SPESIFIK_GERCEKLIK || `${topicShort} hakkında kritik bilgi.`;
    const text     = template.replace(/\{KONU\}/g, topicShort);
    const overlay  = frame.purpose === "hook"
      ? topicShort.toUpperCase()
      : frame.purpose === "cta"
        ? "TAKIP ET →"
        : `${topicShort} | ${i + 1}`;

    return { index: i + 1, time: frame.timeRange, purpose: frame.purpose, text, overlay };
  });
}

// ─── Learning: A/B kazananları + kullanıcı feedback'ten öğren ─────────────────

export function learnFromFeedback(
  hook:      string,
  score:     number,
  niche:     string,
  mechanism: PsychMechanism,
): void {
  const mem = loadMemory();
  const key = hook.slice(0, 40);

  // Hook skoru: üstel hareketli ortalama (yeni veri %30 ağırlık)
  const prev = mem.hookScores[key] ?? 50;
  mem.hookScores[key] = Math.round(prev * 0.7 + score * 0.3);

  // Niş için mechanism güncelle (score >= 70 ise)
  if (score >= 70) {
    mem.nicheMechanisms[niche] = mechanism;
  }

  // A/B kazananları listesi (son 100)
  if (score >= 80) {
    mem.abWinners.unshift({ hook, mechanism, score, ts: new Date().toISOString() });
    mem.abWinners = mem.abWinners.slice(0, 100);
  }

  mem.lastUpdated = new Date().toISOString();
  saveMemory(mem);
}

// ─── Top learned hooks for a niche ───────────────────────────────────────────

export function getLearnedHooksForNiche(niche: string, limit = 3): string[] {
  const mem = loadMemory();
  return mem.abWinners
    .filter(w => w.score >= 75)
    .slice(0, 20)
    .map(w => w.hook)
    .slice(0, limit);
}
