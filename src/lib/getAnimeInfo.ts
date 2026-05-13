// ──────────────────────────────────────────────────────────────────────────────
// getAnimeInfo.ts
//
// Scraped die Metadaten einer Anime-Seite (z. B. aniworld.to).
//
// CORS-Hinweis:
//   Browser können externe Seiten nicht direkt fetchen.
//   Konfiguriere in vite.config.ts einen Proxy z. B. unter "/proxy" für Dev,
//   und eine serverlose Funktion für Production.
//   Übergib dann PROXY_BASE_URL = "/proxy" bzw. die Funktion-URL.
// ──────────────────────────────────────────────────────────────────────────────

export interface AnimeEpisode {
  /** Relativer oder absoluter href des Folgen-Links */
  href: string;
  /** Episodentitel aus .seasonEpisodeTitle a */
  name: string;
  /** Staffelnummer */
  season: number;
  /** Folgennummer innerhalb der Staffel */
  episode: number;
}

export interface AnimeSeason {
  /** Staffelnummer (aus dem Link-Text) */
  number: number;
  /** Relativer href der Staffel-Seite */
  href: string;
}

export interface AnimeInfo {
  imageUrl: string | null;
  title: string | null;
  description: {
    /** Sichtbarer Kurztext (Inhalt des p-Tags) */
    short: string | null;
    /** Voller Text aus data-full-description */
    full: string | null;
  };
  seasons: {
    count: number;
    list: AnimeSeason[];
  };
  episodes: {
    /** Alle Folgen aller Staffeln, flach */
    list: AnimeEpisode[];
    /** Gesamtanzahl Folgen */
    count: number;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Internes Fetch + Parse
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Holt eine URL über einen optionalen Proxy und gibt ein geparsertes Document zurück.
 *
 * @param targetUrl   Die eigentliche Ziel-URL (z. B. https://aniworld.to/...)
 * @param proxyBase   Optionaler Proxy-Präfix. Wenn gesetzt, wird
 *                    `${proxyBase}?url=<encoded targetUrl>` gefetcht.
 */
async function fetchDocument(
  targetUrl: string,
  proxyBase?: string,
): Promise<Document> {
  const fetchUrl = proxyBase
    ? `${proxyBase}?url=${encodeURIComponent(targetUrl)}`
    : targetUrl;

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Fetch fehlgeschlagen: ${res.status} ${res.statusText} – ${fetchUrl}`);
  }

  const html = await res.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

// ──────────────────────────────────────────────────────────────────────────────
// Season-Parsing (Hauptseite)
// ──────────────────────────────────────────────────────────────────────────────

function toAbsolute(href: string, origin: string): string {
  if (!href) return '';
  return href.startsWith('http') ? href : `${origin}${href}`;
}

function parseSeasons(doc: Document, origin: string): AnimeSeason[] {
  const nav = doc.querySelector('.hosterSiteDirectNav ul:first-of-type');
  if (!nav) return [];

  return Array.from(nav.querySelectorAll('li'))
    .filter((li) => {
      const text = li.querySelector('a')?.textContent?.trim() ?? '';
      return /^\d+$/.test(text); // nur reine Zahlen → Staffeln; "Filme" ignorieren
    })
    .map((li) => {
      const a = li.querySelector('a')!;
      return {
        number: parseInt(a.textContent!.trim(), 10),
        href: toAbsolute(a.getAttribute('href') ?? '', origin),
      };
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Folgen einer Staffel-Seite parsen
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Baut eine Map { episodeNumber -> Episodentitel } aus den Tabellen-Zeilen
 * einer Staffel-Seite.
 * Selector: [data-episode-season-id] .seasonEpisodeTitle a
 */
function buildEpisodeNameMapFromDoc(doc: Document): Map<number, string> {
  const map = new Map<number, string>();
  doc.querySelectorAll('[data-episode-season-id]').forEach((el) => {
    const eAttr = el.getAttribute('data-episode-season-id');
    const name =
      el.querySelector('.seasonEpisodeTitle a strong')?.textContent?.trim() ||
      el.querySelector('.seasonEpisodeTitle a span')?.textContent?.trim() ||
      '';
    if (eAttr) {
      map.set(parseInt(eAttr, 10), name);
    }
  });
  return map;
}

function parseEpisodesFromSeasonDoc(
  doc: Document,
  seasonNumber: number,
  origin: string,
): AnimeEpisode[] {
  // Episoden-Links aus der Navigationsleiste
  const nav = doc.querySelector('.hosterSiteDirectNav ul:last-of-type');
  if (!nav) return [];

  // Episoden-Titel aus den Tabellenzeilen der gleichen Seite
  const nameMap = buildEpisodeNameMapFromDoc(doc);

  return Array.from(nav.querySelectorAll('li'))
    .filter((li) => !!li.querySelector('a'))
    .map((li, idx) => {
      const a = li.querySelector('a')!;
      // data-episode-id falls vorhanden, sonst Fallback auf Index
      const epAttr = li.getAttribute('data-episode-season-id') ??
        a.getAttribute('data-episode-season-id');
      const episodeNumber = epAttr ? parseInt(epAttr, 10) : idx + 1;
      return {
        href: toAbsolute(a.getAttribute('href') ?? '', origin),
        name: nameMap.get(episodeNumber) ?? a.querySelector('span')?.textContent?.trim() ?? '',
        season: seasonNumber,
        episode: episodeNumber,
      };
    });
}

// ──────────────────────────────────────────────────────────────────────────────
// Hauptfunktion
// ──────────────────────────────────────────────────────────────────────────────

export interface GetAnimeInfoOptions {
  /**
   * Proxy-Basis-URL (ohne trailing slash).
   * Beispiel für Vite Dev-Proxy:   "/proxy"
   * Beispiel für Firebase Function: "https://your-fn.cloudfunctions.net/proxy"
   *
   * Der Proxy muss `?url=<encodedUrl>` unterstützen und die Seite als HTML zurückgeben.
   * Ohne Angabe wird direkt gefetcht (funktioniert nur wenn CORS erlaubt).
   */
  proxyBase?: string;
}

/**
 * Holt und parsed alle relevanten Metadaten einer Anime-Seite.
 *
 * @param url     Vollständige URL der Anime-Hauptseite
 * @param options Optionale Konfiguration (Proxy etc.)
 */
export async function getAnimeInfo(
  url: string,
  options: GetAnimeInfoOptions = {},
): Promise<AnimeInfo> {
  const { proxyBase } = options;
  const origin = new URL(url).origin;

  // 1. Hauptseite holen
  const mainDoc = await fetchDocument(url, proxyBase);

  // 2. Basisdaten
  const imageEl = mainDoc.querySelector('.seriesCoverBox img');
  const imageUrl = toAbsolute(
    imageEl?.getAttribute('data-src') ?? imageEl?.getAttribute('src') ?? '',
    origin,
  ) || null;

  const title =
    mainDoc.querySelector('.series-title h1 span')?.textContent?.trim() ?? null;

  const descEl = mainDoc.querySelector('p.seri_des');
  const descClone = descEl?.cloneNode(true) as HTMLElement | undefined;
  descClone?.querySelector('.showMore')?.remove();
  const description = {
    short: descClone?.textContent?.trim() ?? null,
    full: descEl?.getAttribute('data-full-description') ?? null,
  };

  // 3. Staffeln
  const seasonList = parseSeasons(mainDoc, origin);

  // 4. Für jede Staffel die Folgen-Seite holen und parsen
  const allEpisodes: AnimeEpisode[] = [];

  for (const season of seasonList) {
    const seasonDoc = await fetchDocument(season.href, proxyBase);
    const episodes = parseEpisodesFromSeasonDoc(seasonDoc, season.number, origin);
    allEpisodes.push(...episodes);
  }

  return {
    imageUrl,
    title,
    description,
    seasons: {
      count: seasonList.length,
      list: seasonList,
    },
    episodes: {
      list: allEpisodes,
      count: allEpisodes.length,
    },
  };
}
