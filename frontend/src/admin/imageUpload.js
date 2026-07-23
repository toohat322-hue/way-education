import { getApiUrl } from "../lib/api";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
export const ALLOWED_MAX_SIZE_MB = 10;

// Returns an error string if `file` fails the type/size check, or null if valid.
export function validateImageFile(
  file,
  { types = ALLOWED_IMAGE_TYPES, maxSizeMB = ALLOWED_MAX_SIZE_MB } = {}
) {
  if (!types.includes(file.type)) {
    return `${file.name}: unsupported file type (use JPG, PNG, WEBP, or SVG).`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `${file.name}: file size exceeds ${maxSizeMB}MB limit.`;
  }
  return null;
}

// Converts a File object to an optimized Data URL
export function fileToDataUrl(file, maxWidth = 1920, maxHeight = 1080) {
  return new Promise((resolve, reject) => {
    // If file is SVG, read directly as Data URL
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp/jpeg with high quality compression
        const dataUrl = canvas.toDataURL(
          file.type === "image/png" ? "image/png" : "image/jpeg",
          0.88
        );
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Unable to decode image file."));
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Uploads a file to backend POST /api/media or falls back seamlessly to Data URL
export async function uploadImageFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(getApiUrl("/api/media"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      const payload = await response.json().catch(() => null);
      if (payload?.url) return payload.url;
    }
  } catch (err) {
    console.warn("Backend media server offline, using optimized client image data:", err.message);
  }

  // Fallback to optimized Data URL so image upload ALWAYS succeeds for user
  return await fileToDataUrl(file);
}
