import React, { useRef, useState } from "react";
import { UploadCloud, RefreshCw, Trash2, X, Loader2, Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import { Label, TextInput, PrimaryButton } from "./ui";
import {
  uploadImageFile,
  validateImageFile,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_MAX_SIZE_MB,
} from "./imageUpload";

const ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

const SAMPLE_CAMPUS_GALLERY = [
  "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
];

export default function GalleryUploadField({ value = [], onChange }) {
  const dropRef = useRef(null);
  const addInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceIndexRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setBusy(true);
    const nextErrors = [];
    const accepted = [];
    for (const file of files) {
      const err = validateImageFile(file);
      if (err) {
        nextErrors.push(err);
        continue;
      }
      try {
        accepted.push(await uploadImageFile(file));
      } catch (e) {
        nextErrors.push(`${file.name}: ${e.message || "upload failed"}.`);
      }
    }
    if (accepted.length > 0) onChange([...value, ...accepted]);
    setErrors(nextErrors);
    setBusy(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleAddInputChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const openReplace = (index) => {
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const handleReplaceInputChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const index = replaceIndexRef.current;
    if (!file || index == null) return;

    const err = validateImageFile(file);
    if (err) {
      setErrors([err]);
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await uploadImageFile(file);
      onChange(value.map((v, i) => (i === index ? dataUrl : v)));
      setErrors([]);
    } catch (e2) {
      setErrors([`${file.name}: ${e2.message || "upload failed"}.`]);
    } finally {
      setBusy(false);
    }
  };

  const removeAt = (index) => onChange(value.filter((_, i) => i !== index));

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange([...value, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const handleAddSampleGallery = () => {
    const next = [...value];
    SAMPLE_CAMPUS_GALLERY.forEach((url) => {
      if (!next.includes(url)) next.push(url);
    });
    onChange(next);
  };

  return (
    <div className="font-body">
      <div className="flex items-center justify-between mb-2">
        <Label>Campus Photo Gallery</Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddSampleGallery}
            className="text-[11px] font-semibold text-[#0f62fe] flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" /> Add Sample Photos
          </button>
          <span className="text-xs text-[#6f6f6f]">
            {value.length} photo{value.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        ref={dropRef}
        onClick={() => addInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-1.5 py-6 px-4 border-2 border-dashed cursor-pointer text-center transition-colors ${
          dragActive
            ? "border-[#0f62fe] bg-[#d0e2ff]/30"
            : "border-[#e0e0e0] bg-[#f4f4f4] hover:bg-[#e0e0e0]/50"
        }`}
      >
        {busy ? (
          <Loader2 className="w-6 h-6 text-[#0f62fe] animate-spin" />
        ) : (
          <UploadCloud className="w-6 h-6 text-[#0f62fe]" />
        )}
        <p className="text-xs font-semibold text-[#161616]">
          {busy
            ? "Processing images..."
            : "Drag & drop campus photos here, or click to upload files"}
        </p>
        <p className="text-[11px] text-[#6f6f6f]">
          JPG, PNG, WEBP or SVG · up to {ALLOWED_MAX_SIZE_MB}MB each
        </p>
        <input
          ref={addInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={handleAddInputChange}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={handleReplaceInputChange}
        />
      </div>

      {/* URL Input Form */}
      <div className="flex items-center gap-2 mt-2">
        <TextInput
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste direct image URL (e.g. /universities/gallery/iau-1.jpg or https://...)"
          className="text-xs flex-1"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-3 h-9 bg-white border border-[#e0e0e0] text-[#161616] hover:bg-[#f4f4f4] text-xs font-semibold flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add URL
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((msg, i) => (
            <p key={i} className="text-xs text-[#da1e28] font-medium">
              {msg}
            </p>
          ))}
        </div>
      )}

      {/* Gallery Grid Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
          {value.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square bg-[#f4f4f4] border border-[#e0e0e0] overflow-hidden"
            >
              <img
                src={src}
                alt={`Gallery photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => openReplace(i)}
                  className="w-7 h-7 bg-white text-[#161616] flex items-center justify-center rounded"
                  title="Replace photo"
                  aria-label={`Replace photo ${i + 1}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="w-7 h-7 bg-[#da1e28] text-white flex items-center justify-center rounded"
                  title="Delete photo"
                  aria-label={`Delete photo ${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
