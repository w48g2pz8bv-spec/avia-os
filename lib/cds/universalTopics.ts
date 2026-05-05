/**
 * universalTopics — İnsanların içgüdüsel olarak izlediği evrensel konu kategorileri.
 *
 * Araştırma motoru bu veriyle beslenir:
 *   - Hangi açı her zaman çalışır
 *   - Hangi duygu tetiklenecek
 *   - Hangi arketip kullanılacak
 *   - İzleyicinin asıl sorusu ne
 *
 * Kaynak: İnsan psikolojisinin 6 temel dürtüsü üzerine kurulu —
 *   hayatta kalma, statü, aidiyet, merak, adalet, güç/kontrol
 */

export type UniversalInterest = {
  category:         string;
  label:            string;
  whyAlwaysWorks:   string;  // bu kategori neden her zaman izlenir — psikolojik sebep
  primalDrive:      string;  // hangi evrimsel dürtüye dokunuyor
  bestAngle:        string;  // bu kategori için en güçlü içerik açısı
  viewerQuestion:   string;  // izleyicinin kafasındaki asıl soru
  archetype:        string;  // hangi narrative arketip en iyi çalışır
  emotionalTrigger: string;  // en güçlü duygu tetikleyici
  exampleHooks:     string[]; // bu kategoride işe yaramış hook örnekleri (format)
  searchPatterns:   string[]; // insanların bu kategoride aradığı kelimeler
};

