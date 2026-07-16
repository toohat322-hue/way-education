import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useData } from "../admin/useData";

// A single source of truth for the "get a consultation" form. Used by:
// - ApplySidebar (full detail page for partner universities)
// - RequestInfoModal (directory universities without full data yet)
export default function LeadForm({ t, majors = [], onSubmitted }) {
  const { settings } = useData();
  const [form, setForm] = useState({ name: "", phone: "", email: "", major: "" });
  const [submitted, setSubmitted] = useState(false);
  const nameId = "lead-name";
  const phoneId = "lead-phone";
  const emailId = "lead-email";
  const majorId = "lead-major";

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend yet -- wire this up to your API / CRM / email service later.
    // e.g. fetch("/api/leads", { method: "POST", body: JSON.stringify(form) })
    setSubmitted(true);
    if (onSubmitted) onSubmitted(form);
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl text-sm text-center" style={{ background: "#E7F9F0", color: "#16A34A" }}>
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
          >
            <option value="">{t.sidebarMajorSel}</option>
            {majors.map((m, i) => <option key={i}>{m}</option>)}
          </select>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 mb-3"
        style={{ background: grad.cta }}
      >
        <Send size={15} /> {t.sidebarSubmit}
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
