/**
 * narrativeEngine — Her senaryoya TED kalitesinde anlatı çatısı kazandırır.
 *
 * Kaynak: Chris Anderson (TED), Nancy Duarte (Resonate),
 *         Simon Sinek, Brené Brown, Ken Robinson konuşma anatomileri +
 *         MrBeast / Kurzgesagt / Ali Abdaal video formatları
 *
 * Temel ilke: İzleyiciyi hikayenin ORTASINA fırlat.
 * "Size X'i anlatacağım" değil — direkt o anın içinde başla.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type NarrativeArchetype = {
  id:            string;
  name:          string;
  hook:          string;
  openingLine:   string;
  tensionEngine: string;
  emotionalArc:  string;
  bestNiches:    string[];
};

// ─── TED Techniques ───────────────────────────────────────────────────────────
// Bu teknikler GPT'ye sistematik olarak enjekte edilir

export const TED_PRINCIPLES = `
━━━ TED KONUŞMACISı TEKNİKLERİ — HER SENARYODA UYGULANACAK ━━━

1. HİKAYENİN ORTASINA BAŞLA
   ✗ "Bugün size paranın tarihini anlatacağım."
   ✓ "1971, gece yarısı. Nixon kameraya baktı ve 26 yıllık sistemi 15 dakikada kapattı."

2. KONTRAST YAPISI (Nancy Duarte — Resonate)
   Her büyük anlatı iki dünya arasında gidip gelir:
   DÜNYA OLDUĞU GİBİ ↔ DÜNYA OLABİLECEĞİ GİBİ
   ÖNCE ↔ SONRA | BİLİYORDUK ↔ YANILIYORDUK | ONLAR ↔ BİZ
   ✓ "Herkes X zannediyor. Ama gerçek şu ki Y."

3. SPESİFİK KARAKTER VEYA AN — SOYUTLUK YASAK
   ✗ "Tarihte bir nokta vardı ki para sistemi değişti."
   ✓ "1944, New Hampshire. 32 yaşında bir ekonomist otel odasında 3 haftadır uyumamıştı."

4. ÜÇLER KURALI (Rule of Three)
   İnsan beyni üçlü yapıyı doğal işler — üç örnek, üç neden, üç adım.
   ✓ "Bu sistemde üç kişi kazanır. Üç kişi kaybeder. Ve sen hangisi olduğunu seçebilirsin."

5. GÖRSELLEŞTİRME TETİKLEYİCİSİ
   İzleyicinin gözünde film oynatacak bir cümle.
   ✓ "Şunu hayal et: 1944'te o otelin koridorunda yürüyorsun..."
   ✓ "O kağıdı tutan adamın ellerine bak —"
   ✓ "Fiyat etiketine bak. Şimdi 1970'teki aynı ürünün fiyatını düşün."

6. BİLGİ DÖNGÜSÜ (Information Gap Theory — Loewenstein)
   Soru sor → cevabı GECİKTİR → 2-3 sahne sonra ver.
   ✓ Sahne 2: "Peki neden hiç kimse bunu değiştirmek istemedi?"
   ✓ Sahne 4: "Cevap şu — ve bu cevap her şeyi açıklıyor."

7. KİŞİSEL ADRES — "SEN" ile bağla
   ✓ "Sen şu an bunu okurken muhtemelen..."
   ✓ "Senin maaşın bu karardan doğrudan etkilendi."
   ✓ "Bir düşün — son ay harcamalarına baktın mı?"

8. KELİME TEKRARI — Hafızada kalması için
   Güçlü bir ifadeyi 3 kez tekrarla (farklı bağlamda).
   ✓ "Para bir araçtır. Sadece bir araç. Ama bu aracı kim kontrol ediyor?"

9. DUYGU → BİLGİ → İLHAM SIRASI
   Önce hissettir. Sonra öğret. Sonra ilham ver.
   ✗ Bilgi → Bilgi → Bilgi (akademik, sıkıcı)
   ✓ Şok/merak → Gerçek → "Sen de bunu yapabilirsin"

10. SAHNE KÖPRÜSÜ — Duramaz hissi
    Her sahne şu üçünden biriyle bitmeli:
    a) Cevapsız soru: "Peki neden kimse bunu söylemiyor?"
    b) Eksik hikaye: "Ve işte o gece olanlar —"
    c) Şok kuruluşu: "Ama asıl şok eden kısım henüz gelmedi."
`;

// ─── Platform storytelling DNA ────────────────────────────────────────────────

export const PLATFORM_STORY_DNA: Record<string, string> = {
  tiktok: `
TİKTOK HİKAYE DNA'SI:
• İlk 3 saniye: İzleyicinin kaydırmayı FIZIKEN durdurmasını sağla
  Format: [Şok gerçek] VEYA [Tamamlanmamış cümle] VEYA [Direkt soru]
  ÖN: "Para böyle işlemek zorunda değildi." (6 kelime, 3 saniye)
• Her 8-10 saniyede bir "pattern interrupt" — ritim kır, bakış açısı değiştir
• Cümleler kısa. Nokta. Durak. Bir sonraki cümle çarpsın.
• Son cümle: Yoruma çeken soru veya "devamı için" kancası
• ASLA: "Merhaba arkadaşlar" / "Bugün size" / "Bu videoda"
`,

  instagram: `
INSTAGRAM REELS HİKAYE DNA'SI:
• Hook estetik + bilgi içermeli — "kaydet" dedirtecek density
• Sahne 3 = "ALTINI ÇİZ" anı: izleyici ekran görüntüsü alacak kadar değerli
• Tonun daha samimi, "arkadaşına söyler gibi" — TikTok kadar agresif değil
• Görsel öneriler estetik olacak (grafik, infografik, temiz çekim)
• CTA: "Kaydet + arkadaşına gönder" → paylaşım için tasarla
`,

  youtube_shorts: `
YOUTUBE SHORTS HİKAYE DNA'SI:
• Mini belgesel formatı: Hook → Problem → Kanıt → Çözüm → CTA
• Başlık ile açılış birbirini tamamlar — arama niyetine uygun
• Shorts'ta izleyici "hızlı öğrenmek" istiyor — her saniye değer katmalı
• Grafik/animasyon ağırlıklı öneri — soyut kavramları görselleştir
• Son 5 saniye: Net bir eylem veya merak ("uzun versiyonu için")
`,

  x: `
X (TWİTTER) HİKAYE DNA'SI:
• Tweet 1: Bir iddia. Rakam veya ters-sezgisel gerçek. Okuyucu "bu nasıl?" demeli.
• Her tweet bağımsız bir düşünce ama zincirleme çekiyor
• Cümle tamamlanmadan nokta. Okuyucu devam etmek ZORUNDA.
• Tweet arası "Ve işte burada ilginçleşiyor" köprüleri
• Son tweet: Tartışma açan soru — yorum yazmak için dürtü
• Uzun cümle yasak — kısa, keskin, iddialı
`,

  youtube: `
YOUTUBE 8 DAKİKA HİKAYE DNA'SI (Kurzgesagt + Ali Abdaal + MrBeast formülü):
• AÇILIŞ: "En ilginç an" ile başla — videonun zirvesini öne çek
• 1. DAKİKA: Vaadi ver — "Bu videonun sonunda X'i farklı göreceksin"
• 3. DAKİKA: İlk büyük bilgi anı + "ama bekle, asıl bu değil" köprüsü
• 5. DAKİKA: TWIST — izleyicinin beklediğinin tersi
• 7. DAKİKA: İzleyiciyi hikayeye sok — "sen de bu sistemin içindesin"
• HER 90 SANİYEDE: Yeni bir bilgi kapısı açılır — izleyici yerinde oturamaz
• RETENTION HİLESİ: "Bunu sana 6. dakikada söyleyeceğim" (izleyici bekler)
`,
};

// ─── Narrative archetypes ─────────────────────────────────────────────────────

export const NARRATIVE_ARCHETYPES: NarrativeArchetype[] = [
  {
    id:            "fall",
    name:          "Çöküş",
    hook:          "[isim/şey] her şeye sahipti. Sonra tek bir karar her şeyi değiştirdi.",
    openingLine:   "[Kişi/sistem], [tarih]'de en güçlü anındaydı. Kimse ne olacağını bilmiyordu.",
    tensionEngine: "Çöküşün adım adım nasıl geldiği — her sahne bir sonraki uyarı işaretini gösterir",
    emotionalArc:  "umut → uyarı işaretleri görünür → şok → ders/anlayış",
    bestNiches:    ["history", "money", "technology"],
  },
  {
    id:            "discovery",
    name:          "Keşif",
    hook:          "[tarih/yer]'de biri bir şey buldu. Kimse o anda ne anlama geldiğini anlamadı.",
    openingLine:   "[Yıl], [şehir/yer]. [Kişi] [ne yapıyordu]. Ve sonra —",
    tensionEngine: "Keşfin önemi sahneden sahneye açılır — izleyici her seferinde daha fazla anlar",
    emotionalArc:  "merak → şüphe → inanç → hayranlık → 'ben de bunu bilmeliyim'",
    bestNiches:    ["science", "history", "technology"],
  },
  {
    id:            "hidden_truth",
    name:          "Gizlenen Gerçek",
    hook:          "[yaygın inanış] hepimize öğretildi. Ama asıl olan şu:",
    openingLine:   "Sana bir şey söyleyeceğim. Bunu söylemem gerekiyor çünkü —",
    tensionEngine: "'Ben bunu bilmiyordum' öfkesi + 'şimdi ne yapacağım' merakı",
    emotionalArc:  "güven → şüphe → öfke/şok → bilgilenme → eylem isteği",
    bestNiches:    ["psychology", "health", "education", "money"],
  },
  {
    id:            "underdog",
    name:          "Ezik Kahraman",
    hook:          "Herkes [kişi/fikri] başarısız olacak dedi. [Zaman] sonra ne oldu?",
    openingLine:   "[Kişi], [yaş/koşul]ında, elinde sadece [tek şey] varken başladı.",
    tensionEngine: "Her engel izleyiciyi 'acaba başaracak mı?' sorusuna iter — duygusal yatırım artar",
    emotionalArc:  "şüphe → empati → umut → zafer → 'ben de yapabilirim'",
    bestNiches:    ["money", "creator", "education"],
  },
  {
    id:            "warning",
    name:          "Uyarı",
    hook:          "[şey] şu an sessizce [sonuç] yaratıyor. Farkında mısın?",
    openingLine:   "Şu an [tehlike] gerçekleşiyor. Ve büyük ihtimalle sen de bunun içindesin.",
    tensionEngine: "Tehdit var → boyutu ortaya çıkar → kişisel bağlantı → ne yapılabilir",
    emotionalArc:  "endişe → korku → anlayış → kontrol hissi",
    bestNiches:    ["health", "technology", "psychology", "money"],
  },
  {
    id:            "contrast",
    name:          "Zıtlık",
    hook:          "[A] ile [B] arasındaki tek fark şu:",
    openingLine:   "İki insan. Aynı başlangıç noktası. Tamamen farklı sonuç. Neden?",
    tensionEngine: "İzleyici kendisini hangi tarafta gördüğünü merak eder — kimlik sorgulaması",
    emotionalArc:  "özdeşleşme → sorgulama → anlayış → değişmek isteme",
    bestNiches:    ["money", "psychology", "creator", "education"],
  },
  {
    id:            "countdown",
    name:          "Geri Sayım",
    hook:          "[X] yılın var. [Sayı] ay. Belki daha az.",
    openingLine:   "Şu an elinde olduğunu düşündüğün [şey] [süre] sonra çok farklı görünecek.",
    tensionEngine: "Zaman baskısı her sahneyi daha acil yapar — izleyici harekete geçmek zorunda hisseder",
    emotionalArc:  "aciliyet → endişe → bilgi → hazırlık → eylem",
    bestNiches:    ["technology", "money", "health"],
  },
  {
    id:            "paradox",
    name:          "Paradoks",
    hook:          "[X yapmak] aslında tam tersini yaratıyor.",
    openingLine:   "Ne kadar çok [X] yaparsan, o kadar az [Y] elde edersin. Bunu kanıtlayan araştırma şu:",
    tensionEngine: "Mantığı tersine çeviren bilgi — izleyici inanmak istemez ama merak eder",
    emotionalArc:  "şaşkınlık → itiraz → kanıt → kabul → 'hayatımı yanlış yaşıyordum'",
    bestNiches:    ["psychology", "health", "science", "education"],
  },
  {
    id:            "inside_story",
    name:          "İçeriden Hikaye",
    hook:          "[büyük sistem/şirket/olay]'ın içinde gerçekten neler olduğunu bilen çok az insan var.",
    openingLine:   "Bu bilgiyi paylaşmadan önce şunu söyleyeyim — bunu bilen insanların çoğu susuyor.",
    tensionEngine: "Gizli bilgiye erişim hissi — izleyici ayrıcalıklı hisseder, paylaşmak ister",
    emotionalArc:  "merak → içeriden hissi → şok → 'ben de bilmeliyim' → paylaşma",
    bestNiches:    ["creator", "money", "technology", "culture"],
  },
];

// ─── Selector ─────────────────────────────────────────────────────────────────

export function selectArchetype(
  niche:           string,
  psychMechanism?: string,
): NarrativeArchetype {
  const mechToArch: Record<string, string> = {
    INANC_KIRMA:        "hidden_truth",
    KIMLIK_TEHDIDI:     "contrast",
    MERAK_BOSLUGU:      "discovery",
    SPESIFIK_GERCEKLIK: "inside_story",
    SOSYAL_TEHDIT:      "warning",
  };
  const preferred = psychMechanism ? mechToArch[psychMechanism] : null;
  if (preferred) {
    const found = NARRATIVE_ARCHETYPES.find(a => a.id === preferred);
    if (found) return found;
  }
  const nicheMatch = NARRATIVE_ARCHETYPES.find(a => a.bestNiches.includes(niche));
  return nicheMatch ?? NARRATIVE_ARCHETYPES[1]!;
}

export function buildArchetypeSection(archetype: NarrativeArchetype): string {
  return `
━━━ SENARYO ARKETİPİ: ${archetype.name.toUpperCase()} ━━━
Hook formülü:    ${archetype.hook}
Açılış tonu:     ${archetype.openingLine}
Gerilim motoru:  ${archetype.tensionEngine}
Duygusal yay:    ${archetype.emotionalArc}
`;
}

// ─── Main directive builder ───────────────────────────────────────────────────

export function buildNarrativeDirective(platform: string): string {
  const dna = PLATFORM_STORY_DNA[platform] ?? PLATFORM_STORY_DNA.tiktok!;

  return `
${TED_PRINCIPLES}
${dna}
━━━ KALİTE STANDARDI — bu seviyede yaz ━━━

KÖTÜ (bilgi özeti — ÇIKTI KABUL EDİLMEZ):
  "Para tarihi anlatılır. Bretton Woods sistemi açıklanır. İzleyiciye bilgi verilir."

İYİ (TED seviyesi senaryo — HEDEF BU):
  "1944, New Hampshire. Dünya Savaşı bitmek üzere. Kar yağıyor.
  Ve 44 ülkenin mali bakanı bir dağ otelinde kapandı.
  Üç hafta. Dışarı çıkmadan. Dünyayı yeniden tasarlıyorlar.
  O toplantıda alınan tek bir karar — bugün senin maaşının ne kadar edeceğini hâlâ belirliyor.
  Nasıl olduğunu anlatayım."

NEDEN İYİ:
  ✓ Tarih, yer, hava durumu → zihin film yaratıyor
  ✓ "44 ülke, bir otel, üç hafta" → spesifik, akılda kalıcı
  ✓ "Senin maaşın" → kişisel bağlantı
  ✓ "Nasıl olduğunu anlatayım" → izleyici devam etmek ZORUNDA
`;
}

// ─── Emotional arc map ────────────────────────────────────────────────────────

export const EMOTIONAL_ARC: Record<string, string[]> = {
  tiktok:         ["şok/merak", "gerilim", "bilgi reveal", "tatmin", "eylem"],
  instagram:      ["estetik merak", "değerli bilgi", "özdeşleşme", "ilham", "kaydet/paylaş"],
  youtube_shorts: ["merak", "problem kurulumu", "kanıt", "çözüm", "harekete geç"],
  youtube:        ["vaat/merak", "bağlam/empati", "gerilim artar", "kriz noktası", "twist/şok", "anlayış/relief", "kişisel bağ", "eylem"],
  x:              ["şok iddia", "kanıt zinciri", "kişisel bağ", "sistemi sorgula", "yorum iste"],
};
