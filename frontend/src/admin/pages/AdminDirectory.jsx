import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, ArrowUpCircle } from "lucide-react";
import { useData } from "../useData";
import { useToast } from "../useToast";
import {
  PageHeader,
  Field,
  TextInput,
  Select,
  PrimaryButton,
  GhostButton,
  AdminModal,
} from "../ui";
import UniversityFormModal from "../UniversityFormModal";

const COUNTRY_OPTIONS = ["Türkiye", "N. Cyprus"];
const TYPE_OPTIONS = ["Public", "Private"];
const PAGE_SIZE = 40;

function initFromEntry(entry) {
  if (entry)
    return {
      name: entry.name,
      city: entry.city,
      country: entry.country,
      type: entry.type,
      founded: entry.founded,
    };
  return {
    name: "",
    city: "",
    country: "Türkiye",
    type: "Private",
    founded: String(new Date().getFullYear()),
  };
}

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
  const { addDirectoryEntry, updateDirectoryEntry } = useData();
  const showToast = useToast();
  const baseline = initFromEntry(entry);
  const [form, setForm] = useState(() => baseline);
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const guardedClose = () => {
    if (
      dirty &&
      !window.confirm("Discard unsaved changes? Your edits will be lost.")
    )
      return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (entry) {
        await updateDirectoryEntry(entry.id, form);
        showToast(`Saved changes to ${form.name}`);
      } else {
        await addDirectoryEntry(form);
        showToast(`${form.name} added to directory`);
      }
      onClose();
    } catch (err) {
      showToast(err.message || "Unable to save directory entry", "error");
    }
  };

  return (
    <AdminModal
      title={entry ? `Edit ${entry.name}` : "Add Directory Entry"}
      onClose={guardedClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-body">
        <Field label="Name" id="directory-name">
          <TextInput required value={form.name} onChange={set("name")} />
        </Field>
        <Field label="City" id="directory-city">
          <TextInput required value={form.city} onChange={set("city")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Country" id="directory-country">
            <Select value={form.country} onChange={set("country")}>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type" id="directory-type">
            <Select value={form.type} onChange={set("type")}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Founded year" id="directory-founded">
          <TextInput value={form.founded} onChange={set("founded")} />
        </Field>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e0e0]">
          <GhostButton type="button" onClick={guardedClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">
            {entry ? "Save changes" : "Add entry"}
          </PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminDirectory() {
  const { directory, removeDirectoryEntry } = useData();
  const showToast = useToast();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [editing, setEditing] = useState(undefined);
  const [promoting, setPromoting] = useState(null);

  const filtered = useMemo(
    () =>
      directory.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      ),
    [directory, query]
  );
  const shown = filtered.slice(0, visible);

  return (
    <div className="font-body">
      <PageHeader
        title="Directory"
        sub={`${directory.length} education institutions in the public master directory.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus className="w-4 h-4 mr-1" /> Add Entry
          </PrimaryButton>
        }
      />

      <div className="mb-6 flex items-center bg-[#f4f4f4] border border-[#e0e0e0] px-4 py-2 text-sm">
        <Search className="w-4 h-4 text-[#6f6f6f] mr-3 shrink-0" />
        <input
          id="directory-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Search institution by name…"
          aria-label="Search directory"
          className="w-full bg-transparent border-none outline-none font-body text-[#161616]"
        />
      </div>

      <div className="bg-white border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-[#f4f4f4] text-[11px] uppercase tracking-wider text-[#6f6f6f] font-headline border-b border-[#e0e0e0]">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">City</th>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Founded</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body">
              {shown.map((d) => (
                <tr key={d.id} className="border-b border-[#e0e0e0] last:border-0">
                  <td className="p-4 font-semibold text-[#161616]">{d.name}</td>
                  <td className="p-4 text-[#525252]">{d.city}</td>
                  <td className="p-4 text-[#525252]">{d.country}</td>
                  <td className="p-4 text-[#525252]">{d.type}</td>
                  <td className="p-4 text-[#525252]">{d.founded}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setPromoting(d)}
                        className="p-1 text-[#0f62fe] hover:bg-[#f4f4f4] transition-colors"
                        title="Promote to partner university"
                        aria-label={`Promote ${d.name} to partner university`}
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditing(d)}
                        className="p-1 text-[#0f62fe] hover:bg-[#f4f4f4] transition-colors"
                        aria-label={`Edit ${d.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Remove ${d.name}?`)) {
                            try {
                              await removeDirectoryEntry(d.id);
                              showToast(`${d.name} removed`);
                            } catch (err) {
                              showToast(
                                err.message || `Unable to remove ${d.name}`,
                                "error"
                              );
                            }
                          }
                        }}
                        className="p-1 text-[#da1e28] hover:bg-[#fff1f1] transition-colors"
                        aria-label={`Remove ${d.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-[#6f6f6f] mb-4">
          Showing {shown.length} of {filtered.length} entries
        </p>
        {visible < filtered.length && (
          <PrimaryButton
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mx-auto"
          >
            Load More Entries
          </PrimaryButton>
        )}
      </div>

      {editing !== undefined && (
        <DirectoryFormModal
          entry={editing}
          onClose={() => setEditing(undefined)}
        />
      )}

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
