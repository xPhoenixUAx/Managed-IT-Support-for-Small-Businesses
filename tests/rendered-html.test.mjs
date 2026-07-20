import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the SteadyDesk IT home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /SteadyDesk IT/);
  assert.match(html, /Reliable IT help for your/);
  assert.match(html, /Request support/);
  assert.doesNotMatch(html, /loading skeleton|react-loading-skeleton/i);
});

test("renders required legal pages", async () => {
  for (const path of ["/privacy-policy", "/terms", "/cookie-policy"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
  }
});

test("keeps repeated company data in the central config", async () => {
  const config = await readFile(new URL("../app/config/site-config.ts", import.meta.url), "utf8");
  assert.match(config, /siteName: "SteadyDesk IT"/);
  assert.match(config, /email: "support@steadydeskit.com"/);
  assert.match(config, /address:/);
  assert.match(config, /successMessage:/);
});
