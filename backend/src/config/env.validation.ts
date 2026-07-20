type EnvShape = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_ORIGINS: string;
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

export function validateEnv(config: Record<string, unknown>): EnvShape {
  return {
    NODE_ENV: String(config.NODE_ENV || "development"),
    PORT: requirePort(config, "PORT", 8000),
    DATABASE_URL: requireString(config, "DATABASE_URL"),
    FRONTEND_ORIGINS: requireString(config, "FRONTEND_ORIGINS"),
    JWT_ACCESS_SECRET: requireString(config, "JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: requireString(config, "JWT_REFRESH_SECRET"),
    JWT_ACCESS_TTL: requireString(config, "JWT_ACCESS_TTL"),
    JWT_REFRESH_TTL: requireString(config, "JWT_REFRESH_TTL"),
    COOKIE_DOMAIN: requireString(config, "COOKIE_DOMAIN"),
    SMTP_HOST: requireString(config, "SMTP_HOST"),
    SMTP_PORT: requirePort(config, "SMTP_PORT"),
    SMTP_USER: requireString(config, "SMTP_USER"),
    SMTP_PASS: requireString(config, "SMTP_PASS"),
    SMTP_FROM: requireString(config, "SMTP_FROM"),
    ADMIN_EMAIL: requireString(config, "ADMIN_EMAIL"),
    ADMIN_PASSWORD: requireString(config, "ADMIN_PASSWORD"),
  };
}
