const API_BASE = String(import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");

function joinUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(joinUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || (typeof payload === "string" ? payload : "Request failed");
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getApiBase() {
  return API_BASE;
}

export function getApiUrl(path) {
  return joinUrl(path);
}
