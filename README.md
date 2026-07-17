# Way Education - Full-Stack App

Way Education is a university admissions platform designed for MENA students looking to study in Türkiye and Northern Cyprus. This repository contains the complete full-stack application.

## Tech Stack
*   **Frontend**: React 19, Vite, Tailwind CSS 4, React Router 7.
*   **Backend**: NestJS 11, Prisma 6, PostgreSQL.
*   **Testing**: Vitest, Playwright, Jest.

## Requirements
*   Node.js >= 22
*   PostgreSQL >= 16 (or Docker to run the provided `docker-compose.yml`)

## Getting Started

### 1. Environment Setup

Copy the example environment files and configure them as needed:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Ensure `backend/.env` has a valid `DATABASE_URL` pointing to your PostgreSQL instance.

### 2. Database Setup

If you have Docker installed, you can start a local PostgreSQL container:
```bash
docker compose up -d
```

Then, from the `backend/` directory, run migrations and seed the database:
```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
cd ..
```

### 3. Development

Install frontend dependencies and start both the frontend and backend in parallel:
```bash
npm install
npm run dev:full
```
This will start the NestJS backend at `http://localhost:8000` and the Vite dev server at `http://localhost:5173`. API requests from the frontend are proxied to the backend automatically.

## Administration
The CMS and CRM are accessible at `/admin`.
*   **Default Login**: `admin@wayeducation.com`
*   **Default Password**: (See `.env` or check with your administrator)

## Deployment
*   **Frontend**: Build the static assets via `npm run build`. The output will be in the `dist/` directory, ready to be served by Nginx, Vercel, or any static host.
*   **Backend**: Build the NestJS app via `npm run build:backend` and start it with `node backend/dist/main`. Ensure the production database is migrated and environment variables are set.

## CI/CD
GitHub Actions is configured to run linting, formatting, unit tests, and E2E Playwright tests on every push. See `.github/workflows/ci.yml`.
