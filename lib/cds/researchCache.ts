/**
 * researchCache — Topic araştırma sonuçlarını önbellekte saklar.
 * Aynı veya benzer konu tekrar geldiğinde GPT'ye araştırma sorusu gitmez.
 * Tasarruf: ~1200–1500 token / istek (cold path araştırma bölümü).
 *
 * Cache key: normalize edilmiş konu metni
 * TTL: 24 saat
 * Benzerlik eşiği: 0.55 overlap → cache hit
 * Max kayıt: 200
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CachedResearch = {
  key:       string;
  topic:     string;
  research:  Record<string, unknown>;
  createdAt: string;
  hitCount:  number;
};

type CacheStore = { entries: CachedResearch[] };

// ─── Config ───────────────────────────────────────────────────────────────────

const CACHE_FILE    = path.join(process.cwd(), "data", "research-cache.json");
const TTL_MS        = 48 * 60 * 60 * 1000;   // 48 saat (uzatıldı, daha fazla hit)
const MAX_ENTRIES   = 200;
const SIM_THRESHOLD = 0.38;                   // 0.55'ten düşürüldü: daha geniş benzerlik eşleşmesi

// ─── IO ───────────────────────────────────────────────────────────────────────

function load(): CacheStore {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf-8")) as CacheStore;
  } catch {
    return { entries: [] };
  }
}

function save(store: CacheStore): void {
  try {
    mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch { /* non-critical */ }
}

// ─── Key normalization ────────────────────────────────────────────────────────

function normalizeKey(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-zğüşıöç0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function tokenize(text: string): Set<string> {
  const STOP = new Set([
    "ve", "ile", "bir", "bu", "da", "de", "mi", "mu", "mı", "mü",
    "için", "olan", "olan", "çok", "daha", "en", "her", "ne", "gibi",
    "the", "a", "an", "of", "in", "on", "at", "to", "is", "are",
  ]);
  return new Set(
    text.split(/\s+/)
      .map(w => w.replace(/[^a-zğüşıöç0-9]/g, ""))
      .filter(w => w.length > 2 && !STOP.has(w))
  );
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let inter = 0;
  for (const t of setA) { if (setB.has(t)) inter++; }
  const union = setA.size + setB.size - inter;
  return inter / union;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Benzer bir konu varsa önbellekten döndür, yoksa null.
 * Hit count ve son görülme zamanı güncellenir.
 */
export function getCachedResearch(topic: string): CachedResearch["research"] | null {
  const store = load();
  const now   = Date.now();
  const key   = normalizeKey(topic);

  // Süresi dolmuş girişleri temizle
  const fresh = store.entries.filter(
    e => now - new Date(e.createdAt).getTime() < TTL_MS
  );

  // Tam eşleşme
  const exact = fresh.find(e => e.key === key);
  if (exact) {
    exact.hitCount++;
    save({ entries: fresh });
    return exact.research;
  }

  // Benzerlik eşleşmesi
  let best: { entry: CachedResearch; score: number } | null = null;
  for (const e of fresh) {
    const score = jaccardSimilarity(key, e.key);
    if (score >= SIM_THRESHOLD && (!best || score > best.score)) {
      best = { entry: e, score };
    }
  }

  if (best) {
    best.entry.hitCount++;
    save({ entries: fresh });
    return best.entry.research;
  }

  return null;
}

/**
 * Araştırma sonucunu önbelleğe kaydet.
 */
export function setCachedResearch(topic: string, research: Record<string, unknown>): void {
  const store = load();
  const now   = Date.now();
  const key   = normalizeKey(topic);

  // Süresi dolmuşları temizle
  const fresh = store.entries.filter(
    e => now - new Date(e.createdAt).getTime() < TTL_MS
  );

  // Aynı key varsa güncelle
  const existing = fresh.findIndex(e => e.key === key);
  const entry: CachedResearch = {
    key, topic, research,
    createdAt: new Date().toISOString(),
    hitCount: 0,
  };

  if (existing >= 0) {
    fresh[existing] = entry;
  } else {
    fresh.unshift(entry);
  }

  // Max kayıt sınırı
  save({ entries: fresh.slice(0, MAX_ENTRIES) });
}

/**
 * Cache istatistikleri (debug/monitoring için)
 */
export function getCacheStats(): { total: number; fresh: number; topTopics: string[] } {
  const store = load();
  const now   = Date.now();
  const fresh = store.entries.filter(
    e => now - new Date(e.createdAt).getTime() < TTL_MS
  );
  const topTopics = [...fresh]
    .sort((a, b) => b.hitCount - a.hitCount)
    .slice(0, 5)
    .map(e => e.topic);
  return { total: store.entries.length, fresh: fresh.length, topTopics };
}
