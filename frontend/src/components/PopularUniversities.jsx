import React, { useState } from "react";
import { C, grad } from "../theme/tokens";
import SectionHeader from "./SectionHeader";
import UniversityCard from "./UniversityCard";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

export default function PopularUniversities() {
  const { t } = useLanguage();
  const { publicUniversities: universities } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedUniversities = universities.slice(
    startIndex,
    startIndex + pageSize,
  );
  const totalPages = Math.max(2, Math.ceil(universities.length / pageSize));

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-5 sm:px-8">
      <SectionHeader
        eyebrow={t.popularEyebrow}
        title={t.popularTitle}
        sub={t.popularSub}
      />
      <div className="flex sm:hidden gap-4 overflow-x-auto hide-scroll pb-2 -mx-5 px-5">
        {displayedUniversities.map((u) => (
          <UniversityCard key={u.id} u={u} />
        ))}
      </div>
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedUniversities.map((u) => (
          <UniversityCard key={u.id} u={u} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-11 h-11 rounded-xl text-base font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
                  style={
                    isActive
                      ? {
                          background: grad.primary,
                          color: "#ffffff",
                          boxShadow: "0 6px 16px rgba(31,95,158,0.35)",
                        }
                      : {
                          background: "#ffffff",
                          color: C.ink,
                          border: `1px solid ${C.border}`,
                        }
                  }
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
