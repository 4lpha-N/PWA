const ALLOWED_HOSTS = new Set(["aniworld.to", "www.aniworld.to"]);

function isAllowedTarget(target) {
  try {
    const url = new URL(target);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    return Array.from(ALLOWED_HOSTS).some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new Response("Missing url query parameter", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    if (!isAllowedTarget(targetUrl)) {
      return new Response("Target URL is not allowed", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; cf-proxy/1.0)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
      });

      const html = await response.text();
      return new Response(html, {
        status: response.status,
        headers: {
          ...CORS_HEADERS,
          "Content-Type":
            response.headers.get("content-type") || "text/html; charset=utf-8",
        },
      });
    } catch (error) {
      return new Response(
        error instanceof Error ? error.message : String(error),
        {
          status: 502,
          headers: CORS_HEADERS,
        },
      );
    }
  },
};
