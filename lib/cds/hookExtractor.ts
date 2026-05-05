/**
 * hookExtractor — Senaryolardan en güçlü hookları çıkarır.
 * Post-processor: GPT çağrısı yapmaz.
 * Mevcut scoreHook() ile skorlar, psychMechanism ile etiketler.
 */

import { scoreHook } from "./scoreHook";

export type HookCandidate = {
  hook:           string;
  platform:       string;
  psychMechanism: string;
  score:          number;
  source:         "script_hook" | "scene_text" | "gpt_extracted";
};

const MECH_SIGNALS: { pattern: RegExp; mech: string }[] = [
  { pattern: /\d+.*(ay|gün|saat|yıl|k takipçi|tl|%)/i,                      mech: "SPESIFIK_GERCEKLIK" },
  { pattern: /(herkes.*ama|yaygın inanç|aslında.*değil|yanlış biliyor)/i,     mech: "INANC_KIRMA" },
  { pattern: /(batmak|kaybetmek|yapma rehberi|yanlış yol)/i,                  mech: "INANC_KIRMA" },
  { pattern: /(yıllarca|hep.*yaptım|yanılıyordum|pişman)/i,                   mech: "KIMLIK_TEHDIDI" },
  { pattern: /(yaşında.*yapıyorsan|hâlâ.*yapıyorsan|sen.*de.*yapıyorsan)/i,   mech: "KIMLIK_TEHDIDI" },
  { pattern: /(kimse.*söylemiyor|haberlerde|görünmeyen|söylemiyor)/i,          mech: "SOSYAL_TEHDIT" },
  { pattern: /(rakipler.*kullanıyor|herkes.*biliyor.*sen)/i,                   mech: "SOSYAL_TEHDIT" },
  { pattern: /(neden.*yapamıyor|peki neden|merak.*ettin mi)/i,                 mech: "MERAK_BOSLUGU" },
  { pattern: /(arasındaki tek|sadece bir şey|tek fark)/i,                      mech: "MERAK_BOSLUGU" },
];

function detectMechanism(hook: string): string {
  for (const { pattern, mech } of MECH_SIGNALS) {
    if (pattern.test(hook)) return mech;
  }
  return "GENEL";
}

function isViableHook(hook: string): boolean {
  if (!hook || hook.length < 25 || hook.length > 150) return false;
  if (hook.includes("{") || hook.includes("}"))        return false;
  const lower = hook.toLowerCase();
  const banned = ["sandığın şey değil; asıl mesele", "keşfet", "sırlar", "bilinmeyen gerçekler"];
  return !banned.some(b => lower.includes(b));
}

export function extractHooks(
  scriptOutputs: Record<string, any>,
  gptHooks: { hook: string; platform: string; psychMechanism?: string }[] = [],
): HookCandidate[] {
  const candidates: HookCandidate[] = [];

  // GPT'nin doğrudan ürettiği hook'lar (topHooks array'i)
  for (const h of gptHooks) {
    if (!isViableHook(h.hook)) continue;
    candidates.push({
      hook:           h.hook,
      platform:       h.platform,
      psychMechanism: h.psychMechanism || detectMechanism(h.hook),
      score:          scoreHook(h.hook, h.platform),
      source:         "gpt_extracted",
    });
  }

  // Senaryo hook'ları
  for (const [platform, script] of Object.entries(scriptOutputs)) {
    if (!script) continue;

    // Script hook field
    if (typeof script.hook === "string" && isViableHook(script.hook)) {
      const mech = detectMechanism(script.hook);
      candidates.push({
        hook:           script.hook,
        platform:       normalizePlatform(platform),
        psychMechanism: mech,
        score:          scoreHook(script.hook, normalizePlatform(platform)),
        source:         "script_hook",
      });
    }

    // Scene text'lerinden kısa güçlü cümleler
    const scenes: any[] = script.scenes || [];
    for (const scene of scenes) {
      const text = scene.text || "";
      if (isViableHook(text) && text.split(" ").length <= 15) {
        candidates.push({
          hook:           text,
          platform:       normalizePlatform(platform),
          psychMechanism: detectMechanism(text),
          score:          scoreHook(text, normalizePlatform(platform)),
          source:         "scene_text",
        });
      }
    }

    // X thread'in ilk tweet'i
    if (platform === "x" && Array.isArray(script.tweets) && script.tweets[0]) {
      const tweet = script.tweets[0];
      if (isViableHook(tweet)) {
        candidates.push({
          hook:           tweet,
          platform:       "X",
          psychMechanism: detectMechanism(tweet),
          score:          scoreHook(tweet, "X"),
          source:         "script_hook",
        });
      }
    }
  }

  // Deduplicate by hook prefix (ilk 30 karakter)
  const seen = new Set<string>();
  const unique = candidates.filter(c => {
    const key = c.hook.toLowerCase().slice(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort((a, b) => b.score - a.score).slice(0, 8);
}

function normalizePlatform(key: string): string {
  const map: Record<string, string> = {
    tiktok: "TikTok",
    instagram: "Instagram Reels",
    youtube: "YouTube Shorts",
    x: "X",
  };
  return map[key.toLowerCase()] || key;
}
