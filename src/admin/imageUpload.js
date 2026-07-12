// Turns a user-selected <input type="file"> image into a downscaled data URL
// so it can be stored directly in the university object (and therefore in
// localStorage, alongside every other field -- see src/admin/storage.js).
//
// There is no backend/file server in this app, so "uploading" an image just
// means: read it, shrink it to a sane size, and inline it as a data: URL.
// If you add a real backend later (see the Laravel reference doc), swap the
// body of this function for a `fetch("/api/uploads", { method: "POST", body: formData })`
// call that returns a hosted URL instead -- callers (ImageUploadField) don't
// need to change, since they just await a string URL either way.
export function fileToResizedDataUrl(file, { maxDim = 1600, format = "image/jpeg", quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (PNG, JPG, WEBP...)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode that image."));
      img.onload = () => {
        // Only shrink -- never upscale a small logo.
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(format, quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
