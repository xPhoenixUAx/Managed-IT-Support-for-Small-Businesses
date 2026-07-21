import "./build.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../config/site-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "client");
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".webp": "image/webp" };

const sendJson = (response, status, value) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(value));
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (url.pathname === siteConfig.forms.endpoint) {
    if (request.method !== "POST") return sendJson(response, 405, { ok: false, error: "Method not allowed." });
    let raw = "";
    for await (const chunk of request) raw += chunk;
    try { JSON.parse(raw); } catch { return sendJson(response, 400, { ok: false, error: "Please submit the form again." }); }
    return sendJson(response, 503, { ok: false, error: `Email delivery is being configured. Please email ${siteConfig.contact.email} directly.` });
  }

  const decoded = decodeURIComponent(url.pathname);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\//, "");
  const candidates = [relative, path.join(relative, "index.html")];
  for (const candidate of candidates) {
    const target = path.resolve(root, candidate);
    if (!target.startsWith(root)) break;
    try {
      if (!(await stat(target)).isFile()) continue;
      const body = await readFile(target);
      response.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
      response.end(body);
      return;
    } catch {}
  }
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1", () => process.stdout.write(`Vanilla site: http://localhost:${port}/\n`));
