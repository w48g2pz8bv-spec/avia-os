/**
 * nicheTaxonomy — Konu kategorisini tespit eder, prompt tonunu ayarlar.
 * Her niş için: araştırma odağı, anlatım tonu, en güçlü psikolojik mekanizma,
 * izleyici profili ve içerik formatı önerileri.
 *
 * Bu modül saf bir classifier — hiç GPT çağrısı yapmaz.
 */

export type NicheProfile = {
  niche:             string;
  label:             string;
  researchFocus:     string;   // araştırma motoruna ekstra yön
  tone:              string;   // anlatım tonu talimatı
  primaryMechanism:  string;   // en güçlü psikolojik mekanizma
  audienceInsight:   string;   // izleyici kim ve ne ister
  bestFormats:       string[]; // hangi içerik formatı bu nişte çalışır
  proofStyle:        string;   // kanıt nasıl sunulmalı
};

// ─── Niche definitions ────────────────────────────────────────────────────────

export const NICHE_PROFILES: Record<string, NicheProfile> = {

  science: {
    niche:            "science",
    label:            "Bilim & Uzay",
    researchFocus:    "Kontraintüitif bilimsel gerçekler, son 3 yılın keşifleri, yaygın yanlış inanışlar",
    tone:             "Meraklı ve iddialı. Dinleyicinin zihnini patlatacak ama anlaşılır. Benzetmeler kullan: '13 milyar yıl, yani şu an baktığın ışık sen doğmadan önce yola çıktı.' Resmi dil yok.",
    primaryMechanism: "MERAK_BOSLUGU",
    audienceInsight:  "Meraklı genel izleyici (18–35). Uzman değil ama sığ içerik istemiyorlar. 'Wow' anı arıyorlar.",
    bestFormats:      ["data", "story", "listicle"],
    proofStyle:       "Sayılar ve ölçekler: ışık yılı, ağırlık, sıcaklık. Karşılaştırma: 'Jüpiter'e 1300 Dünya sığar.'",
  },

  money: {
    niche:            "money",
    label:            "Para & Girişim",
    researchFocus:    "Az bilinen para tuzakları, başarılı girişimcilerin ters-sezgisel kararları, finansal yanlış inanışlar",
    tone:             "Direk ve acil. İzleyicinin para kaybettiğini hissettir ama çaresiz bırakma. 'Şu an bunu yapmıyorsan x TL kaybediyorsun.' Net rakamlar.",
    primaryMechanism: "KIMLIK_TEHDIDI",
    audienceInsight:  "Küçük girişimci, serbest çalışan, yan gelir arayan (20–40). Teori değil, uygulanabilir adım ister.",
    bestFormats:      ["listicle", "confession", "data"],
    proofStyle:       "TL/$ rakamları, zaman çerçeveleri ('3 ayda'), ünlü vaka örnekleri.",
  },

  psychology: {
    niche:            "psychology",
    label:            "Psikoloji & Kişisel Gelişim",
    researchFocus:    "İnsan davranışının beklenmedik boyutları, akademik araştırmaların pratik sonuçları, öz-sabotaj mekanizmaları",
    tone:             "Empati + şok karışımı. 'Bu senin hatan değil, beynin böyle tasarlanmış.' Ama kaderci değil, çözüm ver.",
    primaryMechanism: "INANC_KIRMA",
    audienceInsight:  "Kendini geliştirmek isteyen, içerik tüketimi yüksek segment (22–38). 'Bunu bir daha görürsem save edeyim' modu.",
    bestFormats:      ["story", "confession", "challenge"],
    proofStyle:       "Stanford / Harvard araştırması, deney isimleri (Dunning-Kruger, Hawthorne), kişisel hikaye.",
  },

  technology: {
    niche:            "technology",
    label:            "Teknoloji & Yapay Zeka",
    researchFocus:    "AI'ın şu an gerçekten yapabildiği vs hype, teknoloji şirketlerinin gizlediği şeyler, yakın gelecek senaryoları",
    tone:             "Bilgili ama anlaşılır. Ne fanboy ne doomer. 'İşte gerçekte olan bu.' Bağımsız, eleştirel.",
    primaryMechanism: "SOSYAL_TEHDIT",
    audienceInsight:  "Tech meraklısı, yazılımcı, erken adaptör (20–35). Şirket marketingini geçip gerçeği ister.",
    bestFormats:      ["data", "story", "listicle"],
    proofStyle:       "Benchmark verileri, açık kaynak örnekler, şirket içi açıklamalar / sızıntılar.",
  },

  history: {
    niche:            "history",
    label:            "Tarih & Medeniyet",
    researchFocus:    "Ders kitabında olmayan gerçekler, medeniyetlerin beklenmedik çöküş/yükseliş sebepleri, bugünle bağ",
    tone:             "Hikaye anlatıcı. Sanki oradaymış gibi anlat. 'O gün sabah saatlerinde şehrin sokaklarında...' Ama bugünle mutlaka bağla.",
    primaryMechanism: "MERAK_BOSLUGU",
    audienceInsight:  "Tarih meraklısı (25–45). Belgesel izleyicisi. Yüzeysel bilgiyle değil, bilmediği açıyla gelirsen izler.",
    bestFormats:      ["story", "data", "listicle"],
    proofStyle:       "Birincil kaynaklar, tarihçi alıntıları, arkeolojik kanıtlar, sayısal veriler.",
  },

  health: {
    niche:            "health",
    label:            "Sağlık & Yaşam",
    researchFocus:    "Yaygın sağlık mitlerinin bilimsel çürütülmesi, az bilinen vücut mekanizmaları, pratik değişiklikler",
    tone:             "Güvenilir ama korkutucu değil. 'Doktor sana bunu söylemez çünkü...' enerji. Korku tetikle ama çözüm ver.",
    primaryMechanism: "INANC_KIRMA",
    audienceInsight:  "Sağlıklı yaşam odaklı, genç yetişkin (25–40). Hızlı, uygulanabilir bilgi ister.",
    bestFormats:      ["listicle", "data", "challenge"],
    proofStyle:       "Klinik çalışma, Harvard Health, WHO verisi. Rakam: '%67 daha az risk.'",
  },

  culture: {
    niche:            "culture",
    label:            "Kültür & Eğlence",
    researchFocus:    "Pop kültürünün görünmeyen dinamikleri, viral fenomenlerin arkasındaki psikoloji, kültürel dönüşümler",
    tone:             "Eğlenceli ama analitik. 'Herkes bunu izliyor ama kimse şunu fark etmedi.' Trend + derinlik.",
    primaryMechanism: "SOSYAL_TEHDIT",
    audienceInsight:  "Geniş kitle (16–30). Trendle bağ kurmak ister, kendini sosyal olarak dahil hissetmek ister.",
    bestFormats:      ["story", "challenge", "listicle"],
    proofStyle:       "İzlenme rakamları, sosyal medya verileri, röportaj alıntıları.",
  },

  education: {
    niche:            "education",
    label:            "Eğitim & Öğrenme",
    researchFocus:    "Mevcut eğitim sisteminin başarısız olduğu noktalar, hızlı öğrenme metodolojileri, akademik araştırmaların söyledikleri",
    tone:             "Sistem eleştirisi + pratik çözüm. 'Okul sana bunu öğretmedi çünkü...' Ama nihilizm değil, aksiyon.",
    primaryMechanism: "KIMLIK_TEHDIDI",
    audienceInsight:  "Öğrenci ve yeni mezun (17–28). Sisteme kızgın ama kendi potansiyelini geliştirmek istiyor.",
    bestFormats:      ["listicle", "story", "data"],
    proofStyle:       "Araştırma verileri, başarılı istisnalar, okul sistemi istatistikleri.",
  },

  creator: {
    niche:            "creator",
    label:            "Creator Economy & Sosyal Medya",
    researchFocus:    "Algoritmanın gerçek çalışma mantığı, küçük hesapların büyük hesapları geçtiği durumlar, platform politikası değişiklikleri",
    tone:             "İçeriden biri gibi. 'Ben bunu denedim, işte sonuç.' Veri + kişisel deneyim karışımı. Hype değil, gerçek.",
    primaryMechanism: "SPESIFIK_GERCEKLIK",
    audienceInsight:  "Creator, içerik üreticisi, sosyal medya yöneticisi (20–35). 'Çalışıyor mu?' sorusuna net cevap ister.",
    bestFormats:      ["data", "confession", "challenge"],
    proofStyle:       "Ekran görüntüsü vari veriler ('%340 artış, 14 günde'), kendi deneyi, platform açıklamaları.",
  },

  general: {
    niche:            "general",
    label:            "Genel",
    researchFocus:    "Konunun en şaşırtıcı ve kontraintüitif boyutu",
    tone:             "Net, merak uyandıran, Türkçe konuşma dili.",
    primaryMechanism: "MERAK_BOSLUGU",
    audienceInsight:  "Genel izleyici. İlk 3 saniyede 'bu beni ilgilendiriyor' hissi şart.",
    bestFormats:      ["story", "listicle", "data"],
    proofStyle:       "En güçlü spesifik sayı veya örnek.",
  },
};

