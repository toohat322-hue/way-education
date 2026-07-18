# Way Education - Full-Stack App

Way Education is a university admissions platform for MENA students looking to study in Turkiye and Northern Cyprus. This repository contains the complete full-stack application.

## Project Structure

* **Frontend**: `frontend/` contains React 19, Vite, Tailwind CSS 4, React Router 7, Vitest, and Playwright tests.
* **Backend**: `backend/` contains NestJS 11, Prisma 6, PostgreSQL integration, Jest tests, and database migrations.
* **Root**: project-level Docker, CI, documentation, and local database orchestration.

## Requirements

* Node.js >= 22
* PostgreSQL >= 16, or Docker for the provided `docker-compose.yml`

## Getting Started

### 1. Environment Setup

Copy the example environment files and configure them as needed:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Ensure `backend/.env` has a valid `DATABASE_URL` pointing to your PostgreSQL instance.

### 2. Database Setup

If you have Docker installed, you can start a local PostgreSQL container:

```bash
docker compose up -d
```

Then run migrations and seed the database:

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
cd frontend
npm install
npm run dev:full
```

This starts the NestJS backend at `http://localhost:8000` and the Vite dev server at `http://localhost:5173`. API requests from the frontend are proxied to the backend automatically.

## Administration

The CMS and CRM are accessible at `/admin`.

* **Default login**: `admin@wayeducation.com`
* **Default password**: see `backend/.env` or check with your administrator

## Testing

Frontend:

```bash
cd frontend
npm run lint
npm test
npm run build
```

Backend:

```bash
cd backend
npm test
npm run build
```

## Deployment

* **Frontend**: from `frontend/`, run `npm run build`. The output is written to `frontend/dist/`.
* **Backend**: from `backend/`, run `npm run build` and start with `node dist/main`. Ensure the production database is migrated and environment variables are set.

## CI/CD

GitHub Actions runs linting, formatting, unit tests, backend tests, frontend builds, backend builds, and Playwright E2E tests on every push. See `.github/workflows/ci.yml`.
