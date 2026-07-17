import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ListTree, BookOpen, HelpCircle, Type, Download, Upload, MessageCircle, Inbox, FileText, Search } from "lucide-react";
import { C, grad } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { PageHeader, StatTile, GhostButton, PrimaryButton, TextInput, Label } from "../ui";
import { useData } from "../useData";
import { useLanguage } from "../../context/useLanguage";
import { useToast } from "../useToast";
import { sanitizeDigitsOnly, validateBackupPayload } from "../security";

const SECTIONS = [
  { to: "/admin/universities", label: "Partner Universities", icon: Building2, desc: "Full detail pages: tuition, majors, scholarships, documents, reviews." },
  { to: "/admin/directory", label: "Directory", icon: ListTree, desc: "The full public directory of universities shown on /universities." },
  { to: "/admin/majors", label: "Majors", icon: BookOpen, desc: "The popular-majors grid on the homepage." },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, desc: "Frequently asked questions section." },
  { to: "/admin/content", label: "Site Copy", icon: Type, desc: "Every EN/AR string used across the site." },
  { to: "/admin/blog", label: "Blog", icon: FileText, desc: "Manage articles, news, and guides." },
  { to: "/admin/seo", label: "SEO", icon: Search, desc: "Manage page metadata, OpenGraph tags, and schema." },
  { to: "/admin/leads", label: "Leads", icon: Inbox, desc: "CRM pipeline for incoming consultations and applications." },
];

export default function AdminDashboard() {
  const { universities, directory, majors, faqs, settings, updateSettings, refresh } = useData();
  const { strings } = useLanguage();
  const showToast = useToast();
  const fileInputRef = useRef(null);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);

  const handleSaveWhatsapp = async () => {
    const digits = sanitizeDigitsOnly(whatsapp);
    setWhatsapp(digits);
    try {
      await updateSettings({ whatsapp: digits });
      showToast("WhatsApp number saved");
    } catch (err) {
      showToast(err.message || "Unable to save WhatsApp number", "error");
    }
  };

  const handleExport = async () => {
    try {
      const payload = await apiFetch("/api/cms/snapshot/export");
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wayeducation-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Backup exported");
    } catch (err) {
      showToast("Export failed: " + err.message, "error");
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!window.confirm("Importing will replace all live backend data with the backup file. Continue?")) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const raw = JSON.parse(String(reader.result));
        const validated = validateBackupPayload(raw);
        if (!validated.ok) {
          showToast(`Import failed — ${validated.error}`, "error");
          return;
        }

        await apiFetch("/api/cms/snapshot/import", {
          method: "POST",
          body: JSON.stringify({ snapshot: validated.value }),
        });

        await refresh();
        setWhatsapp(validated.value.settings?.whatsapp ?? "");
        showToast("Backup imported successfully");
      } catch (err) {
        showToast(`Import failed — ${err.message || "Unknown error"}`, "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader title="Dashboard" sub="Manage everything shown on Way Education — changes persist through the backend API." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile icon={Building2} label="Partner Universities" value={universities.length} />
        <StatTile icon={ListTree} label="Directory Entries" value={directory.length} />
        <StatTile icon={BookOpen} label="Majors" value={majors.length} />
        <StatTile icon={HelpCircle} label="FAQs" value={faqs.length} />
      </div>

      <GlassCard className="p-5 mb-8" style={{ background: "#fff" }}>
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={16} color="#25D366" />
          <div className="font-semibold text-sm" style={{ color: C.ink }}>WhatsApp Number</div>
        </div>
        <div className="text-xs mb-4 max-w-md" style={{ color: C.muted }}>
          Controls the floating WhatsApp button and every "Chat on WhatsApp" link across the site.
        </div>
        <div className="flex flex-wrap items-end gap-3 max-w-md">
          <div className="flex-1 min-w-[180px]">
            <Label>Number (country code + number, digits only)</Label>
            <TextInput value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="905000000000" />
          </div>
          <PrimaryButton onClick={handleSaveWhatsapp}>Save</PrimaryButton>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-8 flex flex-wrap items-center justify-between gap-4" style={{ background: "#fff" }}>
        <div>
          <div className="font-semibold text-sm mb-1" style={{ color: C.ink }}>Backup & Restore</div>
          <div className="text-xs max-w-md" style={{ color: C.muted }}>
            Export the current CMS snapshot for safekeeping or migration. Import will replace the live backend content with the snapshot.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <GhostButton onClick={handleExport} className="flex items-center gap-1.5">
            <Download size={14} /> Export
          </GhostButton>
          <PrimaryButton onClick={handleImportClick} className="flex items-center gap-1.5">
            <Upload size={14} /> Import
          </PrimaryButton>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="p-5 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
            style={{ border: `1px solid ${C.border}` }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: grad.primarySoft }}>
              <s.icon size={20} color={C.blue} />
            </div>
            <div className="font-semibold text-sm mb-1" style={{ color: C.ink }}>{s.label}</div>
            <div className="text-xs" style={{ color: C.muted }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
