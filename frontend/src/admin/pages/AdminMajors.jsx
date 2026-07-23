import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "../useData";
import { useToast } from "../useToast";
import { resolveIcon, ICON_NAMES } from "../iconRegistry";
import {
  PageHeader,
  Field,
  Label,
  TextInput,
  PrimaryButton,
  GhostButton,
  DangerButton,
  AdminModal,
} from "../ui";

function initFromMajor(major) {
  if (major) {
    return {
      nameEn: major.name.en,
      nameAr: major.name.ar,
      count: major.count,
      iconName: major.iconName || "GraduationCap",
    };
  }
  return { nameEn: "", nameAr: "", count: 10, iconName: "GraduationCap" };
}

function MajorFormModal({ major, onClose }) {
  const { addMajor, updateMajor } = useData();
  const showToast = useToast();
  const baseline = initFromMajor(major);
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
    const payload = {
      name: { en: form.nameEn, ar: form.nameAr },
      count: Number(form.count) || 0,
      iconName: form.iconName,
    };
    try {
      if (major) {
        await updateMajor(major.id, payload);
        showToast(`Saved changes to ${payload.name.en}`);
      } else {
        await addMajor(payload);
        showToast(`${payload.name.en} added`);
      }
      onClose();
    } catch (err) {
      showToast(err.message || "Unable to save major", "error");
    }
  };

  return (
    <AdminModal
      title={major ? "Edit Major" : "Add Major"}
      onClose={guardedClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-body">
        <Field label="Name (English)" id="major-name-en">
          <TextInput required value={form.nameEn} onChange={set("nameEn")} />
        </Field>
        <Field label="Name (Arabic)" id="major-name-ar">
          <TextInput
            required
            value={form.nameAr}
            onChange={set("nameAr")}
            dir="rtl"
          />
        </Field>
        <Field label="Program count" id="major-program-count">
          <TextInput type="number" value={form.count} onChange={set("count")} />
        </Field>
        <div>
          <Label>Icon Symbol</Label>
          <div className="flex flex-wrap gap-2">
            {ICON_NAMES.map((name) => {
              const Icon = resolveIcon(name);
              const active = form.iconName === name;
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => setForm((f) => ({ ...f, iconName: name }))}
                  className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                    active
                      ? "bg-[#0f62fe] text-white border-[#0f62fe]"
                      : "bg-white text-[#525252] border-[#e0e0e0] hover:bg-[#f4f4f4]"
                  }`}
                  aria-label={name}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e0e0]">
          <GhostButton type="button" onClick={guardedClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">
            {major ? "Save changes" : "Add major"}
          </PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminMajors() {
  const { majors, removeMajor } = useData();
  const showToast = useToast();
  const [editing, setEditing] = useState(undefined);

  return (
    <div className="font-body">
      <PageHeader
        title="Degree Portfolios & Majors"
        sub={`${majors.length} academic pathways featured on the homepage.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus className="w-4 h-4 mr-1" /> Add Major
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {majors.map((m) => {
          const Icon = resolveIcon(m.iconName);
          return (
            <div
              key={m.id}
              className="bg-white border border-[#e0e0e0] p-5 flex flex-col justify-between hover:border-[#0f62fe] transition-colors"
            >
              <div>
                <div className="w-10 h-10 bg-[#f4f4f4] border border-[#e0e0e0] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#0f62fe]" />
                </div>
                <h3 className="font-headline font-semibold text-sm text-[#161616] mb-1">
                  {m.name.en}
                </h3>
                <p className="text-xs text-[#6f6f6f] mb-4">
                  {m.count} programs available
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#e0e0e0]">
                <GhostButton
                  onClick={() => setEditing(m)}
                  className="flex-1"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </GhostButton>
                <DangerButton
                  aria-label={`Delete ${m.name.en}`}
                  onClick={async () => {
                    if (window.confirm(`Remove ${m.name.en}?`)) {
                      try {
                        await removeMajor(m.id);
                        showToast(`${m.name.en} removed`);
                      } catch (err) {
                        showToast(
                          err.message || `Unable to remove ${m.name.en}`,
                          "error"
                        );
                      }
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </DangerButton>
              </div>
            </div>
          );
        })}
      </div>

      {editing !== undefined && (
        <MajorFormModal major={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
