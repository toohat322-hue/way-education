import React, { Suspense, lazy, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Award,
  Clock,
  Users,
  Globe,
  DollarSign,
  BookOpen,
  Check,
  Camera,
  Pencil,
  Star,
  Phone,
  Mail,
  Link2,
  EyeOff,
  X,
} from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import StarRow from "../components/StarRow";
import LeadForm from "../components/LeadForm";
import { useLanguage } from "../context/useLanguage";
import { useData } from "../admin/useData";
import { resolveIcon } from "../admin/iconRegistry";
import { useAdminAuth } from "../admin/useAdminAuth";

// The editor form is admin-only code -- lazy-load it so it isn't part of the
// bundle every regular site visitor downloads. Only fetched once an admin
// actually clicks Edit.
const UniversityFormModal = lazy(() => import("../admin/UniversityFormModal"));

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: "#F6F8FF" }}>
      <Icon size={16} color={C.blue} className="mb-2" />
      <div className="text-xs mb-0.5" style={{ color: C.muted }}>
        {label}
      </div>
      <div className="font-semibold text-sm" style={{ color: C.ink }}>
        {value}
      </div>
    </div>
  );
}

function ApplySidebar({ uni, t, lang }) {
  return (
    <GlassCard className="p-6" style={{ background: "#fff" }}>
      <h3
        className="font-semibold text-base mb-1"
        style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
      >
        {t.sidebarApplyTitle}
      </h3>
      <p className="text-xs mb-5" style={{ color: C.muted }}>
        {t.sidebarNote}
      </p>
      <LeadForm
        t={t}
        majors={uni.majors.map((m) => m.name[lang])}
        context={{
          preferredCountry: uni.country.en,
          preferredUniversity: uni.name,
          language: uni.language.en,
          degree: uni.type.en,
          referralSource: "university-detail",
        }}
      />
    </GlassCard>
  );
}

