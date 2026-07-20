import { NextResponse } from "next/server";
import { siteConfig } from "@/app/config/site-config";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  inquiryType?: unknown;
  message?: unknown;
  consent?: unknown;
  companyWebsite?: unknown;
};

const clean = (value: unknown, max = 5000) =>
  typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Please submit the form again." }, { status: 400 });
  }

  if (clean(payload.companyWebsite)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const company = clean(payload.company, 180);
  const inquiryType = clean(payload.inquiryType, 180);
  const message = clean(payload.message, 5000);
  const consent = clean(payload.consent, 30);

  if (!name || !isEmail(email) || !company || !inquiryType || message.length < 10 || consent !== "agreed") {
    return NextResponse.json({ ok: false, error: "Please complete every required field with valid information." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { ok: false, error: `Email delivery is being configured. Please email ${siteConfig.contact.email} directly.` },
      { status: 503 },
    );
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [siteConfig.contact.email],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!delivery.ok) {
    return NextResponse.json(
      { ok: false, error: `The message could not be delivered. Please email ${siteConfig.contact.email} directly.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