export const UNIVERSAL_INTERESTS: UniversalInterest[] = [

  {
    category:         "money_power",
    label:            "Para & Güç",
    whyAlwaysWorks:   "Para hayatta kalmayı ve statüyü temsil eder. Beyin para tehdit/fırsatını her zaman önemli işaretler.",
    primalDrive:      "Hayatta kalma + statü",
    bestAngle:        "Çoğunun bilmediği para tuzağı veya gizli zenginleşme mekanizması",
    viewerQuestion:   "Ben neden hâlâ yoksulum / nasıl daha fazla kazanabilirim?",
    archetype:        "hidden_truth",
    emotionalTrigger: "Mali güvensizlik + 'ben bunu bilmiyordum' öfkesi",
    exampleHooks: [
      "Maaşının %[X]'i devlet tarafından [süreç]le alınıyor. Sana hiç anlatılmadı.",
      "[X] TL kazanan biri neden [Y] TL'ye muhtaç kalıyor? Cevap matematikte değil.",
      "Zengin olmak için çalışmak en kötü yol — bu [sayı] kişi çalışmadan zengin oldu.",
    ],
    searchPatterns: ["nasıl para kazanılır", "yatırım nasıl yapılır", "pasif gelir", "zengin nasıl olunur", "kripto", "borsa"],
  },

  {
    category:         "death_survival",
    label:            "Ölüm & Hayatta Kalma",
    whyAlwaysWorks:   "En temel evrimsel dürtü. Beyin hayatta kalma tehdidini otomatik olarak önceliklendirir.",
    primalDrive:      "Hayatta kalma",
    bestAngle:        "Günlük hayatta farkında olmadan yapılan ölüm riski artıran alışkanlıklar",
    viewerQuestion:   "Ben ve sevdiklerim güvende mi?",
    archetype:        "warning",
    emotionalTrigger: "Düşük düzey tehdit hissi + kontrol kaybı korkusu",
    exampleHooks: [
      "Her gün yaptığın [şey] ömrünü [X] yıl kısaltıyor. Bilim söylüyor.",
      "[Hastalık/tehlike] belirtisi herkeste var. Sen görmezden mi geliyorsun?",
      "[X] kişiden biri bunu bilmeden ölüyor. Şansın iyi mi?",
    ],
    searchPatterns: ["sağlıklı yaşam", "ölümcül hastalık belirtileri", "uzun yaşamın sırrı", "kanser nedenleri", "bağışıklık sistemi"],
  },

  {
    category:         "secrets_conspiracies",
    label:            "Sırlar & Gizlenenler",
    whyAlwaysWorks:   "Bilgiye erişim statü ve güç sağlar. Gizli bilgiye sahip olmak beyne ödül dopamini verir.",
    primalDrive:      "Statü + merak + güç",
    bestAngle:        "Büyük kurumların/şirketlerin kamuoyundan gizlediği gerçekler",
    viewerQuestion:   "Benden ne saklıyorlar?",
    archetype:        "inside_story",
    emotionalTrigger: "Kontrol kaybı korkusu + içeriden bilgi sahipliği hissi",
    exampleHooks: [
      "[Büyük şirket/kurum] bunu [X] yıldır biliyor. Neden söylemedi?",
      "Bu belgeler [yer]'de [yıl]'a kadar gizli tutuldu. Şimdi ne diyorlar?",
      "[Sektör] içindeyken öğrendiklerimi artık saklayamam.",
    ],
    searchPatterns: ["gizli belgeler", "komplo teorileri", "illuminati", "sırlar", "gerçek nedir", "bize söylenmeyen"],
  },

  {
    category:         "love_relationships",
    label:            "Aşk & İlişkiler",
    whyAlwaysWorks:   "Aidiyet ve çiftleşme en güçlü evrimsel dürtüler. İlişki acısı fiziksel acıyla aynı beyin bölgesini aktive eder.",
    primalDrive:      "Aidiyet + çiftleşme",
    bestAngle:        "İlişkilerde herkesin yaptığı ama farkında olmadığı sabote edici davranış",
    viewerQuestion:   "Ben neden sevilmiyorum / neden ilişkim çalışmıyor?",
    archetype:        "hidden_truth",
    emotionalTrigger: "Yalnızlık korkusu + 'bende bir sorun mu var' sorgulama",
    exampleHooks: [
      "[X] dediğinde karşındaki kişi seni %[Y] daha az çekici buluyor.",
      "Sağlıklı ilişkiler böyle hissettirmez — sen sadece bunu normalleştirdin.",
      "[Bağlanma biçimi] olan insanlar farkında olmadan ilişkilerini kendileri bitirir.",
    ],
    searchPatterns: ["ilişki tavsiyeleri", "toksik ilişki nasıl anlaşılır", "bağlanma stilleri", "ayrılık sonrası", "nasıl çekim yaratılır"],
  },

  {
    category:         "social_status",
    label:            "Statü & Toplumsal Onay",
    whyAlwaysWorks:   "İnsan sosyal bir hayvandır. Grup dışına atılma tehdidi beyin için ölüm tehdidi kadar güçlü sinyaller üretir.",
    primalDrive:      "Statü + aidiyet",
    bestAngle:        "Farkında olmadan statü kaybettiren davranışlar veya statü kazandıran gizli ritüeller",
    viewerQuestion:   "İnsanlar beni nasıl görüyor? Saygı görüyor muyum?",
    archetype:        "contrast",
    emotionalTrigger: "Sosyal dışlanma korkusu + statü rekabeti",
    exampleHooks: [
      "[Şeyi] yapan insanlar farkında olmadan 'düşük statü' sinyali veriyor.",
      "Odaya girdiğinde ilk [X] saniyede insanlar seni değerlendiriyor. Nasıl?",
      "Başarılı insanların [%X]'i şunu hiç yapmaz. Sen kaç kez yaptın?",
    ],
    searchPatterns: ["nasıl karizmatik olunur", "güçlü görünme", "beden dili", "ikna teknikleri", "sosyal beceriler"],
  },

  {
    category:         "justice_fairness",
    label:            "Adalet & Haksızlık",
    whyAlwaysWorks:   "Haksızlık tespiti beyin için otomatik bir alarm sistemidir. Öfke en viral duygudur — paylaşım dürtüsü yaratır.",
    primalDrive:      "Adalet + aidiyet",
    bestAngle:        "Sistemin küçük insanı nasıl dezavantajlı bıraktığı — spesifik mekanizma",
    viewerQuestion:   "Bu adil mi? Ben de mi kurbanım?",
    archetype:        "warning",
    emotionalTrigger: "Öfke + mağduriyet + 'bir şey yapmam lazım' hissi",
    exampleHooks: [
      "[Sistem/şirket/kurum] [sayı] yıldır bunu yapıyor. Ve tamamen yasal.",
      "Sen [X] TL öderken aynı şeyi [grup] bedavaya alıyor. Neden?",
      "[Kural/yasa/sistem] kimin çıkarına? Rakamlar konuşuyor.",
    ],
    searchPatterns: ["haksızlık", "sistem bozuk", "adaletsizlik", "haklarım neler", "şikâyet nereye yapılır"],
  },

  {
    category:         "identity_transformation",
    label:            "Kimlik & Dönüşüm",
    whyAlwaysWorks:   "İnsan kendini kim olduğuyla sürekli sorgular. Daha iyi versiyona ulaşma vaadi beyin için güçlü bir ödül sinyali.",
    primalDrive:      "Statü + anlam",
    bestAngle:        "Kişinin farkında olmadığı kendini sabote eden kimlik inancı",
    viewerQuestion:   "Neden hedeflerime ulaşamıyorum / kim olmak istiyorum?",
    archetype:        "hidden_truth",
    emotionalTrigger: "Kimlik tehdidi + 'değişebilirim' umudu",
    exampleHooks: [
      "'Ben böyle biriyim' dediğin her şey aslında öğrenilmiş bir kısıtlama.",
      "[X] yıl aynı şeyi yapıp farklı sonuç beklemek — bunu psikoloji ne diyor?",
      "En başarılı insanların ortak özelliği zeka veya çalışkanlık değil.",
    ],
    searchPatterns: ["kendini geliştirme", "alışkanlık oluşturma", "motivasyon nasıl bulunur", "kişisel gelişim", "mindset"],
  },

  {
    category:         "unknown_universe",
    label:            "Bilinmeyen & Evren",
    whyAlwaysWorks:   "Merak evrimsel bir avantajdır — bilinmeyeni keşfetmek potansiyel tehdit/fırsat demektir. Evren soruları varoluşsal bir kaygı yaratır.",
    primalDrive:      "Merak + varoluşsal anlam",
    bestAngle:        "Evren/bilim hakkında herkesin bildiğini sandığı ama tamamen yanlış olan şey",
    viewerQuestion:   "Gerçekten ne kadar küçüğüm? Yalnız mıyız? Bu ne anlama geliyor?",
    archetype:        "discovery",
    emotionalTrigger: "Varoluşsal hayranlık + küçüklük hissi + merak",
    exampleHooks: [
      "Şu an baktığın güneş ışığı [X] dakika önce güneşten çıktı. Ve [gerçek].",
      "[Bilimsel gerçek] doğruysa, fiziğin temel kurallarından birini yeniden yazmamız gerekiyor.",
      "Dünya'nın tüm tarihini 1 yıla sıkıştırsan, insanlık [tarih]'te doğmuş olurdu.",
    ],
    searchPatterns: ["evren nasıl oluştu", "uzay hakkında bilgiler", "kara delik nedir", "paralel evrenler", "yaşamın anlamı"],
  },

  {
    category:         "technology_future",
    label:            "Teknoloji & Gelecek",
    whyAlwaysWorks:   "Değişim tehdidi/fırsatı beyin için güçlü bir sinyal. 'Ben geri kalıyor muyum?' sorusu statü kaygısı yaratır.",
    primalDrive:      "Hayatta kalma + statü + merak",
    bestAngle:        "Şu an olan ama çoğunun görmediği teknolojik dönüşüm — senin işini/hayatını nasıl etkiliyor",
    viewerQuestion:   "Bu beni etkiler mi? Hazır mıyım? Geri kalıyor muyum?",
    archetype:        "countdown",
    emotionalTrigger: "FOMO + kontrol kaybı korkusu + merak",
    exampleHooks: [
      "[X] meslek [sayı] yıl içinde yok olacak. Senin mesleğin listede mi?",
      "ChatGPT'nin yapamadığını düşündüğün şeyleri şimdi yapıyor — bak:",
      "[Şirket] bu teknolojiyi [tarih]'te geliştirdi. Neden hâlâ kamuoyuna açıklamadılar?",
    ],
    searchPatterns: ["yapay zeka", "gelecekte meslekler", "teknoloji trendleri", "AI neler yapabilir", "dijital dönüşüm"],
  },
];