// Only renders once a university actually has contact/social info set in the
// admin form (src/admin/UniversityFormModal.jsx) -- both fields are optional
// so most seed universities won't show this card at all.
function ContactSocialCard({ uni }) {
  const contact = uni.contact || {};
  const social = uni.social || {};
  const hasContact = contact.phone || contact.email || contact.website;
  const hasSocial = social.facebook || social.instagram || social.linkedin;
  if (!hasContact && !hasSocial) return null;

  return (
    <GlassCard className="p-6 mt-5" style={{ background: "#fff" }}>
      <h3
        className="font-semibold text-sm mb-4"
        style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
      >
        Contact & Social
      </h3>
      {hasContact && (
        <div className="space-y-2.5">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: C.inkSoft }}
            >
              <Phone size={14} color={C.blue} /> {contact.phone}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: C.inkSoft }}
            >
              <Mail size={14} color={C.blue} /> {contact.email}
            </a>
          )}
          {contact.website && (
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm"
            >
              <Link2 size={14} color={C.blue} className="shrink-0" />{" "}
              <span className="truncate">
                {contact.website.replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}
        </div>
      )}
      {hasSocial && (
        <div
          className={`flex flex-wrap gap-2 ${hasContact ? "mt-4 pt-4" : ""}`}
          style={
            hasContact ? { borderTop: `1px solid ${C.border}` } : undefined
          }
        >
          {[
            ["Facebook", social.facebook],
            ["Instagram", social.instagram],
            ["LinkedIn", social.linkedin],
          ]
            .filter(([, url]) => url)
            .map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: C.bgAlt, color: C.inkSoft }}
              >
                {label}
              </a>
            ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isRtl } = useLanguage();
  const { getUniversityById } = useData();
  const { unlocked } = useAdminAuth();
  const [tab, setTab] = useState("about");
  const [editOpen, setEditOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const uni = getUniversityById(id);

  // Inactive universities are hidden from everyone except a logged-in admin
  // (who gets an "inactive" banner further down instead) -- same fallback UI
  // as a genuinely missing/mistyped id.
  if (!uni || (uni.active === false && !unlocked)) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="mb-4" style={{ color: C.muted }}>
          {t.notFound}
        </p>
        <Link
          to="/"
          className="font-semibold text-sm"
          style={{ color: C.blue }}
        >
          {t.backHome}
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: "about", label: t.aboutTab },
    { key: "majors", label: t.majorsTab },
    { key: "admission", label: t.admissionTab },
    { key: "reviews", label: t.reviewsTab },
    { key: "gallery", label: t.galleryTab },
    { key: "location", label: t.locationTab },
  ];
  const mapQuery = encodeURIComponent(`${uni.name} ${uni.city.en} Turkey`);

  return (
    <div>
      <div className="relative h-56 md:h-72" style={{ background: uni.grad }}>
        {uni.image ? (
          <img
            src={uni.image}
            alt={uni.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: uni.image ? "rgba(11,18,48,0.35)" : "transparent",
          }}
        />
        {uni.photoCredit && (
          <a
            href={uni.photoCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 end-2 text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded-full"
            style={{ background: "rgba(11,18,48,0.4)" }}
          >
            {uni.photoCredit.text}
          </a>
        )}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-between py-5 relative">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 w-fit"
            >
              {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}{" "}
              {t.backHome}
            </button>
            {unlocked && (
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-1.5 rounded-full transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <Pencil size={14} /> Edit
              </button>
            )}
          </div>
          <div className="flex items-end gap-4">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden"
              style={{ color: C.blue }}
            >
              {uni.logo ? (
                <img
                  src={uni.logo}
                  alt={`${uni.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                uni.initial
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="text-xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {uni.name}
                </h1>
                {uni.featured && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white shrink-0"
                    style={{ background: grad.cta }}
                  >
                    <Star size={11} fill="#fff" /> Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/85">
                <MapPin size={14} /> {uni.city[lang]}, {uni.country[lang]} ·{" "}
                {uni.type[lang]}
                <span className="hidden sm:inline-flex items-center gap-1 ms-2">
                  <StarRow rating={uni.rating} size={13} /> {uni.rating} (
                  {uni.reviews})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {unlocked && uni.active === false && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-6">
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm"
            style={{ background: "#FFF1EE", color: C.orangeDark }}
          >
            <EyeOff size={16} /> Inactive — hidden from students. Only visible
            to you because you're signed in as admin.
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid lg:grid-cols-[1fr,340px] gap-10">
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              [Award, `#${uni.ranking}`, t.ranking],
              [Clock, uni.founded, t.founded],
              [Users, uni.studentsCount, t.students],
              [Globe, uni.intl, t.intlStudents],
            ].map(([Icon, v, l], i) => (
              <GlassCard
                key={i}
                className="p-4 text-center"
                style={{ background: "#fff" }}
              >
                <Icon size={18} color={C.blue} className="mx-auto mb-2" />
                <div className="font-bold text-sm" style={{ color: C.ink }}>
                  {v}
                </div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {l}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scroll mb-6 pb-1">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200"
                style={{
                  background: tab === tb.key ? grad.primary : "#fff",
                  color: tab === tb.key ? "#fff" : C.inkSoft,
                  border: `1px solid ${tab === tb.key ? "transparent" : C.border}`,
                }}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <GlassCard className="p-6 fade-up" style={{ background: "#fff" }}>
              <p
                className="text-sm md:text-base leading-relaxed mb-6"
                style={{ color: C.inkSoft }}
              >
                {uni.about[lang]}
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <InfoPill
                  icon={DollarSign}
                  label={t.tuitionRange}
                  value={`$${uni.tuition.toLocaleString()}+`}
                />
                <InfoPill
                  icon={Globe}
                  label={t.language}
                  value={uni.language[lang]}
                />
                <InfoPill
                  icon={Award}
                  label={t.scholarshipUpTo}
                  value={`${uni.scholarship}%`}
                />
              </div>
            </GlassCard>
          )}

          {tab === "majors" && (
            <div className="grid sm:grid-cols-2 gap-4 fade-up">
              {uni.majors.map((m, i) => {
                const Icon = resolveIcon(m.iconName);
                return (
                  <GlassCard
                    key={i}
                    className="p-5 flex items-center gap-4"
                    style={{ background: "#fff" }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: grad.primarySoft }}
                    >
                      <Icon size={20} color={C.blue} />
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold text-sm"
                        style={{ color: C.ink }}
                      >
                        {m.name[lang]}
                      </div>
                      <div className="text-xs" style={{ color: C.muted }}>
                        ${m.fee.toLocaleString()}
                        {t.perYear}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {tab === "admission" && (
            <GlassCard className="p-6 fade-up" style={{ background: "#fff" }}>
              <h3
                className="font-semibold text-base mb-4"
                style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
              >
                {t.admissionReq}
              </h3>
              <div
                className="flex items-center gap-3 mb-5 p-3 rounded-xl"
                style={{ background: C.bgAlt }}
              >
                <BookOpen size={18} color={C.blue} />
                <span className="text-sm" style={{ color: C.inkSoft }}>
                  {t.gpaReq}: <b>{uni.gpaReq}</b>
                </span>
              </div>
              <h4 className="font-medium text-sm mb-3" style={{ color: C.ink }}>
                {t.docsReq}
              </h4>
              <ul className="space-y-2.5">
                {uni.docs[lang].map((d, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: C.inkSoft }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#E7F9EF" }}
                    >
                      <Check size={12} color="#16A34A" />
                    </div>
                    {d}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {tab === "reviews" && (
            <div className="fade-up">
              <GlassCard
                className="p-6 mb-5 flex items-center gap-6"
                style={{ background: "#fff" }}
              >
                <div
                  className="text-4xl font-extrabold"
                  style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}
                >
                  {uni.rating}
                </div>
                <div>
                  <StarRow rating={uni.rating} size={16} />
                  <div className="text-xs mt-1" style={{ color: C.muted }}>
                    {t.reviewsAvg} {uni.reviews} {t.reviewsCount}
                  </div>
                </div>
              </GlassCard>
              <div className="space-y-4">
                {uni.testimonials.map((r, i) => (
                  <GlassCard
                    key={i}
                    className="p-5"
                    style={{ background: "#fff" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: C.ink }}
                      >
                        {r.name}
                      </span>
                      <StarRow rating={r.rating} size={13} />
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      "{r.text[lang]}"
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div className="fade-up">
              <h3
                className="font-semibold text-base mb-4"
                style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
              >
                {t.galleryTitle}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uni.gallery && uni.gallery.length > 0
                  ? uni.gallery.map((src, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setActivePhotoIndex(i)}
                        className="group relative h-36 sm:h-44 rounded-2xl w-full overflow-hidden border border-[#e0e0e0] cursor-pointer bg-[#f4f4f4] hover:shadow-lg transition-all"
                      >
                        <img
                          src={src}
                          alt={`${uni.name} photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    ))
                  : [
                      grad.card1,
                      grad.card2,
                      grad.card3,
                      grad.card4,
                      grad.card1,
                      grad.card2,
                    ].map((g, i) => (
                      <div
                        key={i}
                        className="h-36 sm:h-44 rounded-2xl flex items-center justify-center border border-[#e0e0e0]"
                        style={{ background: g }}
                      >
                        <Camera size={24} color="rgba(255,255,255,0.75)" />
                      </div>
                    ))}
              </div>

              {/* Lightbox Modal */}
              {activePhotoIndex !== null && uni.gallery && (
                <div
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                  onClick={() => setActivePhotoIndex(null)}
                >
                  <button
                    onClick={() => setActivePhotoIndex(null)}
                    className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
                    aria-label="Close Lightbox"
                  >
                    <X size={24} />
                  </button>
                  {uni.gallery.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndex((prev) =>
                            prev === 0 ? uni.gallery.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full"
                        aria-label="Previous Photo"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndex((prev) =>
                            prev === uni.gallery.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full"
                        aria-label="Next Photo"
                      >
                        <ArrowRight size={24} />
                      </button>
                    </>
                  )}
                  <div
                    className="max-w-4xl max-h-[85vh] p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={uni.gallery[activePhotoIndex]}
                      alt={`${uni.name} expanded preview`}
                      className="max-w-full max-h-[80vh] object-contain mx-auto rounded"
                    />
                    <p className="text-center text-white/80 text-xs mt-3">
                      {activePhotoIndex + 1} of {uni.gallery.length} · {uni.name} Campus
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "location" && (
            <div className="fade-up">
              <h3
                className="font-semibold text-base mb-4"
                style={{ color: C.ink, fontFamily: "Poppins, sans-serif" }}
              >
                {t.mapTitle}
              </h3>
              <GlassCard
                className="overflow-hidden"
                style={{ background: "#fff" }}
              >
                <iframe
                  title="map"
                  className="w-full h-72 md:h-96 border-0"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </GlassCard>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <ApplySidebar uni={uni} t={t} lang={lang} />
          <ContactSocialCard uni={uni} />
        </aside>
      </div>

      {editOpen && (
        <Suspense fallback={null}>
          <UniversityFormModal uni={uni} onClose={() => setEditOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
