import React from "react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";
import { resolveIcon } from "../admin/iconRegistry";

export default function MajorsSection() {
  const { t, lang } = useLanguage();
  const { majors } = useData();
  return (
    <section
      id="programs"
      className="py-16 md:py-24 scroll-mt-20"
      style={{ background: C.bgAlt }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow={t.majorsEyebrow}
          title={t.majorsTitle}
          sub={t.majorsSub}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {majors.map((m) => {
            const Icon = resolveIcon(m.iconName);
            return (
              <button
                key={m.id}
                className="group text-left rtl:text-right p-5 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 4px 16px rgba(15,23,60,0.04)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: grad.primarySoft }}
                >
                  <Icon
                    size={20}
                    color={C.blue}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: C.ink }}
                >
                  {m.name[lang]}
                </div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {m.count} {lang === "en" ? "programs" : "برنامج"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
