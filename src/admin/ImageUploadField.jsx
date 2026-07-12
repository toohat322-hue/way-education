import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { C } from "../theme/tokens";
import { TextInput, Label } from "./ui";
import { fileToResizedDataUrl } from "./imageUpload";

// Reusable logo/cover image field: shows a live preview, an "Upload" button
// (file picker -> resized data URL, see imageUpload.js), and -- unless the
// current value is an uploaded data URL -- a plain text input so existing
// "/universities/logos/foo.svg"-style URLs can still be typed/pasted in
// directly (that's how every seed university image is set today).
//
// CUSTOMIZE:
//   - `shape="square"` for logos, the default wide box suits cover photos.
//   - `maxDim`/`format` are forwarded to fileToResizedDataUrl -- e.g. pass a
//     smaller maxDim for logos so they don't balloon localStorage usage.
export default function ImageUploadField({ label, value, onChange, shape = "wide", maxDim = 1600, format = "image/jpeg" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isUploaded = typeof value === "string" && value.startsWith("data:");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, { maxDim, format });
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${shape === "square" ? "w-16 h-16" : "w-24 h-16"}`}
          style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
        >
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} color={C.muted} />}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{ border: `1px solid ${C.border}`, color: C.inkSoft, background: "#fff" }}
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="p-1.5 rounded-lg" style={{ color: C.orangeDark }} aria-label="Remove image">
                <X size={13} />
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {isUploaded ? (
            <p className="text-[11px]" style={{ color: C.muted }}>
              Uploaded image ({Math.round(value.length / 1024).toLocaleString()} KB, stored in this browser).
            </p>
          ) : (
            <TextInput
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste an image URL"
              className="text-xs"
            />
          )}
          {error && <p className="text-[11px]" style={{ color: C.orangeDark }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
