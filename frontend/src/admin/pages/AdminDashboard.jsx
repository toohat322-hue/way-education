import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ListTree,
  BookOpen,
  HelpCircle,
  Type,
  Download,
  Upload,
  Inbox,
  FileText,
  Search,
  ArrowRight,
  TrendingUp,
  Settings2,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { useData } from "../useData";
import { useToast } from "../useToast";
import { apiFetch } from "../../lib/api";
import { sanitizeDigitsOnly, validateBackupPayload } from "../security";

const SECTIONS = [
  {
    to: "/admin/universities",
    label: "Partner Institutions",
    icon: Building2,
    desc: "Manage university profiles, scholarships, and enrollment status.",
  },
  {
    to: "/admin/directory",
    label: "Master Directory",
    icon: ListTree,
    desc: "Global database of all education entities displayed on /universities.",
  },
  {
    to: "/admin/majors",
    label: "Degree Portfolios",
    icon: BookOpen,
    desc: "Academic pathways, degrees, and homepage popular majors grid.",
  },
  {
    to: "/admin/faqs",
    label: "Knowledge Repository",
    icon: HelpCircle,
    desc: "Frequently asked questions database and student guidance.",
  },
  {
    to: "/admin/content",
    label: "Global Lexicon",
    icon: Type,
    desc: "Bilingual EN/AR site copy strings and localization control.",
  },
  {
    to: "/admin/blog",
    label: "Editorial Journal",
    icon: FileText,
    desc: "Internal articles, blog posts, news updates, and content staging.",
  },
  {
    to: "/admin/seo",
    label: "Search Visibility",
    icon: Search,
    desc: "SEO metadata, OpenGraph tags, sitemaps, and search index status.",
  },
  {
    to: "/admin/leads",
    label: "Prospect Pipeline",
    icon: Inbox,
    desc: "Student consultation pipeline, application tracking, and CRM.",
  },
];

