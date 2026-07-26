const API_BASE = String(import.meta.env.VITE_API_BASE_URL ?? "")
  .trim()
  .replace(/\/$/, "");

function joinUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
}

let refreshInFlight = null;

function requestRefresh() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(joinUrl("/api/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

async function rawFetch(path, options) {
  const response = await fetch(joinUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = (response.headers.get("content-type") || "").includes(
    "application/json",
  );
  const payload = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  return { response, payload };
}

const NO_REFRESH_PATHS = ["/api/auth/login", "/api/auth/refresh"];

export async function apiFetch(path, options = {}) {
  let { response, payload } = await rawFetch(path, options);

  if (
    response.status === 401 &&
    !NO_REFRESH_PATHS.some((p) => path.startsWith(p))
  ) {
    const refreshed = await requestRefresh();
    if (refreshed) {
      ({ response, payload } = await rawFetch(path, options));
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" ? payload : "Request failed");
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
