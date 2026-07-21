import { siteConfig } from "./site-config.js";

const clean = (value, max = 5000) =>
  typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

async function submitContact(request, env) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Please submit the form again." }, 400);
  }

  if (clean(payload.companyWebsite)) return json({ ok: true });

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const company = clean(payload.company, 180);
  const inquiryType = clean(payload.inquiryType, 180);
  const message = clean(payload.message, 5000);
  const consent = clean(payload.consent, 30);

  if (!name || !isEmail(email) || !company || !inquiryType || message.length < 10 || consent !== "agreed") {
    return json({ ok: false, error: "Please complete every required field with valid information." }, 400);
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return json({ ok: false, error: `Email delivery is being configured. Please email ${siteConfig.contact.email} directly.` }, 503);
  }

  const subject = `[${siteConfig.brand.siteName}] ${inquiryType} - ${company}`;
  const text = [
    `New website request for ${siteConfig.brand.companyName}`,
    "",
    `Name: ${name}`,
    `Business email: ${email}`,
    `Company: ${company}`,
    `Request type: ${inquiryType}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [siteConfig.contact.email],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!delivery.ok) {
    return json({ ok: false, error: `The message could not be delivered. Please email ${siteConfig.contact.email} directly.` }, 502);
  }

  return json({ ok: true });
}

const withSecurityHeaders = (response) => {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === siteConfig.forms.endpoint) return submitContact(request, env);

    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && !url.pathname.split("/").pop().includes(".")) {
      const fallbackUrl = new URL(url);
      fallbackUrl.pathname = `${url.pathname.replace(/\/$/, "")}/index.html`;
      response = await env.ASSETS.fetch(new Request(fallbackUrl, request));
    }
    return withSecurityHeaders(response);
  },
};
