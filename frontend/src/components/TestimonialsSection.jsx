import React, { useEffect, useMemo, useState } from "react";
import { Quote } from "lucide-react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import GlassCard from "./GlassCard";
import StarRow from "./StarRow";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

export default function TestimonialsSection() {
  const { t, lang } = useLanguage();
  const { universities } = useData();
  const allTestimonials = useMemo(
    () =>
      universities.flatMap((u) =>
        u.testimonials.map((tt) => ({ ...tt, uni: u.name })),
      ),
    [universities],
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (allTestimonials.length === 0) return undefined;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % allTestimonials.length),
      5000,
    );
    return () => clearInterval(id);
  }, [allTestimonials.length]);

  const item = allTestimonials[idx];
  if (!item) return null;

  return (
    <section className="py-16 md:py-24 max-w-4xl mx-auto px-5 sm:px-8">
      <SectionHeader eyebrow={t.testiEyebrow} title={t.testiTitle} />
      <GlassCard
        className="p-8 md:p-12 text-center relative"
        style={{ background: "#fff" }}
      >
        <Quote size={36} color={C.blue} className="mx-auto mb-5 opacity-70" />
        <p
          key={idx}
          className="text-lg md:text-xl font-medium leading-relaxed mb-6 fade-up"
          style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
        >
          "{item.text[lang]}"
        </p>
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: grad.primary }}
          >
            {item.name.charAt(0)}
          </div>
          <div className="font-semibold text-sm" style={{ color: C.ink }}>
            {item.name}
          </div>
          <div className="text-xs" style={{ color: C.muted }}>
            {item.uni}
          </div>
          <StarRow rating={item.rating} />
        </div>
        <div className="flex items-center justify-center gap-2 mt-8">
          {allTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Testimonial ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 24 : 8,
                background: i === idx ? C.blue : C.border,
              }}
            />
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
