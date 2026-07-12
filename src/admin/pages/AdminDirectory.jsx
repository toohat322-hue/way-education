import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, ArrowUpCircle } from "lucide-react";
import { C, grad } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { useData } from "../useData";
import { useToast } from "../useToast";
import { uniqueSlugId } from "../slugify";
import { PageHeader, Field, TextInput, Select, PrimaryButton, GhostButton, AdminModal } from "../ui";
import UniversityFormModal from "../UniversityFormModal";

const COUNTRY_OPTIONS = ["Türkiye", "N. Cyprus"];
const TYPE_OPTIONS = ["Public", "Private"];
const PAGE_SIZE = 40;

function initFromEntry(entry) {
  if (entry) return { name: entry.name, city: entry.city, country: entry.country, type: entry.type, founded: entry.founded };
  return { name: "", city: "", country: "Türkiye", type: "Private", founded: String(new Date().getFullYear()) };
}

// Maps a directory-only entry onto the partner-university form's blank-form
// shape, prefilling what we already know. Mirrors the manual workflow the
// README describes: "move that entry from directory.js into universities.js".
function directoryToPartnerInitial(entry) {
  return {
    name: entry.name,
    cityEn: entry.city,
    cityAr: entry.city,
    countryEn: entry.country,
    typeEn: entry.type,
    founded: entry.founded,
  };
}

function DirectoryFormModal({ entry, onClose }) {
  const { directory, addDirectoryEntry, updateDirectoryEntry } = useData();
  const showToast = useToast();
  const baseline = initFromEntry(entry);
  const [form, setForm] = useState(() => baseline);
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const guardedClose = () => {
    if (dirty && !window.confirm("Discard unsaved changes? Your edits will be lost.")) return;
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entry) {
      updateDirectoryEntry(entry.id, form);
      showToast(`Saved changes to ${form.name}`);
    } else {
      const id = uniqueSlugId(form.name, directory.map((d) => d.id), "dir-");
      addDirectoryEntry({ id, ...form });
      showToast(`${form.name} added to directory`);
    }
    onClose();
  };

  return (
    <AdminModal title={entry ? `Edit ${entry.name}` : "Add Directory Entry"} onClose={guardedClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name"><TextInput required value={form.name} onChange={set("name")} /></Field>
        <Field label="City"><TextInput required value={form.city} onChange={set("city")} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Country">
            <Select value={form.country} onChange={set("country")}>
              {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={set("type")}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Founded year"><TextInput value={form.founded} onChange={set("founded")} /></Field>
        <div className="flex items-center justify-end gap-3 pt-2">
          <GhostButton type="button" onClick={guardedClose}>Cancel</GhostButton>
          <PrimaryButton type="submit">{entry ? "Save changes" : "Add entry"}</PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminDirectory() {
  const { directory, removeDirectoryEntry, resetDirectory } = useData();
  const showToast = useToast();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [editing, setEditing] = useState(undefined);
  const [promoting, setPromoting] = useState(null);

  const filtered = useMemo(
    () => directory.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
    [directory, query]
  );
  const shown = filtered.slice(0, visible);

  return (
    <div>
      <PageHeader
        title="Directory"
        sub={`${directory.length} universities in the public directory.`}
        action={
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => { if (window.confirm("Reset the directory to its original entries? This discards your edits.")) { resetDirectory(); showToast("Directory reset to defaults"); } }}>
              Reset
            </GhostButton>
            <PrimaryButton onClick={() => setEditing(null)}>
              <Plus size={15} className="inline -mt-0.5 me-1" /> Add entry
            </PrimaryButton>
          </div>
        }
      />

      <GlassCard className="p-1 mb-6 flex items-center gap-2 px-4" style={{ background: "#fff" }}>
        <Search size={16} color={C.muted} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
          placeholder="Search by name…"
          className="flex-1 outline-none text-sm bg-transparent py-2.5"
        />
      </GlassCard>

      <GlassCard className="overflow-hidden" style={{ background: "#fff" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Name", "City", "Country", "Type", "Founded", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: C.muted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3 font-medium" style={{ color: C.ink }}>{d.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.inkSoft }}>{d.city}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.inkSoft }}>{d.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.inkSoft }}>{d.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: C.inkSoft }}>{d.founded}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setPromoting(d)}
                        className="p-1.5 rounded-lg"
                        style={{ color: C.blue }}
                        aria-label={`Promote ${d.name} to partner university`}
                        title="Promote to partner university"
                      >
                        <ArrowUpCircle size={14} />
                      </button>
                      <button onClick={() => setEditing(d)} className="p-1.5 rounded-lg" style={{ color: C.blue }} aria-label={`Edit ${d.name}`}>
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => { if (window.confirm(`Remove ${d.name}?`)) { removeDirectoryEntry(d.id); showToast(`${d.name} removed`); } }}
                        className="p-1.5 rounded-lg"
                        style={{ color: C.orangeDark }}
                        aria-label={`Remove ${d.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="text-center mt-6">
        <p className="text-xs mb-4" style={{ color: C.muted }}>Showing {shown.length} of {filtered.length}</p>
        {visible < filtered.length && (
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ background: grad.primary }}
          >
            Load more
          </button>
        )}
      </div>

      {editing !== undefined && <DirectoryFormModal entry={editing} onClose={() => setEditing(undefined)} />}

      {promoting && (
        <UniversityFormModal
          initial={directoryToPartnerInitial(promoting)}
          onSaved={() => {
            removeDirectoryEntry(promoting.id);
            showToast(`${promoting.name} promoted to Partner Universities`);
          }}
          onClose={() => setPromoting(null)}
        />
      )}
    </div>
  );
}
