/**
 * scriptEngine — Platform bazlı sahne sahne TAM senaryo üretir.
 *
 * 2-aşamalı pipeline:
 *   Stage 1 → buildResearchAnglesPrompt()  : Araştırma + Açı (önbelleklenebilir)
 *   Stage 2a→ buildShortScriptPrompt()     : Kısa platformlar (TikTok/Reels/Shorts/X)
 *   Stage 2b→ buildYouTubeScriptPrompt()   : YouTube 8 dk (ayrı çağrı, paralel)
 *
 * Konuşma hızı: ~130 kelime/dakika = ~2.2 kelime/saniye
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScriptScene = {
  index:             number;
  time:              string;
  action:            string;
  text:              string;   // TAM konuşma metni — özet değil
  overlay:           string;
  purpose:           string;
  visualDescription: string;
  viewerQuestion?:   string;
};

export type PlatformScript = {
  platform:   string;
  duration:   string;
  hook:       string;
  scenes:     ScriptScene[];
  cta:        string;
  totalWords: number;
};

export type XThread = {
  platform: "X";
  hook:     string;
  tweets:   string[];
};

export type Scripts = {
  tiktok?:         PlatformScript;
  instagram?:      PlatformScript;
  youtube_shorts?: PlatformScript;
  youtube?:        PlatformScript;
  x?:              XThread;
};

// ─── Platform key normalizer ──────────────────────────────────────────────────

export function platformToKey(platform: string): string {
  const map: Record<string, string> = {
    "TikTok":           "tiktok",
    "Instagram Reels":  "instagram",
    "YouTube Shorts":   "youtube_shorts",
    "YouTube":          "youtube",
    "X":                "x",
  };
  return map[platform] ?? platform.toLowerCase().replace(/\s+/g, "_");
}

// ─── Konuşma hızı hesabı ──────────────────────────────────────────────────────
// 130 kelime/dakika = 2.17 kelime/saniye

function wordsForSeconds(seconds: number): string {
  const words = Math.round(seconds * 2.17);
  return `~${words} kelime`;
}

// ─── Per-platform concrete example scripts ───────────────────────────────────
// Few-shot prompting: GPT'ye JSON içinde gerçek metin yoğunluğunu gösterir.
// Konu farklı — FORMAT ve YOĞUNLUK taklit edilecek.

function buildShortPlatformExample(platform: string): string {
  const map: Record<string, string> = {
    tiktok: `
━━━ TİKTOK METİN YOĞUNLUĞU REFERANSI (konuyu değil, yoğunluğu taklit et) ━━━
Sahne 2 (~25 kelime gerçek metin):
  "Yüzlerce yıl insanlar şeyleri takas etti. Ama sorun vardı: ben buğday üretiyorum, sen çömlek yapıyorsun. Ya o an çömlek istemiyorsam? Para bu sorunu çözdü."
Sahne 4 (~43 kelime gerçek metin):
  "Şu an cebindeki 100 lira devletin sana verdiği bir söz. Kağıt değil, anlaşma. Ama o anlaşmanın şartlarını sen belirlemiyorsun. Merkez Bankası belirliyor. Ve bazen bu söz bozuluyor. 2021'de lira değerinin yarısını kaybetti. Hâlâ güvende misin?"
→ Her sahne "text" alanı bu yoğunlukta olmalı. Özet yasak, tam konuşma metni zorunlu.`,

    instagram: `
━━━ INSTAGRAM METİN YOĞUNLUĞU REFERANSI (konuyu değil, yoğunluğu taklit et) ━━━
Sahne 3 — KAYDET ANI (~30 kelime gerçek metin):
  "Harvard araştırması: Maaş müzakeresinde ilk rakamı söyleyen taraf genellikle kazanıyor. Çünkü ilk sayı beynin çıpa noktası oluyor. Bu kuralı bilenler %18 daha yüksek maaşla işe başlıyor. Buna Çıpalama Etkisi deniyor."
→ Sahne 3 izleyicinin 'bunu kaydetmeliyim' diyeceği bilgi yoğunluğunda yazılmalı.`,

    youtube_shorts: `
━━━ YOUTUBE SHORTS METİN YOĞUNLUĞU REFERANSI (konuyu değil, yoğunluğu taklit et) ━━━
Sahne 3 (~22 kelime gerçek metin):
  "1895'te Einstein Zürih Politeknik'e başvurdu ve reddedildi. Ama neden? Matematik değil — Fransızca sınavından düştü. Matematik ve fizikten en yüksek notu almıştı."
Sahne 4 (~20 kelime gerçek metin):
  "Yine de efsane yaşıyor. Çünkü 'deha bile başarısız olur' hikayesi insanı rahatlatıyor. Peki hangi başarı mitlerine inanmaya devam ediyoruz?"`,

    x: `
━━━ X THREAD METİN YOĞUNLUĞU REFERANSI (konuyu değil, yoğunluğu taklit et) ━━━
Tweet 2 (~45 kelime):
  "1944. Dağ oteli. Kar yağıyor. 44 ülkenin bakanı bir odada. Masada tek karar: Dünyanın tüm parasını dolara bağlamak. O geceye Bretton Woods diyoruz. Ve o kararın sonuçları bugün hâlâ maaşına yansıyor."
Tweet 3 (~40 kelime):
  "Şu an cebindeki para devletin sana verdiği bir söz. Kağıt değil — anlaşma. Ama o anlaşmanın şartlarını sen belirlemedin. Ve bazen bu sözler bozuluyor."
→ Her tweet bu yoğunlukta: somut isim/tarih/sayı + kişisel bağ + bir sonrakine çekim.`,
  };
  return map[platform] ?? map.tiktok!;
}

// ─── SHORT PLATFORMS SCRIPT PROMPT ───────────────────────────────────────────
// TikTok, Instagram Reels, YouTube Shorts, X için tam senaryo
// Kullanım: Stage 2a

export function buildShortScriptPrompt(
  topic:      string,
  platforms:  string[],
  research:   Record<string, unknown>,
  angle:      Record<string, unknown>,
  nicheLabel: string,
): string {
  // Narrative engine imports (dynamic require — no circular dep issue)
  const { buildNarrativeDirective, buildArchetypeSection, selectArchetype } =
    require("./narrativeEngine") as typeof import("./narrativeEngine");
  const { detectUniversalInterest, buildUniversalInterestSection } =
    require("./universalTopics") as typeof import("./universalTopics");

  const shortPlatforms = platforms.filter(p => p !== "YouTube");
  if (shortPlatforms.length === 0) return "";

  const psychMech    = (angle as any).psychMechanism as string | undefined;
  const nicheKey     = nicheLabel.toLowerCase().replace(/[^a-z]/g, "");
  const archetype    = selectArchetype(nicheKey, psychMech);
  const interest     = detectUniversalInterest(topic);

  const platformBlocks = shortPlatforms.map(p => {
    const key = p === "TikTok" ? "tiktok"
      : p === "Instagram Reels" ? "instagram"
      : p === "YouTube Shorts" ? "youtube_shorts"
      : "x";
    if (p === "X") return buildXThreadSpec();
    if (p === "TikTok") return buildTikTokSpec();
    if (p === "Instagram Reels") return buildInstagramSpec();
    if (p === "YouTube Shorts") return buildYouTubeShortsSpec();
    return buildTikTokSpec();
  }).join("\n\n---\n\n");

  // İlk kısa platform için narrative directive + example
  const firstShort = shortPlatforms.find(p => p !== "X") ?? shortPlatforms[0] ?? "tiktok";
  const platKey = platformToKey(firstShort);

  // Platform bazlı metin yoğunluğu örnekleri (her platform için ayrı)
  const platformExamples = shortPlatforms
    .map(p => buildShortPlatformExample(platformToKey(p)))
    .join("\n");

  return `Sen Türkçe içerik senaryosu yazan uzman bir senaristsın.
Her kelime gerçek bir video için kameraya karşı sesli söylenecek. Sen sadece SENARYO yazıyorsun — bilgi özeti değil, hikaye.

KONU: "${topic}"
NİŞ: ${nicheLabel}

ARAŞTIRMA BULGULARI — bunları hikayeye dönüştür, birebir kopyalama:
${JSON.stringify(research, null, 2)}

SEÇILEN AÇI:
${JSON.stringify(angle, null, 2)}
${interest ? buildUniversalInterestSection(interest) : ""}
${buildArchetypeSection(archetype)}
${buildNarrativeDirective(platKey)}

━━━ SENARYO YAZMA KURALLARI ━━━

KALİTE STANDARDI — aşağıdaki örnek seviyesinde yaz:
KÖTÜ (bilgi özeti — YASAK):
  "Para tarihi anlatılır, Bretton Woods sistemi açıklanır."
İYİ (senaryo metni — ZORUNLU):
  "1944, New Hampshire. Dünya Savaşı bitmek üzere. Ve kırk dört ülkenin mali bakanı kar yağan bir dağ otelinde kapandı. Üç hafta boyunca, odadan çıkmadan, dünyayı yeniden tasarladılar. O toplantıda alınan bir karar — sadece bir karar — bugün senin maaşının ne kadar edeceğini hâlâ belirliyor."

ZORUNLU:
✓ Her sahne tam konuşma metni — izleyici bunu sesli duyacak
✓ Spesifik: tarih, isim, yer, sayı — "önemli toplantı" değil "1944 Bretton Woods"
✓ Konuşma dili: "Bak şunu düşün..." / "İşte burada ilginçleşiyor..." / "Şimdi dur bir dakika:"
✓ Her sahnede izleyici zihninde görsel canlanacak — "o odada olsaydın..." tarzı tetikleyici
✓ Her sahne soru ya da gerilimle bitmeli — izleyici duramaz ve devam etmek zorunda hisseder
✓ Araştırma bulgularındaki rakam ve gerçekler cümlelere dönüşmeli

YASAK:
✗ "Bu videoda X ve Y'yi öğreneceğiz." — META DIALOG
✗ "Araştırmalar gösteriyor ki..." — AKADEMİK DİL
✗ "Önemli bir konuyu ele alacağız." — VAGUE
✗ Sahne açıklaması: "Hook burada verilir" — TAM METİN YAZ
✗ "..." veya "[devam eder]" — EKSİK METİN

━━━ METİN YOĞUNLUĞU REFERANSLARI (farklı konu, aynı yoğunluk) ━━━
${platformExamples}

━━━ KELIME SAYISI KONTROLÜ ━━━
JSON oluşturmadan önce her sahnenin "text" alanındaki kelime sayısını say.
Eğer herhangi bir sahnenin minimum kelime sayısını karşılamıyorsa, o sahneyi genişlet.
KURAL: "text" alanı asla tek cümle olamaz (hook sahnesi hariç). Her sahne en az 2-4 cümle.

${platformBlocks}

SADECE geçerli JSON döndür (markdown yok, kod bloğu yok):
{
  ${shortPlatforms.map(p => buildPlatformJsonTemplate(p)).join(",\n  ")}
}`;
}

// ─── YOUTUBE LONG SCRIPT PROMPT ───────────────────────────────────────────────
// YouTube 8 dakika için ayrı çağrı (Stage 2b)

export function buildYouTubeScriptPrompt(
  topic:      string,
  research:   Record<string, unknown>,
  angle:      Record<string, unknown>,
  nicheLabel: string,
): string {
  const { buildNarrativeDirective, buildArchetypeSection, selectArchetype } =
    require("./narrativeEngine") as typeof import("./narrativeEngine");
  const { detectUniversalInterest, buildUniversalInterestSection } =
    require("./universalTopics") as typeof import("./universalTopics");

  const psychMech = (angle as any).psychMechanism as string | undefined;
  const nicheKey  = nicheLabel.toLowerCase().replace(/[^a-z]/g, "");
  const archetype = selectArchetype(nicheKey, psychMech);
  const interest  = detectUniversalInterest(topic);

  return `Sen Türkçe YouTube içerik senaryosu yazan uzman bir senaristsın.
Bu 8 dakikalık videonun kelimesi kelimesine okunacak tam senaryosunu yazıyorsun.
Bilgi belgesi değil, hikaye. İzleyici ekrana kilitlenecek çünkü her sahne bir sonrakini zorunlu kılıyor.

KONU: "${topic}"
NİŞ: ${nicheLabel}

ARAŞTIRMA BULGULARI — hikayeye dönüştür:
${JSON.stringify(research, null, 2)}

SEÇILEN AÇI:
${JSON.stringify(angle, null, 2)}
${interest ? buildUniversalInterestSection(interest) : ""}
${buildArchetypeSection(archetype)}
${buildNarrativeDirective("youtube")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YouTube 8 DAKİKA SENARYO — DETAYLI KURALLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOPLAM: 8 sahne, ~1200 kelime konuşma metni

SAHİN BAŞINA MİNİMUM KELİME (konuşma hızı: 130 kelime/dakika):
  Sahne 1 (0:00–0:45, 45s)  → MİN 95 kelime  — Hook + "neden izleyeceksin" vaadi
  Sahne 2 (0:45–2:00, 75s)  → MİN 155 kelime — Bağlam, izleyiciyi konuya çek
  Sahne 3 (2:00–3:30, 90s)  → MİN 190 kelime — İlk derinlik katmanı
  Sahne 4 (3:30–5:00, 90s)  → MİN 190 kelime — İkinci derinlik, gerilim arttır
  Sahne 5 (5:00–6:00, 60s)  → MİN 125 kelime — Twist / şok an
  Sahne 6 (6:00–7:00, 60s)  → MİN 125 kelime — Kanıt + somutlaştır
  Sahne 7 (7:00–7:45, 45s)  → MİN 95 kelime  — İzleyiciye yönel, soru sor
  Sahne 8 (7:45–8:00, 15s)  → MİN 30 kelime  — CTA (net, tek aksiyon)

ZORUNLU SENARYO KURALLARI:
1. "text" alanı kelimesi kelimesine söylenecek tam diyalog — özet değil, TAM METİN
2. Her sahne öncekinden organik büyür — geçiş cümleleri: "İşte tam bu noktada...", "Ama bekle..."
3. Bilgi döngüsü: soruyu sor (Sahne 2) → cevabı geciktir → Sahne 4-5'te ver
4. Sahne 5: Twist — izleyicinin bildiklerini tersine çevir, beklenmedik bir açıdan vur
5. Sahne 7: İzleyiciye spesifik, tartışmalı soru — "Sence..." değil, "Eğer bu doğruysa, şu soru kaçınılmaz:"
6. Her sahnede spesifik rakam/isim/yer/tarih — soyutluk yasak
7. "Şimdi burası kritik..." / "Bunu duymaya hazır mısın?" / "İşte asıl mesele burada:" — köprü ifadeleri

KALİTE ÖRNEĞİ — Sahne 1 formatı (sen konuya göre yeni yazacaksın, bunu kopyalama):
"Seninle paylaşmak istediğim bir şey var. Bu videoyu izlemeyi bitirinceye kadar dünya hakkında farklı düşüneceksin. Şu an cebindeki para — kağıt, plastik, dijital sayı — aslında bir anlaşmaya dayıyor. Ve o anlaşmanın şartlarını sen belirlemedin. 1971'de, bir Salı gecesi, Nixon televizyona çıktı ve 25 yıldır işleyen bir sistemi tek başına kapattı. Peki sen o gece neredeydin? Büyük ihtimalle daha doğmamıştın. Ama o gecenin sonuçları bugün hâlâ maaş hesabına yansıyor. Nasıl olduğunu anlatayım."

SADECE geçerli JSON döndür:
{
  "youtube": {
    "hook": "YouTube 8 dk için açılış hook'u — rakam veya şok gerçek içermeli",
    "scenes": [
      {
        "index": 1,
        "time": "0:00–0:45",
        "action": "Kamerada yüz yakın çekim, direkt bakış",
        "text": "TAM KONUŞMA METNİ — MİN 95 KELIME",
        "overlay": "2-4 kelime vurgu",
        "purpose": "hook",
        "visualDescription": "B-roll veya grafik tarifi — yönetmene talimat gibi",
        "viewerQuestion": ""
      },
      {
        "index": 2, "time": "0:45–2:00",
        "action": "...",
        "text": "TAM KONUŞMA METNİ — MİN 155 KELIME",
        "overlay": "...", "purpose": "context",
        "visualDescription": "...", "viewerQuestion": "..."
      },
      {
        "index": 3, "time": "2:00–3:30",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 190 KELIME",
        "overlay": "...", "purpose": "evidence",
        "visualDescription": "...", "viewerQuestion": ""
      },
      {
        "index": 4, "time": "3:30–5:00",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 190 KELIME",
        "overlay": "...", "purpose": "story",
        "visualDescription": "...", "viewerQuestion": "..."
      },
      {
        "index": 5, "time": "5:00–6:00",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 125 KELIME",
        "overlay": "...", "purpose": "twist",
        "visualDescription": "...", "viewerQuestion": ""
      },
      {
        "index": 6, "time": "6:00–7:00",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 125 KELIME",
        "overlay": "...", "purpose": "payoff",
        "visualDescription": "...", "viewerQuestion": ""
      },
      {
        "index": 7, "time": "7:00–7:45",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 95 KELIME",
        "overlay": "...", "purpose": "question",
        "visualDescription": "...", "viewerQuestion": "Spesifik tartışmalı soru"
      },
      {
        "index": 8, "time": "7:45–8:00",
        "action": "...", "text": "TAM KONUŞMA METNİ — MİN 30 KELIME",
        "overlay": "...", "purpose": "cta",
        "visualDescription": "...", "viewerQuestion": ""
      }
    ],
    "cta": "Abone ol + yoruma soruyu taşı"
  }
}`;
}

// ─── RESEARCH + ANGLES PROMPT ─────────────────────────────────────────────────
// Stage 1 — önbelleklenebilir

export function buildResearchAnglesPrompt(
  topic:      string,
  platforms:  string[],
  niche:      string,
  nicheLabel: string,
): string {
  const { detectUniversalInterest, buildUniversalInterestSection } =
    require("./universalTopics") as typeof import("./universalTopics");
  const interest = detectUniversalInterest(topic);

  return `Sen içerik stratejisti ve araştırmacısın. Verilen konu için araştırma yapıp en güçlü içerik açılarını bul.

KONU: "${topic}"
NİŞ: ${nicheLabel}
PLATFORMLAR: ${platforms.join(", ")}
${interest ? buildUniversalInterestSection(interest) : ""}

━━━ ARAŞTIRMA ━━━
Bu konuyu derin araştır:
1. facts (2–4 madde): Çoğunun bilmediği, kontraintüitif, spesifik gerçekler
   Format: "X sanıyorsun ama aslında Y" — sayı/tarih/isim içermeli
2. misconceptions (1–3 madde): İzleyicinin hâlâ doğru sandığı yanlışlar
3. targetAudience: Kim umursayor, neden — tek spesifik cümle
4. keyTension: Konunun merkezi gerilimi — iki karşıt güç arasındaki çelişki
5. specificProof: En güçlü sayı/vaka/isim/tarih — asla "büyük etki" değil, "3 ayda %340 artış"

━━━ İÇERİK AÇILARI ━━━
Araştırmadan 2–3 güçlü açı çıkar:
- angle: Tek cümle strateji açıklaması
- psychMechanism: MERAK_BOSLUGU | INANC_KIRMA | KIMLIK_TEHDIDI | SPESIFIK_GERCEKLIK | SOSYAL_TEHDIT
- targetEmotion: merak | öfke | korku | umut | gurur
- contentType: listicle | story | challenge | data | confession
- bestFor: hangi platformlar için ideal
- hookSeed: Bu açıdan çıkabilecek en güçlü hook yönü (tek cümle taslak)

SADECE geçerli JSON döndür:
{
  "research": {
    "facts": ["spesifik gerçek 1 — rakam/tarih içermeli", "spesifik gerçek 2"],
    "misconceptions": ["yaygın yanlış inanç — spesifik"],
    "targetAudience": "Kim ve neden — tek cümle",
    "keyTension": "X vs Y — tek cümle",
    "specificProof": "En güçlü sayı veya vaka"
  },
  "angles": [
    {
      "angle": "Açı açıklaması",
      "psychMechanism": "INANC_KIRMA",
      "targetEmotion": "öfke",
      "contentType": "story",
      "bestFor": ["TikTok", "YouTube"],
      "hookSeed": "Hook yönü taslağı"
    }
  ]
}`;
}

// ─── Platform spec builders (short platforms) ─────────────────────────────────

function buildTikTokSpec(): string {
  return `TİKTOK SENARYOSU — 50–60 saniye, 5 sahne
TOPLAM HEDEF: ~150 kelime konuşma metni (minimum 130)

Sahne 1 (0–3s,   hook)    → MİN 6 kelime   HOOK — izleyicinin kaydırmayı durdurması (şok/soru/tamamlanmamış cümle)
Sahne 2 (3–12s,  problem) → MİN 25 kelime  Setup — hikayenin içine fırlat, neden önemli
Sahne 3 (12–25s, evidence)→ MİN 30 kelime  Spesifik bilgi — tarih/isim/rakam içermeli, 2-3 cümle
Sahne 4 (25–45s, payoff)  → MİN 45 kelime  Reveal + kişisel bağ — "senin hayatını bu nasıl etkiliyor"
Sahne 5 (45–55s, cta)     → MİN 8 kelime   CTA — yorum sorusu veya takip

Ton: Agresif. Her 10 saniyede bir "pattern interrupt". Cümle kısa ama sahne DOLU.
JSON key: "tiktok"`;
}

function buildInstagramSpec(): string {
  return `INSTAGRAM REELS SENARYOSU — 35–45 saniye, 5 sahne
TOPLAM HEDEF: ~120 kelime konuşma metni (minimum 100)

Sahne 1 (0–3s,   hook)      → MİN 6 kelime   HOOK — "kaydet" refleksini tetikle
Sahne 2 (3–10s,  setup)     → MİN 15 kelime  Bağlam — izleyici neden önemsemeli
Sahne 3 (10–22s, value)     → MİN 32 kelime  KAYDET ANI — araştırma/rakam/spesifik bilgi. Bu sahne altın.
Sahne 4 (22–38s, payoff)    → MİN 35 kelime  Sonuç + pratik bağ — "bunu nasıl kullanırsın"
Sahne 5 (38–45s, cta)       → MİN 8 kelime   Kaydet + arkadaşına gönder CTA

Ton: Estetik + bilgilendirici. Sahne 3'te "bunu kaydetmeliyim" anı şart. 2-3 cümle minimum.
JSON key: "instagram"`;
}

function buildYouTubeShortsSpec(): string {
  return `YOUTUBE SHORTS SENARYOSU — 55–60 saniye, 6 sahne
TOPLAM HEDEF: ~150 kelime konuşma metni (minimum 130)

Sahne 1 (0–3s,   hook)     → MİN 7 kelime   HOOK — arama niyetiyle örtüşen, merak açan
Sahne 2 (3–10s,  problem)  → MİN 15 kelime  Problem/Soru — izleyicinin beklentisini kır
Sahne 3 (10–22s, context)  → MİN 25 kelime  Bağlam — spesifik gerçek, tarih veya rakam ile destekle
Sahne 4 (22–38s, evidence) → MİN 35 kelime  Kanıt — araştırma/vaka/uzman, somut isimler
Sahne 5 (38–52s, payoff)   → MİN 30 kelime  Çözüm/Reveal — "ne yapmalısın" + twist
Sahne 6 (52–60s, cta)      → MİN 8 kelime   CTA — "uzun versiyonu" veya yorum sorusu

Ton: Mini belgesel. Her sahne 2-3 cümle minimum. Soyutluk yasak.
JSON key: "youtube_shorts"`;
}

function buildXThreadSpec(): string {
  return `X (TWİTTER) THREAD — 4–6 tweet
Tweet başına: 40–70 kelime, tek fikir bütünü
Son tweet: yorum sorusu CTA

Tweet 1 (hook tweet): Rakam veya şok gerçek — seriyi okumanın değerini göster
Tweet 2–4: Her biri araştırmanın bir boyutunu ele alır, sıradakine merak açar
Son tweet: "Sizce..." ile tartışmalı soru — yorum teşvik

Ton: Direkt, iddialı. Nokta koyarak dur, cümle bitmeden.
JSON key: "x"`;
}

// ─── JSON template builder (short platforms) ─────────────────────────────────

function buildPlatformJsonTemplate(platform: string): string {
  const key = platformToKey(platform);
  if (platform === "X") {
    return `"x": {
    "hook": "Thread açılış hook'u — rakam veya şok gerçek, 60–100 karakter",
    "tweets": [
      "Tweet 1 — hook tweet, 40–70 kelime tam metin",
      "Tweet 2 — 40–70 kelime tam metin",
      "Tweet 3 — 40–70 kelime tam metin",
      "Tweet 4 — 40–70 kelime tam metin",
      "Tweet 5 — CTA, yorum sorusu"
    ]
  }`;
  }

  const sceneCounts: Record<string, number> = {
    tiktok: 5, instagram: 5, youtube_shorts: 6,
  };
  const times: Record<string, string[]> = {
    tiktok:         ["0–3s", "3–12s", "12–25s", "25–45s", "45–55s"],
    instagram:      ["0–3s", "3–10s", "10–22s", "22–38s", "38–45s"],
    youtube_shorts: ["0–3s", "3–10s", "10–22s", "22–38s", "38–52s", "52–60s"],
  };
  const purposes: Record<string, string[]> = {
    tiktok:         ["hook", "problem", "evidence", "payoff", "cta"],
    instagram:      ["hook", "setup", "value", "payoff", "cta"],
    youtube_shorts: ["hook", "problem", "context", "evidence", "payoff", "cta"],
  };
  const words: Record<string, string[]> = {
    tiktok:         ["6–8", "25–30", "30–35", "45–55", "8–12"],
    instagram:      ["6–8", "15–20", "32–38", "35–42", "8–12"],
    youtube_shorts: ["7–10", "15–20", "25–32", "35–42", "30–36", "8–12"],
  };

  const count    = sceneCounts[key] ?? 5;
  const timeArr  = times[key]    ?? [];
  const purpArr  = purposes[key] ?? [];
  const wordArr  = words[key]    ?? [];

  const scenesJson = Array.from({ length: count }, (_, i) => `{
        "index": ${i + 1},
        "time": "${timeArr[i] ?? `S${i + 1}`}",
        "action": "Kamerada spesifik eylem — yönetmene talimat gibi",
        "text": "TAM KONUŞMA METNİ — MİN ${wordArr[i] ?? "20"} KELİME — gerçek cümleler, konuşma dili",
        "overlay": "2–4 kelime ekran üstü",
        "purpose": "${purpArr[i] ?? "scene"}",
        "visualDescription": "B-roll / grafik / animasyon tarifi"
      }`).join(",\n      ");

  return `"${key}": {
    "hook": "${platform} hook'u — 40–70 karakter, platforma özgü ton",
    "scenes": [
      ${scenesJson}
    ],
    "cta": "Platform tonuna uygun son çağrı"
  }`;
}

// ─── Legacy: buildScriptSection (backward compat) ────────────────────────────
// Eski route kodu hâlâ kullanıyorsa çalışmaya devam eder

export function buildScriptSection(platforms: string[]): string {
  return `SENARYO ÜRETIMI — platformlar: ${platforms.join(", ")}
Kısa platformlar için buildShortScriptPrompt(), YouTube için buildYouTubeScriptPrompt() kullanın.`;
}
