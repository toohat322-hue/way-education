import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useData } from "./useData";
import { useToast } from "./useToast";
import { resolveIcon, ICON_NAMES } from "./iconRegistry";
import {
  Field,
  Label,
  TextInput,
  TextArea,
  Select,
  PrimaryButton,
  GhostButton,
  AdminModal,
  Toggle,
} from "./ui";
import ImageUploadField from "./ImageUploadField";
import GalleryUploadField from "./GalleryUploadField";
import { sanitizeExternalUrl } from "./security";

const COUNTRY_OPTIONS = [
  { en: "Türkiye", ar: "تركيا" },
  { en: "N. Cyprus", ar: "قبرص الشمالية" },
];
const TYPE_OPTIONS = [
  { en: "Public", ar: "حكومية" },
  { en: "Private", ar: "خاصة" },
];
const CARD_GRADS = [grad.card1, grad.card2, grad.card3, grad.card4];

function initFromUni(uni) {
  if (uni) {
    return {
      name: uni.name,
      image: uni.image || "",
      logo: uni.logo || "",
      gallery: uni.gallery || [],
      cityEn: uni.city.en,
      cityAr: uni.city.ar,
      countryEn: uni.country.en,
      typeEn: uni.type.en,
      tuition: uni.tuition,
      rating: uni.rating,
      reviews: uni.reviews,
      ranking: uni.ranking,
      founded: uni.founded,
      studentsCount: uni.studentsCount,
      intl: uni.intl,
      languageEn: uni.language.en,
      languageAr: uni.language.ar,
      scholarship: uni.scholarship,
      gpaReq: uni.gpaReq,
      aboutEn: uni.about.en,
      aboutAr: uni.about.ar,
      majors: uni.majors.map((m) => ({
        nameEn: m.name.en,
        nameAr: m.name.ar,
        fee: m.fee,
        iconName: m.iconName || "GraduationCap",
      })),
      docsEn: uni.docs.en.join("\n"),
      docsAr: uni.docs.ar.join("\n"),
      testimonials: uni.testimonials.map((t) => ({
        name: t.name,
        textEn: t.text.en,
        textAr: t.text.ar,
        rating: t.rating,
      })),
      phone: uni.contact?.phone || "",
      email: uni.contact?.email || "",
      website: uni.contact?.website || "",
      facebook: uni.social?.facebook || "",
      instagram: uni.social?.instagram || "",
      linkedin: uni.social?.linkedin || "",
      featured: uni.featured || false,
      active: uni.active !== false,
    };
  }
  return {
    name: "",
    image: "",
    logo: "",
    gallery: [],
    cityEn: "",
    cityAr: "",
    countryEn: "Türkiye",
    typeEn: "Private",
    tuition: 2000,
    rating: 4.5,
    reviews: 0,
    ranking: 50,
    founded: String(new Date().getFullYear()),
    studentsCount: "",
    intl: "",
    languageEn: "English",
    languageAr: "إنجليزي",
    scholarship: 0,
    gpaReq: "",
    aboutEn: "",
    aboutAr: "",
    majors: [],
    docsEn: "",
    docsAr: "",
    testimonials: [],
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    featured: false,
    active: true,
  };
}

