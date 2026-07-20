import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { C } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { useData } from "../useData";
import { useToast } from "../useToast";
import {
  PageHeader,
  Field,
  TextArea,
  PrimaryButton,
  GhostButton,
  AdminModal,
} from "../ui";

function initFromFaq(faq) {
  if (faq)
    return { qEn: faq.q.en, qAr: faq.q.ar, aEn: faq.a.en, aAr: faq.a.ar };
  return { qEn: "", qAr: "", aEn: "", aAr: "" };
}

function FaqFormModal({ faq, onClose }) {
  const { addFaq, updateFaq } = useData();
  const showToast = useToast();
  const baseline = initFromFaq(faq);
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
      q: { en: form.qEn, ar: form.qAr },
      a: { en: form.aEn, ar: form.aAr },
    };
    try {
      if (faq) {
        await updateFaq(faq.id, payload);
        showToast("FAQ saved");
      } else {
        await addFaq(payload);
        showToast("FAQ added");
      }
      onClose();
    } catch (err) {
      showToast(err.message || "Unable to save FAQ", "error");
    }
  };

  return (
    <AdminModal title={faq ? "Edit FAQ" : "Add FAQ"} onClose={guardedClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Question (English)" id="faq-question-en">
          <TextArea rows={2} required value={form.qEn} onChange={set("qEn")} />
        </Field>
        <Field label="Question (Arabic)" id="faq-question-ar">
          <TextArea
            rows={2}
            required
            value={form.qAr}
            onChange={set("qAr")}
            dir="rtl"
          />
        </Field>
        <Field label="Answer (English)" id="faq-answer-en">
          <TextArea rows={3} required value={form.aEn} onChange={set("aEn")} />
        </Field>
        <Field label="Answer (Arabic)" id="faq-answer-ar">
          <TextArea
            rows={3}
            required
            value={form.aAr}
            onChange={set("aAr")}
            dir="rtl"
          />
        </Field>
        <div className="flex items-center justify-end gap-3 pt-2">
          <GhostButton type="button" onClick={guardedClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">
            {faq ? "Save changes" : "Add FAQ"}
          </PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminFaqs() {
  const { faqs, removeFaq } = useData();
  const showToast = useToast();
  const [editing, setEditing] = useState(undefined);

  return (
    <div>
      <PageHeader
        title="FAQs"
        sub={`${faqs.length} questions shown on the homepage.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus size={15} className="inline -mt-0.5 me-1" /> Add FAQ
          </PrimaryButton>
        }
      />

      <div className="space-y-3">
        {faqs.map((f) => (
          <GlassCard key={f.id} className="p-5" style={{ background: "#fff" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: C.ink }}
                >
                  {f.q.en}
                </p>
                <p className="text-sm" style={{ color: C.muted }}>
                  {f.a.en}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditing(f)}
                  className="p-2 rounded-lg"
                  style={{ color: C.blue }}
                  aria-label="Edit FAQ"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Remove this FAQ?")) {
                      try {
                        await removeFaq(f.id);
                        showToast("FAQ removed");
                      } catch (err) {
                        showToast(
                          err.message || "Unable to remove FAQ",
                          "error",
                        );
                      }
                    }
                  }}
                  className="p-2 rounded-lg"
                  style={{ color: C.orangeDark }}
                  aria-label="Remove FAQ"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {editing !== undefined && (
        <FaqFormModal faq={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
