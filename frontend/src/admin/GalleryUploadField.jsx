import React, { useRef, useState } from "react";
import { UploadCloud, RefreshCw, Trash2, X, Loader2 } from "lucide-react";
import { C } from "../theme/tokens";
import { Label } from "./ui";
import {
  uploadImageFile,
  validateImageFile,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_MAX_SIZE_MB,
} from "./imageUpload";

const ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

// Multi-image gallery manager: drag & drop (or click) to add photos, replace
// or delete any existing one. Backs the "gallery" array on a university
// (plain list of image URLs/data-URLs -- see src/data/universities.js).
//
// CUSTOMIZE:
//   - Storage path / server upload: today `fileToResizedDataUrl` (imageUpload.js)
//     just inlines a resized data URL, since this app has no backend. Swap it
//     for a real upload call (see docs/laravel-university-backend-reference.md's
//     UploadController) and this component doesn't need to change -- it only
//     cares that each accepted file resolves to a URL string.
//   - Validation rules: edit ALLOWED_IMAGE_TYPES / ALLOWED_MAX_SIZE_MB in
//     imageUpload.js -- both this component and the error text below read
//     from those constants, so they stay in sync automatically.
//   - Grid/card styling: the thumbnail grid classes below are plain
//     Tailwind, change `grid-cols-*` to resize the grid.
export default function GalleryUploadField({ value = [], onChange }) {
  const dropRef = useRef(null);
  const addInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceIndexRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);

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
    e.target.value = ""; // allow re-selecting the same file(s) later
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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Gallery</Label>
        <span className="text-xs" style={{ color: C.muted }}>
          {value.length} photo{value.length === 1 ? "" : "s"}
        </span>
      </div>

      <div
        ref={dropRef}
        onClick={() => addInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-1.5 py-6 px-4 rounded-xl cursor-pointer text-center transition-colors"
        style={{
          border: `2px dashed ${dragActive ? C.blue : C.border}`,
          background: dragActive ? "rgba(41,82,227,0.06)" : C.bgAlt,
        }}
      >
        {busy ? (
          <Loader2 size={20} color={C.blue} className="animate-spin" />
        ) : (
          <UploadCloud size={20} color={C.blue} />
        )}
        <p className="text-sm font-medium" style={{ color: C.ink }}>
          {busy
            ? "Processing..."
            : "Drag & drop photos here, or click to browse"}
        </p>
        <p className="text-xs" style={{ color: C.muted }}>
          JPG, PNG or WEBP · up to {ALLOWED_MAX_SIZE_MB}MB each
        </p>
        <input
          ref={addInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={handleAddInputChange}
        />
        {/* Single hidden input reused for every "Replace" click -- which
            thumbnail it targets is tracked in replaceIndexRef. */}
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={handleReplaceInputChange}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((msg, i) => (
            <p key={i} className="text-xs" style={{ color: C.orangeDark }}>
              {msg}
            </p>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {value.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden"
              style={{ border: `1px solid ${C.border}` }}
            >
              <img
                src={src}
                alt={`Gallery photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(11,18,48,0.55)" }}
              >
                <button
                  type="button"
                  onClick={() => openReplace(i)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                  aria-label={`Replace photo ${i + 1}`}
                >
                  <RefreshCw size={14} color={C.ink} />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                  aria-label={`Delete photo ${i + 1}`}
                >
                  <Trash2 size={14} color={C.orangeDark} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center sm:hidden"
                style={{ background: "rgba(11,18,48,0.6)" }}
                aria-label={`Delete photo ${i + 1}`}
              >
                <X size={11} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
