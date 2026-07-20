"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { siteConfig } from "@/app/config/site-config";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm({ compact = false, defaultService = "" }: { compact?: boolean; defaultService?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== "success") return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setState("idle");
    document.addEventListener("keydown", closeOnEscape);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [state]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(siteConfig.forms.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your request.");
      form.reset();
      setState("success");
    } catch (submitError) {
      setState("error");
      setError(submitError instanceof Error ? submitError.message : "We could not send your request. Please email us instead.");
    }
  }

  return (
    <>
      <form className={`contact-form ${compact ? "compact" : ""}`} onSubmit={handleSubmit}>
        <input className="form-trap" type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="form-grid">
          <label><span>Name</span><input required name="name" type="text" autoComplete="name" placeholder="Your name" /></label>
          <label><span>Business email</span><input required name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
          <label><span>Company</span><input required name="company" type="text" autoComplete="organization" placeholder="Company name" /></label>
          <label>
            <span>What can we help with?</span>
            <select required name="inquiryType" defaultValue={defaultService || ""}>
              <option value="" disabled>Select a request type</option>
              {defaultService && !siteConfig.forms.inquiryTypes.includes(defaultService as never) && <option value={defaultService}>{defaultService}</option>}
              {siteConfig.forms.inquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
        </div>
        <label><span>How is this affecting the business?</span><textarea required name="message" rows={compact ? 4 : 6} placeholder="Describe the issue, setup, or information you need. Please do not include passwords or verification codes." /></label>
        <label className="consent"><input required name="consent" type="checkbox" value="agreed" /><span>{siteConfig.forms.consentLabel}</span></label>
        {state === "error" && <div className="form-error" role="alert">{error} <a href={`mailto:${siteConfig.contact.email}`}>Email {siteConfig.contact.email}</a></div>}
        <button className="button button-primary submit-button" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><LoaderCircle className="spin" size={18} /> Sending</> : "Send request"}
        </button>
        <p className="form-note">Messages are sent securely to {siteConfig.contact.email}.</p>
      </form>

      {state === "success" && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setState("idle")}>
          <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" tabIndex={-1} ref={dialogRef}>
            <button className="modal-close" type="button" onClick={() => setState("idle")} aria-label="Close confirmation"><X size={20} /></button>
            <div className="modal-check"><Check size={32} /></div>
            <p className="eyebrow">Message sent</p>
            <h2 id="success-title">{siteConfig.forms.successTitle}</h2>
            <p>Thanks for contacting {siteConfig.brand.siteName}. {siteConfig.forms.successMessage}</p>
            <p className="modal-email">A copy was delivered to <strong>{siteConfig.contact.email}</strong>.</p>
            <button className="button button-primary" type="button" onClick={() => setState("idle")}>Done</button>
          </div>
        </div>
      )}
    </>
  );
}
