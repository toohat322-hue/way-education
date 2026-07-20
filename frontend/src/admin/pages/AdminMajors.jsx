import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { C, grad } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {ICON_NAMES.map((name) => {
              const Icon = resolveIcon(name);
              const active = form.iconName === name;
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => setForm((f) => ({ ...f, iconName: name }))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: active ? grad.primary : "#fff",
                    border: `1px solid ${active ? "transparent" : C.border}`,
                  }}
                  aria-label={name}
                >
                  <Icon size={16} color={active ? "#fff" : C.inkSoft} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
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
    <div>
      <PageHeader
        title="Majors"
        sub={`${majors.length} majors shown in the homepage grid.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus size={15} className="inline -mt-0.5 me-1" /> Add major
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {majors.map((m) => {
          const Icon = resolveIcon(m.iconName);
          return (
            <GlassCard
              key={m.id}
              className="p-5"
              style={{ background: "#fff" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: grad.primarySoft }}
              >
                <Icon size={20} color={C.blue} />
              </div>
              <div
                className="font-semibold text-sm mb-1"
                style={{ color: C.ink }}
              >
                {m.name.en}
              </div>
              <div className="text-xs mb-3" style={{ color: C.muted }}>
                {m.count} programs
              </div>
              <div className="flex items-center gap-2">
                <GhostButton
                  onClick={() => setEditing(m)}
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Pencil size={13} /> Edit
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
                          "error",
                        );
                      }
                    }
                  }}
                >
                  <Trash2 size={13} />
                </DangerButton>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {editing !== undefined && (
        <MajorFormModal major={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