// ─── Universal interest detector ─────────────────────────────────────────────

const INTEREST_SIGNALS: { category: string; patterns: RegExp[] }[] = [
  { category: "money_power",           patterns: [/para|zengin|yatırım|borsa|kripto|maaş|gelir|servet|finans|ekonomi|vergi|bütçe/i] },
  { category: "death_survival",        patterns: [/ölüm|hastalık|kanser|sağlık|yaşam|hayatta kalma|risk|tehlike|yaşam süresi/i] },
  { category: "secrets_conspiracies",  patterns: [/gizli|sır|komplo|saklanan|gerçek|asıl|perde arkası|ifşa/i] },
  { category: "love_relationships",    patterns: [/aşk|ilişki|evlilik|ayrılık|partner|sevgili|çekim|bağlanma|yalnızlık/i] },
  { category: "social_status",         patterns: [/statü|prestij|karizm|güç|popüler|saygı|etki|liderlik|sosyal/i] },
  { category: "justice_fairness",      patterns: [/adalet|haksızlık|hak|şikâyet|sistem|eşitsizlik|yolsuzluk|sömürü/i] },
  { category: "identity_transformation", patterns: [/kimlik|dönüşüm|motivasyon|alışkanlık|başarı|gelişim|değişim|potansiyel/i] },
  { category: "unknown_universe",      patterns: [/evren|uzay|bilim|keşif|gizemli|bilinmeyen|fizik|astronomi|galaksi|zaman/i] },
  { category: "technology_future",     patterns: [/teknoloji|yapay zeka|ai|robot|gelecek|dijital|yazılım|inovasyon|metaverse/i] },
];

export function detectUniversalInterest(topic: string): UniversalInterest | null {
  for (const { category, patterns } of INTEREST_SIGNALS) {
    if (patterns.some(p => p.test(topic))) {
      return UNIVERSAL_INTERESTS.find(i => i.category === category) ?? null;
    }
  }
  return null;
}

/**
 * Araştırma ve senaryo prompt'larına evrensel ilgi bağlamı ekler.
 * Niche taxonomy'nin üstüne katman olarak çalışır.
 */
export function buildUniversalInterestSection(interest: UniversalInterest): string {
  return `
━━━ EVRENSEL İLGİ BAĞLAMI ━━━
Kategori:        ${interest.label}
Neden izlenir:   ${interest.whyAlwaysWorks}
İzleyicinin sorusu: ${interest.viewerQuestion}
Duygusal tetikleyici: ${interest.emotionalTrigger}
En güçlü açı:    ${interest.bestAngle}

İzleyici arama kalıpları (bu konuyu aratırken kullandıkları kelimeler):
${interest.searchPatterns.map(p => `  • "${p}"`).join("\n")}

İşe yaramış hook formatları:
${interest.exampleHooks.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}
`;
}
