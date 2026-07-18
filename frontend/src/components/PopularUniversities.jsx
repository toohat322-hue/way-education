import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { C } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import UniversityCard from "./UniversityCard";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

export default function PopularUniversities() {
  const { t, isRtl } = useLanguage();
  const { publicUniversities: universities } = useData();
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
      <SectionHeader eyebrow={t.popularEyebrow} title={t.popularTitle} sub={t.popularSub} />
      <div className="flex sm:hidden gap-4 overflow-x-auto hide-scroll pb-2 -mx-5 px-5">
        {universities.map((u) => <UniversityCard key={u.id} u={u} />)}
      </div>
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((u) => <UniversityCard key={u.id} u={u} />)}
      </div>
      <div className="text-center mt-10">
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: C.blue }}
        >
          {t.allUnisTitle} {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
        </Link>
      </div>
    </section>
  );
}
