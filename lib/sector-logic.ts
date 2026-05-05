export type SectorMetrics = {
  seo: number;
  ux: number;
  actions?: {
    text: string;
    reason: string;
  }[];
};

function hashString(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

export function generateDeterministicMetrics(sector: string): SectorMetrics {
  const hash = hashString(sector || "Dental Clinic");

  const seo = 70 + (hash % 21);
  const ux = 75 + (hash % 16);

  const actions = [
    {
      text:
        seo < 82
          ? "Local Maps & Authority paketi kur."
          : "SEO stabil; içerik otoritesini artır.",
      reason:
        seo < 82
          ? "SEO skoru bölgesel görünürlüğü kısıtlıyor."
          : "Mevcut skor iyi, büyüme içerik hacminden gelecek.",
    },
    {
      text:
        ux < 84
          ? "Mobile Core Web Vitals iyileştirmesi yap."
          : "UX yapısını koru ve dönüşüm testlerine geç.",
      reason:
        ux < 84
          ? "Mobil gecikme kullanıcı kaybına yol açabilir."
          : "UX seviyesi yeterli; sonraki kaldıraç CRO testidir.",
    },
  ];

  return { seo, ux, actions };
}

export function generateCDSPlan(sector: string, seoScore: number) {
  const strategies: Record<
    string,
    {
      twitter: string[];
      reels: string[];
      blog: string;
    }
  > = {
    "Dental Clinic": {
      twitter: [
        "Diş beyazlatma hakkında doğru bilinen 5 yanlış.",
        "Neden her 6 ayda bir diş kontrolü şart?",
        "Diş kliniği seçerken güven veren 3 kriter.",
      ],
      reels: [
        "Klinik içi güven turu senaryosu",
        "Before / After: Gülüş tasarımı",
        "1 dakikada diş sağlığı ipucu",
      ],
      blog: "Modern Diş Hekimliğinde Dijital Dönüşüm",
    },
    "SaaS Startup": {
      twitter: [
        "Product-led growth nasıl kurgulanır?",
        "V1'den V2'ye geçişte yapılan 5 hata.",
        "AI dashboard kullanıcıya nasıl güven verir?",
      ],
      reels: [
        "Dashboard walkthrough",
        "Müşteri başarı hikayesi",
        "AI otomasyon öncesi / sonrası",
      ],
      blog: "AI Entegrasyonu ile Verimlilik Artışı",
    },
    "E-Commerce": {
      twitter: [
        "Sepet terk oranını düşüren 5 taktik.",
        "Ürün sayfasında güven artıran 3 detay.",
        "E-ticarette hızlı karar aldıran CTA yapısı.",
      ],
      reels: [
        "Ürün showcase kısa video",
        "Müşteri yorumu odaklı reels",
        "Kargo / iade güven mesajı",
      ],
      blog: "E-Ticarette Dönüşüm Oranını Artırma Rehberi",
    },
  };

  const basePlan = strategies[sector] || strategies["SaaS Startup"];

  const twitter = [...basePlan.twitter];

  if (seoScore < 82) {
    twitter.push("Local SEO için Google Maps görünürlük rehberi.");
  }

  return {
    ...basePlan,
    twitter,
  };
}