// ─── Niche detector ───────────────────────────────────────────────────────────

const NICHE_SIGNALS: { niche: string; patterns: RegExp[] }[] = [
  { niche: "science",    patterns: [/uzay|teleskop|bilim|fizik|kimya|biyoloji|evren|kara delik|nasa|webb|ışık yılı|atom|dna|gezegen|kuantum|astro/i] },
  { niche: "money",      patterns: [/para|yatırım|borsa|kripto|bitcoin|girişim|startup|maaş|gelir|finans|ekonomi|bütçe|servet|emeklilik|faiz|enflasyon/i] },
  { niche: "psychology", patterns: [/psikoloji|beyin|davranış|alışkanlık|travma|motivasyon|özgüven|kaygı|depresyon|kişisel gelişim|mindset|duygu|bilinçdışı/i] },
  { niche: "technology", patterns: [/yapay zeka|ai|gpt|llm|yazılım|kod|programlama|teknoloji|robot|otomasyon|siber|veri|bulut|blockchain|meta verse|elektrikli araç/i] },
  { niche: "history",    patterns: [/tarih|savaş|imparatorluk|medeniyet|osmanlı|roma|mısır|orta çağ|devrim|arkeoloji|antik|yüzyıl|padişah|kral/i] },
  { niche: "health",     patterns: [/sağlık|hastalık|egzersiz|beslenme|diyet|vitamin|uyku|kalp|kanser|bağışıklık|spor|kilo|stres|meditasyon|wellness/i] },
  { niche: "culture",    patterns: [/film|dizi|müzik|sanat|pop kültür|celebrity|viral|trend|netflix|spotify|oyun|esports|anime|manga|moda|sosyal medya fenomeni/i] },
  { niche: "education",  patterns: [/eğitim|okul|üniversite|sınav|öğrenci|ders|öğrenme|diploma|burs|yks|lgs|akademi|ödev|müfredat/i] },
  { niche: "creator",    patterns: [/youtube|tiktok|instagram|reels|shorts|algoritma|izlenme|abone|takipçi|içerik üretici|creator|video çek|kanal büyüt|hook|thumbnail/i] },
];

export function detectNicheProfile(topic: string): NicheProfile {
  for (const { niche, patterns } of NICHE_SIGNALS) {
    if (patterns.some(p => p.test(topic))) {
      return NICHE_PROFILES[niche]!;
    }
  }
  return NICHE_PROFILES.general!;
}

/**
 * Prompt'a niche context bölümü ekler.
 * researchEngine ve insightEngine'in önüne yerleşir.
 */
export function buildNicheSection(profile: NicheProfile): string {
  return `
━━━ NİŞ BAĞLAMI ━━━
Kategori:          ${profile.label}
Araştırma odağı:   ${profile.researchFocus}
Anlatım tonu:      ${profile.tone}
Baskın mekanizma:  ${profile.primaryMechanism}
İzleyici profili:  ${profile.audienceInsight}
Kanıt stili:       ${profile.proofStyle}
Bu niş için önerilen formatlar: ${profile.bestFormats.join(", ")}
`;
}
