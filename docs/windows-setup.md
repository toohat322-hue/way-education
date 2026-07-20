# Windows Setup Guide

Running a modern Node.js monorepo on Windows sometimes involves a few extra steps compared to macOS or Linux. This guide covers how to get the `way-education` project up and running smoothly on Windows.

## 1. Prerequisites

- **Node.js**: Install the latest LTS version (v20+ recommended).
- **Docker Desktop**: Required to run the local PostgreSQL database (and test database).
- **Git Bash or PowerShell**: If using PowerShell, you may need to update your execution policy to run local `npm` scripts seamlessly.

### PowerShell Execution Policy

By default, Windows restricts running custom scripts in PowerShell, which can block tools like `npm` or `npx` from executing local binaries (e.g., `npx prisma`).

If you encounter an error like `cannot be loaded because running scripts is disabled on this system`, run PowerShell as **Administrator** and execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 2. Starting the Database

Ensure Docker Desktop is running, then open your terminal at the project root:

```bash
docker-compose up -d
```

This spins up the main `way-education-postgres` container on port 5432.

## 3. Backend Setup

Open a terminal in the `backend/` directory:

```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

If you ever encounter errors saying `P2002` or `P2025` during seeding, it means your database is already seeded or out of sync. You can force a reset using `npx prisma migrate reset`.

## 4. Frontend Setup

Open a new terminal tab in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and automatically proxy API requests to `http://localhost:8000` via Vite's proxy configuration.

## 5. Running E2E Tests on Windows

We use Playwright for End-to-End testing. Because starting a database, backend, and frontend concurrently on Windows can be tricky, we provide a cross-platform orchestration script.

From the project root, run:

```bash
node scripts/run-e2e.js
```

**What this script does:**

1. Uses `docker-compose.test.yml` to spin up an isolated `postgres-test` container on port 5433.
2. Resets and seeds the test database cleanly.
3. Starts the NestJS backend on a test port (`8001`).
4. Starts the Vite frontend on a test port (`4174`).
5. Runs `npx playwright test`.
6. Automatically stops and cleans up the Docker containers and processes when finished.

## Troubleshooting

- **"localhost refused to connect" on port 8000**: Your backend isn't running. Check the backend terminal for NestJS compilation errors or Prisma connection issues.
- **Prisma "Can't reach database"**: Make sure Docker Desktop is open and `docker-compose up -d` was successful. Check your `.env` file in the backend to ensure it points to `localhost:5432` with user `postgres` and password `postgres`.
