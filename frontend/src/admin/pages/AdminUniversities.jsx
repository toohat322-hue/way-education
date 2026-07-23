import React, { useState } from "react";
import { Plus, Pencil, Trash2, Star, MapPin, DollarSign } from "lucide-react";
import { useData } from "../useData";
import { useToast } from "../useToast";
import { PageHeader, PrimaryButton, GhostButton, DangerButton } from "../ui";
import UniversityFormModal from "../UniversityFormModal";

export default function AdminUniversities() {
  const { universities, removeUniversity } = useData();
  const showToast = useToast();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit

  return (
    <div className="font-body">
      <PageHeader
        title="Partner Universities"
        sub={`${universities.length} institutions with detailed admission & academic profiles.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus className="w-4 h-4 mr-1" /> Add University
          </PrimaryButton>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {universities.map((u) => (
          <div
            key={u.id}
            className="bg-white border border-[#e0e0e0] p-5 flex flex-col justify-between hover:border-[#0f62fe] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-headline font-semibold text-sm text-[#161616]">
                  {u.name}
                </h3>
                <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-[#f4f4f4] border border-[#e0e0e0] text-xs font-semibold text-[#161616]">
                  <Star className="w-3 h-3 text-[#0f62fe] fill-[#0f62fe]" /> {u.rating}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-3">
                {u.featured && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#d0e2ff] text-[#001d6c]">
                    Featured
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    u.active === false
                      ? "bg-[#fff1f1] text-[#da1e28]"
                      : "bg-[#a7f0ba] text-[#044317]"
                  }`}
                >
                  {u.active === false ? "Inactive" : "Active"}
                </span>
              </div>

              <p className="text-xs text-[#6f6f6f] mb-4 leading-relaxed">
                <span className="inline-flex items-center gap-1 mr-2">
                  <MapPin className="w-3 h-3 text-[#525252]" /> {u.city?.en || u.city}, {u.country?.en || u.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#525252]" /> ${u.tuition ? u.tuition.toLocaleString() : 0}/yr
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#e0e0e0]">
              <GhostButton
                onClick={() => setEditing(u)}
                className="flex-1"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </GhostButton>
              <DangerButton
                onClick={async () => {
                  if (window.confirm(`Remove ${u.name}?`)) {
                    try {
                      await removeUniversity(u.id);
                      showToast(`${u.name} removed`);
                    } catch (err) {
                      showToast(
                        err.message || `Unable to remove ${u.name}`,
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
        ))}
      </div>

      {editing !== undefined && (
        <UniversityFormModal
          uni={editing}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
