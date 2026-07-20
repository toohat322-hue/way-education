import React from "react";
import { Link } from "react-router-dom";
import { C, grad } from "../theme/tokens";
import { useLanguage } from "../context/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
      <p
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: C.muted }}
      >
        404
      </p>
      <h1
        className="text-3xl md:text-4xl font-bold mb-4"
        style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
      >
        Page Not Found
      </h1>
      <p className="mb-8" style={{ color: C.inkSoft }}>
        {t.notFound}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white"
        style={{ background: grad.primary }}
      >
        {t.backHome}
      </Link>
    </div>
  );
}
