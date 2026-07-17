// Allowed types + max size for the gallery uploader (see GalleryUploadField.jsx).
// CUSTOMIZE: add/remove MIME types here, or change ALLOWED_MAX_SIZE_MB to
// raise/lower the per-photo limit -- both are read from this one place.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_MAX_SIZE_MB = 5;

// Returns an error string if `file` fails the type/size check, or null if it's fine.
export function validateImageFile(file, { types = ALLOWED_IMAGE_TYPES, maxSizeMB = ALLOWED_MAX_SIZE_MB } = {}) {
  if (!types.includes(file.type)) {
    return `${file.name}: unsupported file type (use JPG, PNG, or WEBP).`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `${file.name}: file is too large (max ${maxSizeMB}MB).`;
  }
  return null;
}

// Uploads a file to the backend via POST /api/media and returns the URL string.
export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  // NOTE: apiFetch handles JSON/Error wrapping, but since we are sending FormData,
  // we must let the browser set the Content-Type header so it includes the boundary.
  const response = await fetch("/api/media", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message || payload?.error || (typeof payload === "string" ? payload : "Upload failed");
    throw new Error(message);
  }
  
  return payload.url;
}
