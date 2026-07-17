const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").trim();

function joinUrl(path) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(joinUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
