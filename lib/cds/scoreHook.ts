// Tek kaynaklı kalite listesi — tüm pipeline buraya bakar
export const GENERIC_PHRASES = [
  "şok olacaksın", "inanamayacaksın", "bunu kaçırma",
  "gerçekleri öğren", "sırlarını keşfet", "başarıya ulaş",
  "sen de yapabilirsin", "hazır mısın", "hayatını değiştir",
  "bilmen gereken", "sandığın şey değil",
  "çoğunun gözden kaçırdığı kritik nokta",
  "bilinmeyen gerçekler", "mutlaka izle", "bunu dene",
  "herkes bunu yanlış yapıyor", "kimse sana söylemiyor",
  "bu belgeseli izlemek zorundasın",
];

const TENSION_WORDS = [
  "neden", "nasıl", "hata", "kaybet", "gizli", "kimse",
  "yanlış", "asıl", "değil", "oysa", "ama", "aslında",
  "tersine", "çünkü", "sanılır", "sanıyor", "aslı",
];

const CONTRAST_WORDS = [
  "ama", "değil", "asıl", "oysa", "aslında", "tersine",
  "sanılır", "sanıyor", "karşın", "rağmen",
];

export function scoreHook(hook: string, platform = "general"): number {
  const text = hook.toLowerCase();

  let score = 50;

  // Uzunluk optimal aralığı
  if (hook.length >= 35 && hook.length <= 95) score += 10;
  if (hook.length > 95 && hook.length <= 120)  score +=  4;

  // Spesifik veri sinyali (sayı, yüzde, tarih)
  if (/\d|%/.test(text))                        score += 12;

  // Kontrast yapısı
  if (CONTRAST_WORDS.some(w => text.includes(w))) score += 12;

  // Gerilim/merak sinyali
  const tensionCount = TENSION_WORDS.filter(w => text.includes(w)).length;
  score += Math.min(tensionCount * 4, 12);

  // Güçlü ilk kelime (sayı / eylem / itiraf / soru / tehdit)
  const firstWord = hook.split(/\s/)[0] ?? "";
  if (/^\d/.test(firstWord))                    score +=  6; // Sayıyla başlıyor
  if (/^(dur|bırak|dikkat|uyarı)/i.test(firstWord)) score += 5;
  if (/^(neden|nasıl|peki)/i.test(firstWord))   score +=  5;
  if (/^(hâlâ|eğer)/i.test(firstWord))          score +=  4;
  if (/^(yanıldım|yıllarca)/i.test(firstWord))  score +=  4;

  // Generic ceza
  const isGeneric = GENERIC_PHRASES.some(p => text.includes(p));
  if (isGeneric) score -= 30;

  // Platform bonusu
  if (platform === "X"        && hook.length <= 140) score += 5;
  if (platform !== "X"        && hook.length <= 110) score += 5;

  // Placeholder / bozuk hook cezası
  if (hook.includes("{") || hook.includes("}"))  score -= 40;
  if (hook.length < 25)                          score -= 20;

  return Math.max(0, Math.min(100, score));
}
