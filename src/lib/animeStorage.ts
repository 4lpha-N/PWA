import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { getAnimeInfo, type AnimeInfo, type GetAnimeInfoOptions } from '@/lib/getAnimeInfo';

// ──────────────────────────────────────────────────────────────────────────────
// Typen
// ──────────────────────────────────────────────────────────────────────────────

export interface AnimeDocument {
  url: string;
  cachedAt: Timestamp;
  data: AnimeInfo;
}

export interface UserAnimeDocument {
  animeId: string;
  addedAt: Timestamp;
}

// Cache ist nach dieser Zeitspanne abgelaufen (Standard: 24 Stunden)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// ──────────────────────────────────────────────────────────────────────────────
// Hilfsfunktionen
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Leitet eine stabile Anime-ID aus der URL ab.
 * z. B. "https://aniworld.to/anime/stream/one-piece" → "one-piece"
 */
export function animeIdFromUrl(url: string): string {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? url;
}

function isCacheStale(cachedAt: Timestamp): boolean {
  return Date.now() - cachedAt.toMillis() > CACHE_TTL_MS;
}

// ──────────────────────────────────────────────────────────────────────────────
// Globaler Anime-Cache (Collection: "animes")
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Gibt Anime-Daten zurück – aus Firestore-Cache wenn vorhanden und frisch,
 * sonst wird die Seite neu gescraped und der Cache aktualisiert.
 */
export async function getOrFetchAnime(
  url: string,
  options: GetAnimeInfoOptions = {},
): Promise<AnimeInfo> {
  const animeId = animeIdFromUrl(url);
  const animeRef = doc(db, 'animes', animeId);
  const snap = await getDoc(animeRef);

  if (snap.exists()) {
    const cached = snap.data() as AnimeDocument;
    if (!isCacheStale(cached.cachedAt)) {
      return cached.data;
    }
  }

  // Neu fetchen und Cache aktualisieren
  const data = await getAnimeInfo(url, options);
  await setDoc(animeRef, {
    url,
    cachedAt: serverTimestamp(),
    data,
  } satisfies Omit<AnimeDocument, 'cachedAt'> & { cachedAt: ReturnType<typeof serverTimestamp> });

  return data;
}

// ──────────────────────────────────────────────────────────────────────────────
// Nutzer-Anime-Liste (Collection: "users/{userId}/animes")
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Fügt einen Anime zur Merkliste des Nutzers hinzu.
 * Legt dabei den globalen Anime-Cache an / aktualisiert ihn falls nötig.
 * Gibt die (ggf. gecachten) Anime-Daten zurück.
 */
export async function addAnimeToUserList(
  userId: string,
  url: string,
  options: GetAnimeInfoOptions = {},
): Promise<AnimeInfo> {
  const animeId = animeIdFromUrl(url);

  // 1. Globalen Cache befüllen / prüfen
  const data = await getOrFetchAnime(url, options);

  // 2. Nutzer-Referenz anlegen (idempotent via merge)
  const userAnimeRef = doc(db, 'user', userId, 'animes', animeId);
  await setDoc(
    userAnimeRef,
    { animeId, addedAt: serverTimestamp() } satisfies Omit<UserAnimeDocument, 'addedAt'> & {
      addedAt: ReturnType<typeof serverTimestamp>;
    },
    { merge: true },
  );

  return data;
}

/**
 * Prüft ob ein Anime bereits auf der Merkliste des Nutzers steht.
 */
export async function isAnimeInUserList(userId: string, url: string): Promise<boolean> {
  const animeId = animeIdFromUrl(url);
  const snap = await getDoc(doc(db, 'users', userId, 'animes', animeId));
  return snap.exists();
}

/**
 * Entfernt einen Anime aus der Merkliste des Nutzers.
 * Der globale Cache bleibt erhalten.
 */
export async function removeAnimeFromUserList(userId: string, url: string): Promise<void> {
  const { deleteDoc } = await import('firebase/firestore');
  const animeId = animeIdFromUrl(url);
  await deleteDoc(doc(db, 'users', userId, 'animes', animeId));
}
