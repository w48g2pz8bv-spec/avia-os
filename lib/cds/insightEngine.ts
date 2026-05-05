/**
 * insightEngine — Araştırma bulgularını içerik açılarına dönüştürür.
 * buildInsightSection() → prompt bölümü
 * selectBestAngle()     → post-processor (GPT çıktısından en iyi açıyı seçer)
 */

export type ContentAngle = {
  angle:          string;   // açının kısa açıklaması
  psychMechanism: string;   // MERAK_BOSLUGU | INANC_KIRMA | KIMLIK_TEHDIDI | SPESIFIK_GERCEKLIK | SOSYAL_TEHDIT
  targetEmotion:  string;   // merak | öfke | korku | umut | gurur
  contentType:    string;   // listicle | story | challenge | data | confession
  bestFor:        string[]; // hangi platformlar için ideal
  hookSeed:       string;   // bu açıdan üretilebilecek hook taslağı
};

export function buildInsightSection(): string {
  return `
━━━ INSIGHT MOTORU ━━━
Yukarıdaki araştırma bulgularını 2-3 güçlü içerik açısına dönüştür.

Her açı için şunları belirle:
- angle: Bu açıyı tek cümleyle açıkla (içerik stratejisti gibi düşün)
- psychMechanism: Hangi psikolojik mekanizmayı tetikliyor?
  MERAK_BOSLUGU | INANC_KIRMA | KIMLIK_TEHDIDI | SPESIFIK_GERCEKLIK | SOSYAL_TEHDIT
- targetEmotion: İzleyicide hangi duyguyu tetiklemelisin? (merak/öfke/korku/umut/gurur)
- contentType: Bu açı için en uygun format: listicle | story | challenge | data | confession
- bestFor: Bu açı hangi platformlarda daha güçlü çalışır? (TikTok / Instagram Reels / YouTube Shorts / X)
- hookSeed: Bu açıdan çıkabilecek en güçlü hook taslağı — henüz nihai hook değil, yön gösterici

Açı seçim kriterleri:
✓ Araştırma bulgularının en şaşırtıcı kısmını kullan
✓ Her açı farklı bir psikolojik mekanizma kullanmalı
✓ "Herkes zaten biliyor" hissini verme — spesifik + kontraintüitif
`;
}

export function selectBestAngle(
  angles: ContentAngle[],
  platforms: string[],
): ContentAngle | null {
  if (!angles || angles.length === 0) return null;

  // Platforma uygun açıyı önceliklendir
  const scored = angles.map(a => {
    let score = 0;
    const platformMatch = platforms.filter(p =>
      (a.bestFor || []).some(bf => bf.toLowerCase().includes(p.toLowerCase()))
    ).length;
    score += platformMatch * 3;

    // Güçlü mekanizmaları öncekilendir
    const strongMechs = ["INANC_KIRMA", "KIMLIK_TEHDIDI", "SPESIFIK_GERCEKLIK"];
    if (strongMechs.includes(a.psychMechanism)) score += 2;

    // hookSeed'i olan açılar daha hazır
    if (a.hookSeed && a.hookSeed.length > 20) score += 1;

    return { angle: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].angle;
}
