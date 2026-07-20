import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import GlassCard from "./GlassCard";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

export default function FaqSection() {
  const { t, lang } = useLanguage();
  const { faqs } = useData();
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 md:py-24 max-w-3xl mx-auto px-5 sm:px-8">
      <SectionHeader eyebrow={t.faqEyebrow} title={t.faqTitle} />
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <GlassCard
            key={f.id}
            className="overflow-hidden"
            style={{ background: "#fff" }}
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left rtl:text-right"
            >
              <span
                className="font-semibold text-sm md:text-base"
                style={{ color: C.ink }}
              >
                {f.q[lang]}
              </span>
              <ChevronDown
                size={18}
                className="shrink-0 transition-transform duration-300"
                style={{
                  color: C.blue,
                  transform: open === i ? "rotate(180deg)" : "none",
                }}
              />
            </button>
            <div
              className="grid transition-all duration-300"
              style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {f.a[lang]}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
