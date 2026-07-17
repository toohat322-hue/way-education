import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useLanguage } from "../context/useLanguage";

// Order matches t.nav in translations.js: [Universities, Programs, N. Cyprus, About, Contact]
const NAV_ROUTES = ["/universities", "/#programs", "/universities?country=N.%20Cyprus", "/about", "/contact"];

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "rgba(246,248,255,0.8)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <img src="/brand/logo.jpeg" alt="Way Education logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg md:text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
            Way <span style={{ color: C.blue }}>Education</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {t.nav.map((item, i) => (
            <Link
              key={i}
              to={NAV_ROUTES[i]}
              className="text-sm font-medium transition-colors"
              style={{ color: C.inkSoft }}
              onMouseOver={(e) => (e.currentTarget.style.color = C.blue)}
              onMouseOut={(e) => (e.currentTarget.style.color = C.inkSoft)}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{ border: `1px solid ${C.border}`, color: C.inkSoft, background: "#fff" }}
          >
            <Globe size={15} /> {lang === "en" ? "العربية" : "English"}
          </button>
          <button
            onClick={() => navigate("/contact?source=navbar-apply")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ background: grad.cta, boxShadow: "0 8px 20px rgba(255,106,43,0.35)" }}
          >
            {t.navApply}
          </button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-5 pb-5 flex flex-col gap-4 fade-up" style={{ borderTop: `1px solid ${C.border}` }}>
          {t.nav.map((item, i) => (
            <Link key={i} to={NAV_ROUTES[i]} onClick={() => setMenuOpen(false)} className="text-sm font-medium pt-3" style={{ color: C.inkSoft }}>
              {item}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold"
              style={{ border: `1px solid ${C.border}`, color: C.inkSoft, background: "#fff" }}
            >
              <Globe size={15} /> {lang === "en" ? "العربية" : "English"}
            </button>
            <button onClick={() => navigate("/contact?source=mobile-navbar-apply")} className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: grad.cta }}>
              {t.navApply}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
