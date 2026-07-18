import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(rootDir, "backend");
const frontendDir = path.resolve(rootDir, "frontend");

const testEnv = {
  ...process.env,
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5433/way_education_test?schema=public",
  NODE_ENV: "test",
  PORT: "8001",
  JWT_ACCESS_SECRET: "test-secret-access",
  JWT_REFRESH_SECRET: "test-secret-refresh",
  ADMIN_EMAIL: "admin@wayeducation.com",
  ADMIN_PASSWORD: "adminpassword",
  JWT_ACCESS_TTL: "15m",
  JWT_REFRESH_TTL: "7d",
  COOKIE_DOMAIN: "localhost",
  VITE_API_BASE_URL: "http://localhost:8001"
};

const runCommand = (command, args, cwd, env = process.env) => {
  return new Promise((resolve, reject) => {
    console.log(`\n> Running: ${command} ${args.join(" ")} in ${cwd}`);
    const proc = spawn(command, args, { cwd, env, shell: true, stdio: "inherit" });
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(`Command failed with code ${code}`));
      else resolve();
    });
  });
};

const startProcess = (command, args, cwd, env = process.env) => {
  console.log(`\n> Starting: ${command} ${args.join(" ")} in ${cwd}`);
  const proc = spawn(command, args, { cwd, env, shell: true });
  proc.stdout.on('data', (data) => console.log(`[${command}] ${data.toString().trim()}`));
  proc.stderr.on('data', (data) => console.error(`[${command} ERROR] ${data.toString().trim()}`));
  return proc;
};

const waitForUrl = (url, timeoutMs = 60000) => {
  console.log(`Waiting for ${url} to be ready...`);
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log(`${url} is ready!`);
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    };
    const retry = () => {
      if (Date.now() - start > timeoutMs) reject(new Error(`Timeout waiting for ${url}`));
      else setTimeout(check, 1000);
    };
    check();
  });
};

async function main() {
  let backendProc, frontendProc;
  try {
    console.log("Starting test database...");
    await runCommand("docker-compose", ["-f", "docker-compose.test.yml", "up", "-d", "--wait"], rootDir);

    console.log("Resetting database and seeding...");
    await runCommand("npx", ["prisma", "migrate", "reset", "--force"], backendDir, testEnv);

    console.log("Starting backend...");
    backendProc = startProcess("npm", ["run", "start"], backendDir, testEnv);
    await waitForUrl("http://localhost:8001/api/health");

    console.log("Starting frontend...");
    frontendProc = startProcess("npm", ["run", "preview", "--", "--port", "4174"], frontendDir, testEnv);
    await waitForUrl("http://localhost:4174");

    console.log("Running Playwright tests...");
    await runCommand("npx", ["playwright", "test"], frontendDir, { ...testEnv, PLAYWRIGHT_TEST_BASE_URL: "http://localhost:4174" });

    console.log("E2E tests passed successfully!");
  } catch (err) {
    console.error("E2E tests failed:", err);
    process.exitCode = 1;
  } finally {
    console.log("Tearing down...");
    if (backendProc) backendProc.kill();
    if (frontendProc) frontendProc.kill();
    await runCommand("docker-compose", ["-f", "docker-compose.test.yml", "down", "-v"], rootDir).catch(() => {});
  }
}

main();
