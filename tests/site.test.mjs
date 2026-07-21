import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { services } from "../config/services.mjs";
import { siteConfig } from "../config/site-config.mjs";
import worker from "../dist/server/index.js";

const root = path.resolve("dist", "client");
const readPage = (route) => readFile(path.join(root, route === "/" ? "index.html" : route.slice(1), route === "/" ? "" : "index.html"), "utf8");

test("builds every static route as HTML", async () => {
  const routes = ["/", "/about", "/contact", "/services", "/privacy-policy", "/terms", "/cookie-policy", ...services.map(({ slug }) => `/services/${slug}`)];
  assert.equal(routes.length, 17);
  for (const route of routes) {
    const html = await readPage(route);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<script src="\/assets\/app\.js" defer><\/script>/);
    assert.doesNotMatch(html, /_next|react|vinext/i);
  }
});

test("keeps company data and form settings in the central config", async () => {
  const html = await readPage("/contact");
  assert.match(html, new RegExp(siteConfig.contact.email.replaceAll(".", "\\.")));
  assert.match(html, new RegExp(siteConfig.contact.address.replaceAll(".", "\\.")));
  assert.match(html, /Advertising or partnership/);
});

test("contains no telephone actions", async () => {
  const html = await readPage("/");
  assert.doesNotMatch(html, /tel:|phone/i);
});

test("validates the vanilla Worker contact endpoint", async () => {
  const assets = { fetch: async () => new Response("not found", { status: 404 }) };
  const invalid = await worker.fetch(new Request("https://example.com/api/contact", { method: "POST", body: "{" }), { ASSETS: assets });
  assert.equal(invalid.status, 400);
  const validBody = JSON.stringify({ name: "Jordan Lee", email: "jordan@example.com", company: "Example Co", inquiryType: "General information", message: "Please share more information about support.", consent: "agreed", companyWebsite: "" });
  const missingCredentials = await worker.fetch(new Request("https://example.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: validBody }), { ASSETS: assets });
  assert.equal(missingCredentials.status, 503);
});
