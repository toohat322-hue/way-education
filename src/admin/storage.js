const PREFIX = "st_admin_";

export function loadOverride(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Returns false (instead of throwing) when the write fails -- most commonly
// because localStorage's ~5-10MB quota was exceeded by uploaded images.
// Callers that need to tell the user their change didn't fully persist
// (e.g. UniversityFormModal) should check this before showing a success toast.
export function saveOverride(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to persist "${key}" to localStorage`, err);
    return false;
  }
}

export function clearOverride(key) {
  localStorage.removeItem(PREFIX + key);
}
