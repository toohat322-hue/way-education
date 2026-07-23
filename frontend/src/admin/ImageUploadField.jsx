import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, Loader2, Link2, Sparkles } from "lucide-react";
import { Label, TextInput } from "./ui";
import { uploadImageFile } from "./imageUpload";

const PRESET_HEROES = [
  { name: "Modern Campus 1", url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80" },
  { name: "University Hall 2", url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80" },
  { name: "Academic Library 3", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" },
  { name: "Student Quad 4", url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80" },
];

const PRESET_LOGOS = [
  { name: "University Crest A", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80" },
  { name: "Academic Shield B", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" },
];

export default function ImageUploadField({
  label,
  value,
  onChange,
  shape = "wide",
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const presets = shape === "square" ? PRESET_LOGOS : PRESET_HEROES;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const dataUrl = await uploadImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="font-body">
      <div className="flex items-center justify-between mb-1.5">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] font-semibold text-[#0f62fe] flex items-center gap-1 hover:underline"
        >
          <Sparkles className="w-3 h-3" /> {showPresets ? "Hide Presets" : "Pick Sample Preset"}
        </button>
      </div>

      {showPresets && (
        <div className="mb-3 p-3 bg-[#f4f4f4] border border-[#e0e0e0] grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setShowPresets(false);
              }}
              className="group relative border border-[#e0e0e0] hover:border-[#0f62fe] bg-white overflow-hidden text-left"
            >
              <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover" />
              <span className="block p-1 text-[10px] text-[#161616] truncate font-medium">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-[#e0e0e0] p-3">
        <div
          className={`shrink-0 border border-[#e0e0e0] bg-[#f4f4f4] flex items-center justify-center overflow-hidden relative ${
            shape === "square" ? "w-20 h-20" : "w-36 h-20"
          }`}
        >
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#6f6f6f] p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-[#6f6f6f]" />
              <span className="text-[10px]">No image</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="px-3 h-8 bg-[#f4f4f4] text-[#161616] border border-[#e0e0e0] hover:bg-[#e0e0e0] text-xs font-semibold flex items-center gap-1.5 transition-colors font-body"
            >
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0f62fe]" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-[#0f62fe]" />
              )}
              {value ? "Upload Replacement" : "Upload File"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-2 h-8 text-[#da1e28] hover:bg-[#fff1f1] border border-[#ffb3b8] text-xs font-medium flex items-center gap-1 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          <div className="relative">
            <TextInput
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste image URL (e.g. /universities/logos/iau.webp or https://...)"
              className="text-xs pr-8"
            />
            <Link2 className="w-3.5 h-3.5 text-[#6f6f6f] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {error && (
            <p className="text-[11px] text-[#da1e28] font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
