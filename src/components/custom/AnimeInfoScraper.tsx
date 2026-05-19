import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAnimeInfo, type AnimeInfo } from "@/lib/getAnimeInfo";
import { addAnimeToUserList } from "@/lib/animeStorage";
import AnimeCard from "@/components/custom/AnimeCard";

// Für Dev: Vite CORS-Proxy (/proxy?url=...).
// Für Production: URL einer eigenen Serverless-Function eintragen.
const PROXY_BASE = "/proxy";

export function AnimeInfoScraper() {
  const { currentUser, isUser } = useAuth();
  const [url, setUrl] = useState("https://aniworld.to/anime/stream/one-piece");
  const [data, setData] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToFirestore, setSavedToFirestore] = useState(false);

  if (!currentUser || !isUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setSavedToFirestore(false);

    try {
      let result: AnimeInfo;

      if (currentUser) {
        // Eingeloggt: Cache-first via Firestore, Nutzer-Referenz anlegen
        result = await addAnimeToUserList(currentUser.uid, url.trim(), {
          proxyBase: PROXY_BASE,
        });
        setSavedToFirestore(true);
      } else {
        // Nicht eingeloggt: direkt scrapen, kein Firestore
        result = await getAnimeInfo(url.trim(), { proxyBase: PROXY_BASE });
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setSavedToFirestore(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Anime Info</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://aniworld.to/anime/stream/..."
          required
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Laden…" : "Abrufen"}
        </button>
        {data && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Reset
          </button>
        )}
      </form>

      {!currentUser && (
        <p className="text-xs text-muted-foreground">
          Nicht eingeloggt – Daten werden nicht in Firestore gespeichert.
        </p>
      )}

      {savedToFirestore && (
        <p className="text-xs text-green-600">
          ✓ In deiner Anime-Liste gespeichert.
        </p>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <strong>Fehler:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: 24 }}>
          <AnimeCard
            expand={false}
            title={data.title ?? "–"}
            subtitle={
              data.seasons.count +
              " Staffeln / " +
              data.episodes.count +
              " Folgen"
            }
            img={data.imageUrl ?? ""}
            content={data.description.short ?? ""}
            moreContent={data.description.full || JSON.stringify(data, null, 2)}
          />
        </div>
      )}

      {data && (
        <div className="space-y-6" style={{ marginTop: 64 }}>
          <div className="flex gap-6">
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt={data.title ?? "Cover"}
                className="h-48 w-32 rounded-md object-cover shadow"
              />
            )}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{data.title ?? "–"}</h2>
              <p className="text-sm text-muted-foreground">
                {data.seasons.count} Staffel{data.seasons.count !== 1 && "n"} ·{" "}
                {data.episodes.count} Folgen
              </p>
              {data.description.short && (
                <p className="text-sm leading-relaxed">
                  {data.description.short}
                </p>
              )}
            </div>
          </div>

          {/* <section>
            <h3 className="mb-2 font-semibold">Staffeln</h3>
            <div className="flex flex-wrap gap-2">
              {data.seasons.list.map((s) => (
                <a
                  key={s.number}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Staffel {s.number}
                </a>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-semibold">Alle Folgen ({data.episodes.count})</h3>
            <div className="max-h-96 overflow-y-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted text-left">
                  <tr>
                    <th className="px-3 py-2">S</th>
                    <th className="px-3 py-2">E</th>
                    <th className="px-3 py-2">Titel</th>
                    <th className="px-3 py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {data.episodes.list.map((ep, i) => (
                    <tr key={i} className="border-t border-border odd:bg-background even:bg-muted/30">
                      <td className="px-3 py-1 tabular-nums">{ep.season}</td>
                      <td className="px-3 py-1 tabular-nums">{ep.episode}</td>
                      <td className="px-3 py-1">{ep.name || "–"}</td>
                      <td className="px-3 py-1">
                        <a href={ep.href} target="_blank" rel="noreferrer" className="text-primary hover:underline">↗</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section> */}

          <details className="rounded-md border border-border">
            <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
              Raw JSON
            </summary>
            <pre className="overflow-x-auto p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
