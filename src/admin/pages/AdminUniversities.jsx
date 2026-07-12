import React, { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { C, grad } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { useData } from "../useData";
import { useToast } from "../useToast";
import { PageHeader, PrimaryButton, GhostButton, DangerButton } from "../ui";
import UniversityFormModal from "../UniversityFormModal";

export default function AdminUniversities() {
  const { universities, removeUniversity, resetUniversities } = useData();
  const showToast = useToast();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit

  return (
    <div>
      <PageHeader
        title="Partner Universities"
        sub={`${universities.length} universities with full detail pages.`}
        action={
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => { if (window.confirm("Reset partner universities to defaults? This discards your edits.")) { resetUniversities(); showToast("Partner universities reset to defaults"); } }}>
              Reset
            </GhostButton>
            <PrimaryButton onClick={() => setEditing(null)}>
              <Plus size={15} className="inline -mt-0.5 me-1" /> Add university
            </PrimaryButton>
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {universities.map((u) => (
          <GlassCard key={u.id} className="p-4" style={{ background: "#fff" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>{u.name}</h3>
              <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FFF1E8", color: C.orangeDark }}>
                <Star size={12} fill={C.orange} color={C.orange} /> {u.rating}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-1.5 mb-2">
              {u.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: grad.cta }}>Featured</span>
              )}
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={u.active === false ? { background: "#FFF1EE", color: C.orangeDark } : { background: "#E7F9EF", color: "#16A34A" }}
              >
                {u.active === false ? "Inactive" : "Active"}
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: C.muted }}>{u.city.en}, {u.country.en} · ${u.tuition.toLocaleString()}/yr</p>
            <div className="flex items-center gap-2">
              <GhostButton onClick={() => setEditing(u)} className="flex-1 flex items-center justify-center gap-1.5">
                <Pencil size={13} /> Edit
              </GhostButton>
              <DangerButton onClick={() => { if (window.confirm(`Remove ${u.name}?`)) { removeUniversity(u.id); showToast(`${u.name} removed`); } }}>
                <Trash2 size={13} />
              </DangerButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {editing !== undefined && <UniversityFormModal uni={editing} onClose={() => setEditing(undefined)} />}
    </div>
  );
}
