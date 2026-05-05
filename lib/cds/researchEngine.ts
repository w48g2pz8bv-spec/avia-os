/**
 * researchEngine — Konudan araştırma bulgularını çıkarır.
 * Saf prompt builder: GPT çağrısı yapmaz, route'un tek çağrısına
 * eklenmek üzere bir prompt bölümü ve tip tanımları döner.
 */

export type ResearchFindings = {
  facts:          string[];   // şaşırtıcı/kontraintüitif gerçekler
  misconceptions: string[];   // izleyicinin yanlış bildiği şeyler
  targetAudience: string;     // kim umursayor ve neden
  keyTension:     string;     // konunun merkezi gerilimi (X vs Y)
  specificProof:  string;     // en spesifik sayı / örnek / vaka
};

export function buildResearchSection(topic: string): string {
  return `
━━━ ARAŞTIRMA MOTORU ━━━
Konu: "${topic}"

Bu konuyu derin araştır. Şu soruları cevaplayarak research objesini doldur:

1. facts (2-4 madde): Çoğunun bilmediği ya da ters-sezgisel (kontraintüitif) gerçekler.
   → "Herkes X sanıyor ama aslında Y" formatında, spesifik ve kanıtlanabilir.
   → Vague: "algoritma önemlidir" ❌  Spesifik: "İlk 3 saniye izlenme oranı %80 retention belirler" ✓

2. misconceptions (1-3 madde): İzleyicinin hâlâ doğru sandığı ama yanlış olan şeyler.
   → Bunlar "inanç kırma" hook'larının hammaddesi.

3. targetAudience: Bu konuyu EN ÇOK kimin umursadığı ve neden — tek cümle, somut.

4. keyTension: Konunun merkezi gerilimi. Genellikle iki şey arasındaki çelişki.
   → "herkes X yapıyor ama başarılı olanlar Y yapıyor" formatı işe yarar.

5. specificProof: Bu konuya ait en güçlü spesifik örnek, sayı veya vaka.
   → Rakam içermeli. "Büyük başarı" değil, "3 ayda %340 artış" formatında.
`;
}
