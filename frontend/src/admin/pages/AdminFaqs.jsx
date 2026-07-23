import React, { useState } from "react";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
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
      <form onSubmit={handleSubmit} className="space-y-4 font-body">
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
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e0e0]">
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
    <div className="font-body">
      <PageHeader
        title="Knowledge Repository (FAQs)"
        sub={`${faqs.length} curated questions and answers shown on the public FAQ section.`}
        action={
          <PrimaryButton onClick={() => setEditing(null)}>
            <Plus className="w-4 h-4 mr-1" /> Add FAQ
          </PrimaryButton>
        }
      />

      <div className="space-y-4">
        {faqs.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-[#e0e0e0] p-5 hover:border-[#0f62fe] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 bg-[#f4f4f4] border border-[#e0e0e0] flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4 text-[#0f62fe]" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-sm text-[#161616] mb-1">
                    {f.q.en}
                  </h3>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    {f.a.en}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditing(f)}
                  className="p-1 text-[#0f62fe] hover:bg-[#f4f4f4] transition-colors"
                  aria-label="Edit FAQ"
                >
                  <Pencil className="w-4 h-4" />
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
                          "error"
                        );
                      }
                    }
                  }}
                  className="p-1 text-[#da1e28] hover:bg-[#fff1f1] transition-colors"
                  aria-label="Remove FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== undefined && (
        <FaqFormModal faq={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
