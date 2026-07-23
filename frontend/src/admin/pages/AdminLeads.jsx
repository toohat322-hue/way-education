import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, MessageSquarePlus, Search } from "lucide-react";
import { PageHeader, PrimaryButton, GhostButton } from "../ui";
import { useToast } from "../useToast";
import { apiFetch, getApiBase } from "../../lib/api";

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "DOCUMENTS_PENDING",
  "APPLIED",
  "ACCEPTED",
  "REJECTED",
  "ARCHIVED",
];

export default function AdminLeads() {
  const showToast = useToast();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (appliedQuery) params.set("search", appliedQuery);
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
  }, [appliedQuery, page, pageSize, status, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total]
  );

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const updated = await apiFetch(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
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
      await apiFetch(`/api/leads/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note }),
      });
      showToast("Note added");
      load();
    } catch (err) {
      showToast(err.message || "Unable to add note", "error");
    }
  };

  return (
    <div className="font-body">
      <PageHeader
        title="Prospect Pipeline & Leads"
        sub="Track incoming student applications, update CRM pipeline statuses, and export CSV reports."
        action={
          <a
            href={`${getApiBase()}/api/leads/export/csv`}
            className="inline-flex"
          >
            <PrimaryButton>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </PrimaryButton>
          </a>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0] mb-6">
        {STATUS_OPTIONS.slice(0, 4).map((key) => (
          <div key={key} className="bg-white p-4">
            <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
              {key.replace(/_/g, " ")}
            </span>
            <div className="text-24px font-semibold text-[#0f62fe] font-headline mt-2">
              {stats[key] || 0}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e0e0e0] p-4 mb-6">
        <div className="grid sm:grid-cols-[1fr,220px,auto] gap-3">
          <div className="flex items-center bg-[#f4f4f4] border border-[#e0e0e0] px-3 py-2 text-sm">
            <Search className="w-4 h-4 text-[#6f6f6f] mr-2 shrink-0" />
            <input
              id="lead-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone or email…"
              aria-label="Search leads"
              className="w-full bg-transparent border-none outline-none font-body text-[#161616]"
            />
          </div>
          <select
            id="lead-status-filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="carbon-input px-3 py-2 text-sm"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <GhostButton
            onClick={() => {
              setPage(1);
              setAppliedQuery(query.trim());
            }}
          >
            Search Leads
          </GhostButton>
        </div>
      </div>

      <div className="bg-white border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-[#f4f4f4] text-[11px] uppercase tracking-wider text-[#6f6f6f] font-headline border-b border-[#e0e0e0]">
                <th className="p-4 font-medium">Lead Identity</th>
                <th className="p-4 font-medium">Program</th>
                <th className="p-4 font-medium">Preferred Institution</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Acquisition</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-[#6f6f6f]">
                    Loading leads data...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-[#6f6f6f]">
                    No matching leads found.
                  </td>
                </tr>
              ) : (
                items.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#e0e0e0] last:border-0">
                    <td className="p-4 min-w-[200px]">
                      <div className="font-semibold text-[#161616]">{lead.name}</div>
                      <div className="text-xs text-[#6f6f6f]">{lead.email}</div>
                      <div className="text-xs text-[#6f6f6f]">{lead.phone}</div>
                    </td>
                    <td className="p-4 text-[#525252]">{lead.program || "-"}</td>
                    <td className="p-4 text-[#525252]">{lead.preferredUniversity || "-"}</td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className="carbon-input px-2 py-1 text-xs border border-[#e0e0e0] focus:border-[#0f62fe]"
                        aria-label={`Status for ${lead.name}`}
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <option key={item} value={item}>
                            {item.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-xs text-[#6f6f6f] whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleAddNote(lead.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f62fe] hover:underline"
                        aria-label={`Add note for ${lead.name}`}
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" /> Note
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-xs text-[#6f6f6f]">
          {loading ? "Loading leads…" : `Showing ${items.length} of ${total} leads`}
        </div>
        <div className="flex items-center gap-2">
          <GhostButton
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </GhostButton>
          <span className="text-xs font-semibold text-[#161616] px-2">
            Page {page} of {pages}
          </span>
          <GhostButton
            onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
            disabled={page === pages}
          >
            Next
          </GhostButton>
        </div>
      </div>
    </div>
  );
}