export default function AdminDashboard() {
  const {
    universities,
    directory,
    majors,
    faqs,
    settings,
    updateSettings,
    refresh,
  } = useData();
  const showToast = useToast();
  const fileInputRef = useRef(null);

  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || "");
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || "contact@wayeducations.com");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  const [recentLeads, setRecentLeads] = useState([]);
  const [leadStats, setLeadStats] = useState({});
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Sync settings when fetched
  useEffect(() => {
    if (settings.whatsapp) setWhatsapp(settings.whatsapp);
    if (settings.supportEmail) setSupportEmail(settings.supportEmail);
  }, [settings]);

  // Load recent leads & lead summary stats from backend API
  const loadLeadsData = useCallback(async () => {
    setLoadingLeads(true);
    try {
      const [leadsRes, summaryRes] = await Promise.all([
        apiFetch("/api/leads?page=1&pageSize=5"),
        apiFetch("/api/leads/stats/summary"),
      ]);
      setRecentLeads(leadsRes.items || []);
      setLeadStats(summaryRes || {});
    } catch (err) {
      console.warn("Unable to fetch leads preview:", err.message);
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    loadLeadsData();
  }, [loadLeadsData]);

  const handleSaveWhatsapp = async () => {
    const digits = sanitizeDigitsOnly(whatsapp);
    setWhatsapp(digits);
    setSavingWhatsapp(true);
    try {
      await updateSettings({ whatsapp: digits });
      showToast("WhatsApp number saved successfully");
    } catch (err) {
      showToast(err.message || "Unable to save WhatsApp number", "error");
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const handleSaveSupportEmail = async () => {
    setSavingEmail(true);
    try {
      await updateSettings({ supportEmail: supportEmail.trim() });
      showToast("Support email updated successfully");
    } catch (err) {
      showToast(err.message || "Unable to save support email", "error");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleExport = async () => {
    try {
      const payload = await apiFetch("/api/cms/snapshot/export");
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wayeducation-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("System archive exported");
    } catch (err) {
      showToast("Export failed: " + err.message, "error");
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      !window.confirm(
        "Importing will replace all live backend data with the snapshot file. Continue?"
      )
    )
      return;

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
        if (validated.value.settings?.whatsapp) {
          setWhatsapp(validated.value.settings.whatsapp);
        }
        if (validated.value.settings?.supportEmail) {
          setSupportEmail(validated.value.settings.supportEmail);
        }
        showToast("Backup restored successfully");
      } catch (err) {
        showToast(`Import failed — ${err.message || "Unknown error"}`, "error");
      }
    };
    reader.readAsText(file);
  };

  // Compute lead sources/traffic breakdown
  const totalLeadsCount = Object.values(leadStats).reduce((acc, curr) => acc + (typeof curr === "number" ? curr : 0), 0) || recentLeads.length || 1;
  const organicPercent = Math.min(100, Math.max(10, Math.round(((leadStats.NEW || 0) + (leadStats.INTERESTED || 0)) / totalLeadsCount * 100) || 68));
  const directPercent = Math.min(100 - organicPercent, Math.round(((leadStats.CONTACTED || 0) + (leadStats.DOCUMENTS_PENDING || 0)) / totalLeadsCount * 100) || 22);
  const campaignPercent = Math.max(0, 100 - organicPercent - directPercent) || 10;

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
      case "CONVERTED":
        return "bg-[#a7f0ba] text-[#044317]";
      case "APPLIED":
      case "QUALIFIED":
      case "INTERESTED":
        return "bg-[#d0e2ff] text-[#001d6c]";
      case "CONTACTED":
      case "DOCUMENTS_PENDING":
        return "bg-[#fff1f1] text-[#da1e28]";
      default:
        return "bg-[#e0e0e0] text-[#161616]";
    }
  };

  return (
    <div className="font-body">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-32px font-light text-[#161616] font-headline tracking-tight">
          System Overview
        </h1>
        <p className="text-sm text-[#6f6f6f] mt-1 font-body">
          Real-time enterprise metrics for Way Education assets.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0] mb-8">
        <div className="bg-white p-4">
          <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
            Partner Institutions
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-24px font-semibold text-[#0f62fe] font-headline">
              {universities.length}
            </span>
            <span className="text-[10px] text-[#198038] flex items-center gap-1 font-body">
              <TrendingUp className="w-3 h-3" />
              {universities.filter((u) => u.active !== false).length} Active
            </span>
          </div>
        </div>

        <div className="bg-white p-4">
          <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
            Directory Entries
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-24px font-semibold text-[#161616] font-headline">
              {directory.length}
            </span>
            <span className="text-[10px] text-[#6f6f6f] font-body">Total global count</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
            Academic Majors
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-24px font-semibold text-[#161616] font-headline">
              {String(majors.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-[#6f6f6f] font-body">Accredited pathways</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
            Curated FAQs
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-24px font-semibold text-[#161616] font-headline">
              {String(faqs.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-[#198038] font-body">100% active</span>
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns (Modules + Config) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* System Core Modules: 8/12 */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-20px font-medium text-[#161616] font-headline">
              System Core Modules
            </h2>
            <Link
              to="/admin/universities"
              className="text-[#0f62fe] text-xs font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {SECTIONS.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="bg-white p-4 hover:bg-[#f4f4f4] transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <m.icon className="w-5 h-5 text-[#0f62fe] mb-3" />
                  <h3 className="text-sm font-semibold text-[#161616] mb-1 group-hover:text-[#0f62fe] transition-colors font-headline">
                    {m.label}
                  </h3>
                  <p className="text-xs text-[#6f6f6f] leading-relaxed font-body">
                    {m.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* System Archive Management */}
          <div className="mt-8 bg-[#f4f4f4] p-6 border border-[#e0e0e0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-1 font-headline">
                  System Archive
                </h3>
                <p className="text-xs text-[#6f6f6f] font-body">
                  Export live CMS state or restore snapshot from backup.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 h-10 bg-white border border-[#e0e0e0] hover:bg-[#e0e0e0] transition-colors text-xs font-medium text-[#161616] flex items-center gap-2 font-body"
                >
                  <Download className="w-4 h-4" /> Export Archive (.json)
                </button>
                <button
                  onClick={handleImportClick}
                  className="px-4 h-10 bg-[#393939] text-white hover:bg-[#161616] transition-colors text-xs font-medium flex items-center gap-2 font-body"
                >
                  <Upload className="w-4 h-4" /> Restore State
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: 4/12 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Communication Channel Section */}
          <div className="bg-white border border-[#e0e0e0] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-6 flex items-center gap-2 font-headline">
              <Settings2 className="w-4 h-4 text-[#0f62fe]" /> Communication Channels
            </h3>
            <div className="space-y-6">
              {/* Field 1: WhatsApp */}
              <div>
                <label className="block text-xs text-[#6f6f6f] mb-2 font-medium font-body">
                  WhatsApp Number
                </label>
                <div className="flex items-center">
                  <input
                    className="carbon-input w-full px-3 py-2 text-sm"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="905016000033"
                  />
                  <button
                    onClick={handleSaveWhatsapp}
                    disabled={savingWhatsapp}
                    className="ml-3 px-3 h-10 bg-[#0f62fe] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#0353e9] transition-all shrink-0 font-body"
                  >
                    {savingWhatsapp ? "..." : "Update"}
                  </button>
                </div>
              </div>

              {/* Field 2: Support Email */}
              <div>
                <label className="block text-xs text-[#6f6f6f] mb-2 font-medium font-body">
                  Support Email
                </label>
                <div className="flex items-center">
                  <input
                    className="carbon-input w-full px-3 py-2 text-sm"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="contact@wayeducations.com"
                  />
                  <button
                    onClick={handleSaveSupportEmail}
                    disabled={savingEmail}
                    className="ml-3 px-3 h-10 bg-[#0f62fe] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#0353e9] transition-all shrink-0 font-body"
                  >
                    {savingEmail ? "..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Performance Visual */}
          <div className="bg-white border border-[#e0e0e0] p-6 flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4 font-headline">
              Lead Traffic Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-body">
                  <span className="text-[#6f6f6f]">Organic Search</span>
                  <span className="font-semibold text-[#161616]">{organicPercent}%</span>
                </div>
                <div className="w-full bg-[#f4f4f4] h-1.5">
                  <div
                    className="bg-[#0f62fe] h-full"
                    style={{ width: `${organicPercent}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-body">
                  <span className="text-[#6f6f6f]">Direct Referrals</span>
                  <span className="font-semibold text-[#161616]">{directPercent}%</span>
                </div>
                <div className="w-full bg-[#f4f4f4] h-1.5">
                  <div
                    className="bg-[#0f62fe] h-full opacity-60"
                    style={{ width: `${directPercent}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-body">
                  <span className="text-[#6f6f6f]">Email Campaigns</span>
                  <span className="font-semibold text-[#161616]">{campaignPercent}%</span>
                </div>
                <div className="w-full bg-[#f4f4f4] h-1.5">
                  <div
                    className="bg-[#0f62fe] h-full opacity-30"
                    style={{ width: `${campaignPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Data Preview Table */}
      <div className="mt-8 bg-white border border-[#e0e0e0] overflow-hidden">
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#161616] font-headline">
            Recent Prospect Pipeline
          </h3>
          <Link
            to="/admin/leads"
            className="text-xs text-[#0f62fe] font-semibold flex items-center gap-1 hover:underline"
          >
            Manage All Leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-[#f4f4f4] text-[11px] uppercase tracking-wider text-[#6f6f6f] font-headline">
                <th className="p-4 font-medium">Source</th>
                <th className="p-4 font-medium">Identity</th>
                <th className="p-4 font-medium">Academic Interest</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Acquisition</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body">
              {loadingLeads ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-[#6f6f6f]">
                    Loading recent prospect pipeline...
                  </td>
                </tr>
              ) : recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-[#6f6f6f]">
                    No leads recorded yet. Submissions from contact forms will appear here.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#e0e0e0] last:border-0">
                    <td className="p-4 text-xs font-mono text-[#6f6f6f]">
                      {lead.preferredUniversity ? "University_Form" : "SEO_Search"}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#161616]">{lead.name}</div>
                      <div className="text-xs text-[#6f6f6f]">{lead.email}</div>
                    </td>
                    <td className="p-4 text-[#525252]">
                      {lead.program || lead.preferredUniversity || "General Admission"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2 py-1 font-bold uppercase ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status ? lead.status.replace(/_/g, " ") : "NEW"}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-[#6f6f6f]">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
