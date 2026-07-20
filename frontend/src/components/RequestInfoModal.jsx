import React, { useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { C } from "../theme/tokens";
import LeadForm from "./LeadForm";

export default function RequestInfoModal({ uni, t, onClose }) {
  useEffect(() => {
    if (!uni) return undefined;

    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [uni, onClose]);

  if (!uni) return null;
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ background: "rgba(11,18,48,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 relative fade-up"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={uni.name}
      >
        <button
          onClick={onClose}
          className="absolute top-4 inset-e-4 p-1.5 rounded-full"
          style={{ background: C.bgAlt }}
          aria-label="Close"
        >
          <X size={16} color={C.inkSoft} />
        </button>
        <h3
          className="font-semibold text-base mb-1 pe-8"
          style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
        >
          {uni.name}
        </h3>
        <div
          className="flex items-center gap-1 text-xs mb-4"
          style={{ color: C.muted }}
        >
          <MapPin size={12} /> {uni.city} · {uni.country} · {uni.type}
        </div>
        <p className="text-xs mb-5" style={{ color: C.muted }}>
          {t.sidebarNote}
        </p>
        <LeadForm
          t={t}
          context={{
            preferredCountry: uni.country,
            preferredUniversity: uni.name,
            referralSource: "directory-request-info",
          }}
        />
      </div>
    </div>
  );
}
