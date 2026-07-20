export function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export function uniqueSlugId(name, existingIds, prefix = "") {
  const base = `${prefix}${slugify(name) || "item"}`;
  let id = base;
  let n = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${n++}`;
  }
  return id;
}
