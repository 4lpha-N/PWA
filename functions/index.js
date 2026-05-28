const { onRequest } = require("firebase-functions/v2/https");

const ALLOWED_HOSTS = new Set(["aniworld.to", "www.aniworld.to"]);

function isAllowedTarget(target) {
  try {
    const url = new URL(target);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    return Array.from(ALLOWED_HOSTS).some(
      (allowedHost) =>
        hostname === allowedHost || hostname.endsWith(`.${allowedHost}`),
    );
  } catch {
    return false;
  }
}

exports.proxy = onRequest(
  {
    region: "europe-west3",
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Cache-Control", "no-store");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const rawUrl = req.query.url;
    const targetUrl = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

    if (!targetUrl || typeof targetUrl !== "string") {
      res.status(400).send("Missing url query parameter");
      return;
    }

    if (!isAllowedTarget(targetUrl)) {
      res.status(400).send("Target URL is not allowed");
      return;
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; firebase-proxy/1.0)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
      });

      const html = await response.text();
      res.status(response.status);
      res.set(
        "Content-Type",
        response.headers.get("content-type") || "text/html; charset=utf-8",
      );
      res.send(html);
    } catch (error) {
      console.error("Proxy fetch failed:", error);
      res
        .status(502)
        .send(error instanceof Error ? error.message : String(error));
    }
  },
);
