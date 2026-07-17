import React, { useEffect, useMemo, useState } from "react";
import { Download, MessageSquarePlus, Search } from "lucide-react";
import { C } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { PageHeader, PrimaryButton, GhostButton } from "../ui";
import { useToast } from "../useToast";
import { apiFetch, getApiBase } from "../../lib/api";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "INTERESTED", "DOCUMENTS_PENDING", "APPLIED", "ACCEPTED", "REJECTED", "ARCHIVED"];

export default function AdminLeads() {
  const showToast = useToast();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (query) params.set("search", query);
      if (status) params.set("status", status);
      const [list, summary] = await Promise.all([
        apiFetch(`/api/leads?${params.toString()}`),
        apiFetch("/api/leads/stats/summary"),
      ]);
      setItems(list.items || []);
      setTotal(list.total || 0);
      setStats(summary || {});
    } catch (err) {
      showToast(err.message || "Unable to load leads", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const updated = await apiFetch(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      showToast("Lead status updated");
      load();
    } catch (err) {
      showToast(err.message || "Unable to update lead", "error");
    }
  };

  const handleAddNote = async (id) => {
    const note = window.prompt("Add timeline note");
    if (!note) return;
    try {
      await apiFetch(`/api/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ note }) });
      showToast("Note added");
      load();
    } catch (err) {
      showToast(err.message || "Unable to add note", "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        sub="Track incoming applications, update statuses, and export the sales pipeline."
        action={
          <a href={`${getApiBase()}/api/leads/export/csv`} className="inline-flex">
            <PrimaryButton className="flex items-center gap-1.5">
              <Download size={14} /> Export CSV
            </PrimaryButton>
          </a>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATUS_OPTIONS.slice(0, 4).map((key) => (
          <GlassCard key={key} className="p-4" style={{ background: "#fff" }}>
            <div className="text-xs mb-1" style={{ color: C.muted }}>{key.replace(/_/g, " ")}</div>
            <div className="text-2xl font-bold" style={{ color: C.ink }}>{stats[key] || 0}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-4 mb-6" style={{ background: "#fff" }}>
        <div className="grid sm:grid-cols-[1fr,220px,auto] gap-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <Search size={16} color={C.muted} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone or email…" className="flex-1 outline-none text-sm bg-transparent" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl text-sm bg-white outline-none" style={{ border: `1px solid ${C.border}` }}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item.replace(/_/g, " ")}</option>)}
          </select>
          <GhostButton onClick={() => { setPage(1); load(); }}>Search</GhostButton>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden" style={{ background: "#fff" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  "Lead",
                  "Program",
                  "Preferred University",
                  "Status",
                  "Created",
                  "",
                ].map((header) => (
                  <th key={header} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.muted }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3 min-w-[220px]">
                    <div className="font-semibold" style={{ color: C.ink }}>{lead.name}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{lead.email}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: C.inkSoft }}>{lead.program || "-"}</td>
                  <td className="px-4 py-3" style={{ color: C.inkSoft }}>{lead.preferredUniversity || "-"}</td>
                  <td className="px-4 py-3">
                    <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value)} className="px-2 py-2 rounded-lg text-xs bg-white outline-none" style={{ border: `1px solid ${C.border}` }}>
                      {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item.replace(/_/g, " ")}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.muted }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleAddNote(lead.id)} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: C.blue }}>
                      <MessageSquarePlus size={13} /> Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between mt-6">
        <div className="text-xs" style={{ color: C.muted }}>{loading ? "Loading leads…" : `Showing ${items.length} of ${total}`}</div>
        <div className="flex items-center gap-2">
          <GhostButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>Prev</GhostButton>
          <span className="text-sm" style={{ color: C.ink }}>{page} / {pages}</span>
          <GhostButton onClick={() => setPage((prev) => Math.min(pages, prev + 1))} disabled={page === pages}>Next</GhostButton>
        </div>
      </div>
    </div>
  );
}
