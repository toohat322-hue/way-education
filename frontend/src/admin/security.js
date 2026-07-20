function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function sanitizeDigitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function sanitizeExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export function validateBackupPayload(payload) {
  if (!isPlainObject(payload)) {
    return { ok: false, error: "Backup root must be a JSON object." };
  }

  const keys = [
    "universities",
    "directory",
    "majors",
    "faqs",
    "strings",
    "settings",
  ];
  for (const key of keys) {
    if (!(key in payload)) continue;

    if (
      ["universities", "directory", "majors", "faqs"].includes(key) &&
      !Array.isArray(payload[key])
    ) {
      return { ok: false, error: `Invalid "${key}": expected an array.` };
    }

    if (["strings", "settings"].includes(key) && !isPlainObject(payload[key])) {
      return { ok: false, error: `Invalid "${key}": expected an object.` };
    }
  }

  const next = {};
  if (Array.isArray(payload.universities))
    next.universities = payload.universities;
  if (Array.isArray(payload.directory)) next.directory = payload.directory;
  if (Array.isArray(payload.majors)) next.majors = payload.majors;
  if (Array.isArray(payload.faqs)) next.faqs = payload.faqs;
  if (isPlainObject(payload.strings)) next.strings = payload.strings;
  if (isPlainObject(payload.settings)) {
    next.settings = {
      ...payload.settings,
      whatsapp: sanitizeDigitsOnly(payload.settings.whatsapp),
    };
  }

  return { ok: true, value: next };
}
