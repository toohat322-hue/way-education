type EnvShape = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_ORIGINS: string;
  TRUST_PROXY: boolean;
  PUBLIC_API_URL?: string;
  MEDIA_STORAGE_PATH?: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TTL: string;
  JWT_REFRESH_TTL: string;
  COOKIE_DOMAIN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

function requireString(
  env: Record<string, unknown>,
  key: keyof EnvShape,
): string {
  const value = String(env[key] ?? "").trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function requirePort(
  env: Record<string, unknown>,
  key: keyof EnvShape,
  fallback?: number,
): number {
  const raw = String(env[key] ?? fallback ?? "").trim();
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer`);
  }
  return value;
}

function optionalString(env: Record<string, unknown>, key: string): string | undefined {
  const value = String(env[key] ?? "").trim();
  return value || undefined;
}

function parseBoolean(env: Record<string, unknown>, key: string, fallback = false) {
  const value = optionalString(env, key);
  if (!value) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Environment variable ${key} must be true or false`);
}

function validateOriginList(value: string, nodeEnv: string) {
  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("FRONTEND_ORIGINS must contain at least one origin");
  }

  for (const origin of origins) {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(`FRONTEND_ORIGINS contains an invalid origin: ${origin}`);
    }
    if (parsed.origin !== origin.replace(/\/$/, "")) {
      throw new Error(`FRONTEND_ORIGINS must not include a path: ${origin}`);
    }
    if (nodeEnv === "production" && parsed.protocol !== "https:") {
      throw new Error("Production FRONTEND_ORIGINS entries must use HTTPS");
    }
  }
}

export function validateEnv(config: Record<string, unknown>): EnvShape {
  const NODE_ENV = String(config.NODE_ENV || "development").trim();
  if (!new Set(["development", "test", "production"]).has(NODE_ENV)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }

  const FRONTEND_ORIGINS = requireString(config, "FRONTEND_ORIGINS");
  validateOriginList(FRONTEND_ORIGINS, NODE_ENV);

  const JWT_ACCESS_SECRET = requireString(config, "JWT_ACCESS_SECRET");
  const JWT_REFRESH_SECRET = requireString(config, "JWT_REFRESH_SECRET");
  const ADMIN_PASSWORD = requireString(config, "ADMIN_PASSWORD");

  if (NODE_ENV === "production") {
    if (JWT_ACCESS_SECRET.length < 32 || JWT_REFRESH_SECRET.length < 32) {
      throw new Error("JWT secrets must each be at least 32 characters in production");
    }
    if (JWT_ACCESS_SECRET === JWT_REFRESH_SECRET) {
      throw new Error("JWT access and refresh secrets must be different");
    }
    if (ADMIN_PASSWORD.length < 12 || ADMIN_PASSWORD === "wayeducation_admin") {
      throw new Error("ADMIN_PASSWORD must be a unique value of at least 12 characters in production");
    }
  }

  const PUBLIC_API_URL = optionalString(config, "PUBLIC_API_URL");
  if (PUBLIC_API_URL) {
    try {
      new URL(PUBLIC_API_URL);
    } catch {
      throw new Error("PUBLIC_API_URL must be an absolute URL");
    }
  }

  return {
    NODE_ENV,
    PORT: requirePort(config, "PORT", 8000),
    DATABASE_URL: requireString(config, "DATABASE_URL"),
    FRONTEND_ORIGINS,
    TRUST_PROXY: parseBoolean(config, "TRUST_PROXY"),
    PUBLIC_API_URL,
    MEDIA_STORAGE_PATH: optionalString(config, "MEDIA_STORAGE_PATH"),
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_TTL: requireString(config, "JWT_ACCESS_TTL"),
    JWT_REFRESH_TTL: requireString(config, "JWT_REFRESH_TTL"),
    COOKIE_DOMAIN: requireString(config, "COOKIE_DOMAIN"),
    SMTP_HOST: requireString(config, "SMTP_HOST"),
    SMTP_PORT: requirePort(config, "SMTP_PORT"),
    SMTP_USER: requireString(config, "SMTP_USER"),
    SMTP_PASS: requireString(config, "SMTP_PASS"),
    SMTP_FROM: requireString(config, "SMTP_FROM"),
    ADMIN_EMAIL: requireString(config, "ADMIN_EMAIL"),
    ADMIN_PASSWORD,
  };
}