// Shared partner-university editor. Used by the admin dashboard
// (src/admin/pages/AdminUniversities.jsx), gated behind the admin auth
// check on the public UniversityDetail page so an admin can edit a
// university from its own overview without leaving the page, and by the
// "Promote to partner" flow on the Directory page (see `initial`/`onSaved`).
//
// `initial` seeds a blank ("add new") form with partial values -- used when
// promoting a directory entry. `onSaved` fires after a successful add/update,
// before onClose, so a caller (e.g. the promote flow) can react to the save.
export default function UniversityFormModal({
  uni,
  initial,
  onClose,
  onSaved,
}) {
  const { addUniversity, updateUniversity } = useData();
  const showToast = useToast();
  const baseline = uni
    ? initFromUni(uni)
    : { ...initFromUni(null), ...(initial || {}) };
  const [form, setForm] = useState(() => baseline);
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);

  const guardedClose = () => {
    if (
      dirty &&
      !window.confirm("Discard unsaved changes? Your edits will be lost.")
    )
      return;
    onClose();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  // For controls that hand back a raw value instead of an event (ImageUploadField, Toggle).
  const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const updateMajorRow = (i, patch) =>
    setForm((f) => ({
      ...f,
      majors: f.majors.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    }));
  const addMajorRow = () =>
    setForm((f) => ({
      ...f,
      majors: [
        ...f.majors,
        { nameEn: "", nameAr: "", fee: 0, iconName: "GraduationCap" },
      ],
    }));
  const removeMajorRow = (i) =>
    setForm((f) => ({ ...f, majors: f.majors.filter((_, idx) => idx !== i) }));

  const updateTestimonialRow = (i, patch) =>
    setForm((f) => ({
      ...f,
      testimonials: f.testimonials.map((t, idx) =>
        idx === i ? { ...t, ...patch } : t,
      ),
    }));
  const addTestimonialRow = () =>
    setForm((f) => ({
      ...f,
      testimonials: [
        ...f.testimonials,
        { name: "", textEn: "", textAr: "", rating: 5 },
      ],
    }));
  const removeTestimonialRow = (i) =>
    setForm((f) => ({
      ...f,
      testimonials: f.testimonials.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawLinks = {
      website: form.website,
      facebook: form.facebook,
      instagram: form.instagram,
      linkedin: form.linkedin,
    };
    const cleanLinks = {};
    for (const [key, value] of Object.entries(rawLinks)) {
      const raw = String(value || "").trim();
      const sanitized = sanitizeExternalUrl(raw);
      if (raw && !sanitized) {
        showToast(`Invalid ${key} URL. Use a full http(s) link.`, "error");
        return;
      }
      cleanLinks[key] = sanitized;
    }

    const country =
      COUNTRY_OPTIONS.find((c) => c.en === form.countryEn) ||
      COUNTRY_OPTIONS[0];
    const type =
      TYPE_OPTIONS.find((t) => t.en === form.typeEn) || TYPE_OPTIONS[0];

    const payload = {
      name: form.name,
      image: form.image || undefined,
      logo: form.logo || undefined,
      gallery: form.gallery,
      city: { en: form.cityEn, ar: form.cityAr },
      country,
      type,
      tuition: Number(form.tuition) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      ranking: Number(form.ranking) || 0,
      founded: form.founded,
      studentsCount: form.studentsCount,
      intl: form.intl,
      language: { en: form.languageEn, ar: form.languageAr },
      scholarship: Number(form.scholarship) || 0,
      gpaReq: form.gpaReq,
      about: { en: form.aboutEn, ar: form.aboutAr },
      majors: form.majors.map((m) => ({
        name: { en: m.nameEn, ar: m.nameAr },
        fee: Number(m.fee) || 0,
        iconName: m.iconName,
      })),
      docs: {
        en: form.docsEn
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        ar: form.docsAr
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      testimonials: form.testimonials.map((t) => ({
        name: t.name,
        text: { en: t.textEn, ar: t.textAr },
        rating: Number(t.rating) || 5,
      })),
      contact: {
        phone: form.phone.trim(),
        email: form.email.trim(),
        website: cleanLinks.website,
      },
      social: {
        facebook: cleanLinks.facebook,
        instagram: cleanLinks.instagram,
        linkedin: cleanLinks.linkedin,
      },
      featured: form.featured,
      active: form.active,
      grad:
        uni?.grad || CARD_GRADS[Math.floor(Math.random() * CARD_GRADS.length)],
      initial: (form.name.charAt(0) || "U").toUpperCase(),
    };

    try {
      let saved;
      if (uni) {
        saved = await updateUniversity(uni.id, payload);
      } else {
        saved = await addUniversity(payload);
      }

      showToast(
        uni ? `Saved changes to ${payload.name}` : `${payload.name} added`,
      );
      if (onSaved) onSaved(saved);
      onClose();
    } catch (err) {
      showToast(err.message || "Unable to save university", "error");
    }
  };

  return (
    <AdminModal
      title={uni ? `Edit ${uni.name}` : "Add Partner University"}
      onClose={guardedClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" id="uni-name">
            <TextInput required value={form.name} onChange={set("name")} />
          </Field>
          <Field label="Founded year" id="uni-founded">
            <TextInput value={form.founded} onChange={set("founded")} />
          </Field>
          <Field label="City (English)" id="uni-city-en">
            <TextInput required value={form.cityEn} onChange={set("cityEn")} />
          </Field>
          <Field label="City (Arabic)" id="uni-city-ar">
            <TextInput
              required
              value={form.cityAr}
              onChange={set("cityAr")}
              dir="rtl"
            />
          </Field>
          <Field label="Country" id="uni-country">
            <Select value={form.countryEn} onChange={set("countryEn")}>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.en} value={c.en}>
                  {c.en}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type" id="uni-type">
            <Select value={form.typeEn} onChange={set("typeEn")}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.en} value={t.en}>
                  {t.en}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUploadField
            label="Cover / hero image"
            value={form.image}
            onChange={setValue("image")}
            shape="wide"
          />
          <ImageUploadField
            label="Logo"
            value={form.logo}
            onChange={setValue("logo")}
            shape="square"
          />
        </div>

        <GalleryUploadField
          value={form.gallery}
          onChange={setValue("gallery")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Tuition ($/yr)" id="uni-tuition">
            <TextInput
              type="number"
              value={form.tuition}
              onChange={set("tuition")}
            />
          </Field>
          <Field label="Rating" id="uni-rating">
            <TextInput
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={set("rating")}
            />
          </Field>
          <Field label="Reviews" id="uni-reviews">
            <TextInput
              type="number"
              value={form.reviews}
              onChange={set("reviews")}
            />
          </Field>
          <Field label="Ranking (#)" id="uni-ranking">
            <TextInput
              type="number"
              value={form.ranking}
              onChange={set("ranking")}
            />
          </Field>
          <Field label="Students" id="uni-students">
            <TextInput
              value={form.studentsCount}
              onChange={set("studentsCount")}
              placeholder="42,000+"
            />
          </Field>
          <Field label="Int'l students" id="uni-intl">
            <TextInput
              value={form.intl}
              onChange={set("intl")}
              placeholder="6,500+"
            />
          </Field>
          <Field label="Scholarship (%)" id="uni-scholarship">
            <TextInput
              type="number"
              value={form.scholarship}
              onChange={set("scholarship")}
            />
          </Field>
          <Field label="Min. GPA" id="uni-gpa">
            <TextInput
              value={form.gpaReq}
              onChange={set("gpaReq")}
              placeholder="70%+"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Language of instruction (English)" id="uni-lang-en">
            <TextInput value={form.languageEn} onChange={set("languageEn")} />
          </Field>
          <Field label="Language of instruction (Arabic)" id="uni-lang-ar">
            <TextInput
              value={form.languageAr}
              onChange={set("languageAr")}
              dir="rtl"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="About (English)" id="uni-about-en">
            <TextArea rows={4} value={form.aboutEn} onChange={set("aboutEn")} />
          </Field>
          <Field label="About (Arabic)" id="uni-about-ar">
            <TextArea
              rows={4}
              value={form.aboutAr}
              onChange={set("aboutAr")}
              dir="rtl"
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Programs</Label>
            <button
              type="button"
              onClick={addMajorRow}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: C.blue }}
            >
              <Plus size={13} /> Add program
            </button>
          </div>
          <div className="space-y-3">
            {form.majors.map((m, i) => {
              const Icon = resolveIcon(m.iconName);
              return (
                <div
                  key={i}
                  className="p-3 rounded-xl space-y-2"
                  style={{ background: C.bgAlt }}
                >
                  <div className="grid grid-cols-[auto,1fr,1fr,90px,auto] gap-2 items-center">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: grad.primarySoft }}
                    >
                      <Icon size={16} color={C.blue} />
                    </div>
                    <TextInput
                      aria-label="Program name in English"
                      placeholder="Major (EN)"
                      value={m.nameEn}
                      onChange={(e) =>
                        updateMajorRow(i, { nameEn: e.target.value })
                      }
                    />
                    <TextInput
                      aria-label="Program name in Arabic"
                      placeholder="Major (AR)"
                      value={m.nameAr}
                      onChange={(e) =>
                        updateMajorRow(i, { nameAr: e.target.value })
                      }
                      dir="rtl"
                    />
                    <TextInput
                      aria-label="Program fee"
                      type="number"
                      placeholder="Fee"
                      value={m.fee}
                      onChange={(e) =>
                        updateMajorRow(i, { fee: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeMajorRow(i)}
                      className="p-2 rounded-lg"
                      style={{ color: C.orangeDark }}
                      aria-label="Remove program"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ICON_NAMES.map((name) => {
                      const RowIcon = resolveIcon(name);
                      const active = m.iconName === name;
                      return (
                        <button
                          type="button"
                          key={name}
                          onClick={() => updateMajorRow(i, { iconName: name })}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{
                            background: active ? grad.primary : "#fff",
                            border: `1px solid ${active ? "transparent" : C.border}`,
                          }}
                          aria-label={name}
                        >
                          <RowIcon
                            size={13}
                            color={active ? "#fff" : C.inkSoft}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {form.majors.length === 0 && (
              <p className="text-xs" style={{ color: C.muted }}>
                No programs yet.
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Required documents (English, one per line)"
            id="uni-docs-en"
          >
            <TextArea rows={4} value={form.docsEn} onChange={set("docsEn")} />
          </Field>
          <Field
            label="Required documents (Arabic, one per line)"
            id="uni-docs-ar"
          >
            <TextArea
              rows={4}
              value={form.docsAr}
              onChange={set("docsAr")}
              dir="rtl"
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Testimonials</Label>
            <button
              type="button"
              onClick={addTestimonialRow}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: C.blue }}
            >
              <Plus size={13} /> Add testimonial
            </button>
          </div>
          <div className="space-y-3">
            {form.testimonials.map((t, i) => (
              <div
                key={i}
                className="p-3 rounded-xl space-y-2"
                style={{ background: C.bgAlt }}
              >
                <div className="grid sm:grid-cols-[1fr,110px,auto] gap-2 items-center">
                  <TextInput
                    aria-label="Student name and country"
                    placeholder="Name, Country"
                    value={t.name}
                    onChange={(e) =>
                      updateTestimonialRow(i, { name: e.target.value })
                    }
                  />
                  <Select
                    aria-label="Rating out of 5"
                    value={t.rating}
                    onChange={(e) =>
                      updateTestimonialRow(i, { rating: e.target.value })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} star{r > 1 ? "s" : ""}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeTestimonialRow(i)}
                    className="p-2 rounded-lg"
                    style={{ color: C.orangeDark }}
                    aria-label="Remove testimonial"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <TextArea
                  aria-label="Testimonial quote in English"
                  rows={2}
                  placeholder="Quote (EN)"
                  value={t.textEn}
                  onChange={(e) =>
                    updateTestimonialRow(i, { textEn: e.target.value })
                  }
                />
                <TextArea
                  aria-label="Testimonial quote in Arabic"
                  rows={2}
                  placeholder="Quote (AR)"
                  value={t.textAr}
                  onChange={(e) =>
                    updateTestimonialRow(i, { textAr: e.target.value })
                  }
                  dir="rtl"
                />
              </div>
            ))}
            {form.testimonials.length === 0 && (
              <p className="text-xs" style={{ color: C.muted }}>
                No testimonials yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Contact information</Label>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Phone" id="uni-phone">
              <TextInput
                value={form.phone}
                onChange={set("phone")}
                placeholder="+90 500 000 00 00"
              />
            </Field>
            <Field label="Email" id="uni-email">
              <TextInput
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="admissions@example.edu"
              />
            </Field>
            <Field label="Website" id="uni-website">
              <TextInput
                value={form.website}
                onChange={set("website")}
                placeholder="https://example.edu"
              />
            </Field>
          </div>
        </div>

        <div>
          <Label>Social media links</Label>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Facebook" id="uni-social-fb">
              <TextInput
                value={form.facebook}
                onChange={set("facebook")}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="Instagram" id="uni-social-ig">
              <TextInput
                value={form.instagram}
                onChange={set("instagram")}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn" id="uni-social-li">
              <TextInput
                value={form.linkedin}
                onChange={set("linkedin")}
                placeholder="https://linkedin.com/..."
              />
            </Field>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle
            checked={form.featured}
            onChange={setValue("featured")}
            label="Featured university"
            sub="Shown first on public listings, with a Featured badge."
          />
          <Toggle
            checked={form.active}
            onChange={setValue("active")}
            label="Active"
            sub="Off hides this university from students entirely."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <GhostButton type="button" onClick={guardedClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">
            {uni ? "Save changes" : "Add university"}
          </PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}
