import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import UniversityCard from "../components/UniversityCard";
import DirectoryCard from "../components/DirectoryCard";
import RequestInfoModal from "../components/RequestInfoModal";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";

const PAGE_SIZE = 24;

export default function Universities() {
  const { t, lang } = useLanguage();
  const { publicUniversities: universities, directory } = useData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(params.get("country") || "");
  const [type, setType] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [modalUni, setModalUni] = useState(null);

  const countries = useMemo(() => {
    const set = new Set(directory.map((u) => u.country));
    return Array.from(set);
  }, [directory]);

  const matchesFilters = (name, uniCountry, uniType) => {
    if (query && !name.toLowerCase().includes(query.toLowerCase())) return false;
    if (country && uniCountry !== country) return false;
    if (type && uniType !== type) return false;
    return true;
  };

  // Country/type filters compare against the canonical English values used in
  // the directory dataset ("Türkiye" / "N. Cyprus", "Public" / "Private").
  const filteredPartners = universities.filter((u) => matchesFilters(u.name, u.country.en, u.type.en));

  const filteredDirectory = directory.filter((u) => matchesFilters(u.name, u.country, u.type));
  const totalCount = filteredPartners.length + filteredDirectory.length;
  const shownDirectory = filteredDirectory.slice(0, Math.max(0, visible - filteredPartners.length));

  const handleCountryChange = (val) => {
    setCountry(val);
    setVisible(PAGE_SIZE);
    if (val) setParams({ country: val }); else setParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
          {t.allUnisTitle}
        </h1>
        <p className="text-base" style={{ color: C.muted }}>{t.allUnisSub}</p>
      </div>

      <GlassCard className="p-4 md:p-5 mb-10" style={{ background: "#fff" }}>
        <div className="grid sm:grid-cols-[1fr,180px,160px] gap-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <Search size={16} color={C.muted} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder={t.searchDirPlaceholder}
              aria-label={t.searchDirPlaceholder}
              type="search"
              className="flex-1 outline-none text-sm bg-transparent min-w-0"
            />
          </div>
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            aria-label={t.allCountries}
            className="px-3 py-2.5 rounded-xl text-sm bg-white outline-none"
            style={{ border: `1px solid ${C.border}` }}
          >
            <option value="">{t.allCountries}</option>
            {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setVisible(PAGE_SIZE); }}
            aria-label={t.anyType}
            className="px-3 py-2.5 rounded-xl text-sm bg-white outline-none"
            style={{ border: `1px solid ${C.border}` }}
          >
            <option value="">{t.anyType}</option>
            <option value="Public">{lang === "en" ? "Public" : "حكومية"}</option>
            <option value="Private">{lang === "en" ? "Private" : "خاصة"}</option>
          </select>
        </div>
      </GlassCard>

      {totalCount === 0 ? (
        <p className="text-center py-16 text-sm" style={{ color: C.muted }}>{t.noResults}</p>
      ) : (
        <>
          {filteredPartners.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredPartners.map((u) => <UniversityCard key={u.id} u={u} />)}
            </div>
          )}

          {shownDirectory.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {shownDirectory.map((u) => (
                <DirectoryCard key={u.id} uni={u} t={t} onRequestInfo={setModalUni} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-xs mb-4" style={{ color: C.muted }}>
              {t.showingResults} {Math.min(visible, totalCount)} {t.ofResults} {totalCount}
            </p>
            {visible < totalCount && (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                style={{ background: grad.primary }}
              >
                {t.loadMore}
              </button>
            )}
          </div>
        </>
      )}

      <RequestInfoModal uni={modalUni} t={t} onClose={() => setModalUni(null)} />
    </div>
  );
}
