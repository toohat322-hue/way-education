import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useData } from "../admin/useData";
import { apiFetch } from "../lib/api";

// A single source of truth for the "get a consultation" form. Used by:
// - ApplySidebar (full detail page for partner universities)
// - RequestInfoModal (directory universities without full data yet)
export default function LeadForm({
  t,
  majors = [],
  onSubmitted,
  context = {},
}) {
  const { settings } = useData();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    major: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameId = "lead-name";
  const phoneId = "lead-phone";
  const emailId = "lead-email";
  const majorId = "lead-major";

  const utm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      source: params.get("utm_source") || undefined,
      medium: params.get("utm_medium") || undefined,
      campaign: params.get("utm_campaign") || undefined,
      term: params.get("utm_term") || undefined,
      content: params.get("utm_content") || undefined,
    };
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          whatsapp: form.phone,
          email: form.email,
          preferredCountry: context.preferredCountry,
          preferredUniversity: context.preferredUniversity,
          program: form.major || context.program,
          degree: context.degree,
          language: context.language,
          message: context.message,
          referralSource: context.referralSource || "website",
          utmSource: utm.source,
          utmMedium: utm.medium,
          utmCampaign: utm.campaign,
          utmTerm: utm.term,
          utmContent: utm.content,
        }),
      });
      setSubmitted(true);
      if (onSubmitted) onSubmitted(form);
    } catch (err) {
      setError(err.message || "Unable to submit your request right now.");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="p-4 rounded-xl text-sm text-center"
        style={{ background: "#E7F9F0", color: "#16A34A" }}
      >
        {t.formSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3 mb-4">
        <input
          id={nameId}
          name="name"
          aria-label={t.sidebarName}
          required
          placeholder={t.sidebarName}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: `1px solid ${C.border}` }}
          disabled={busy}
        />
        <input
          id={phoneId}
          name="phone"
          aria-label={t.sidebarPhone}
          required
          type="tel"
          placeholder={t.sidebarPhone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: `1px solid ${C.border}` }}
          disabled={busy}
        />
        <input
          id={emailId}
          name="email"
          aria-label={t.sidebarEmail}
          required
          type="email"
          placeholder={t.sidebarEmail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: `1px solid ${C.border}` }}
          disabled={busy}
        />
        {majors.length > 0 && (
          <select
            id={majorId}
            name="major"
            aria-label={t.sidebarMajorSel}
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white"
            style={{ border: `1px solid ${C.border}` }}
            disabled={busy}
          >
            <option value="">{t.sidebarMajorSel}</option>
            {majors.map((m, i) => (
              <option key={i}>{m}</option>
            ))}
          </select>
        )}
        {error && (
          <p className="text-xs" style={{ color: C.orangeDark }}>
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 mb-3"
        style={{ background: grad.cta, opacity: busy ? 0.8 : 1 }}
      >
        <Send size={15} /> {busy ? "Submitting..." : t.sidebarSubmit}
      </button>
      <a
        href={`https://wa.me/${settings.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        style={{ background: "#E7F9F0", color: "#16A34A" }}
      >
        <MessageCircle size={15} /> WhatsApp
      </a>
    </form>
  );
}
