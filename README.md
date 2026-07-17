# Way Education

Way Education is now split into a production-oriented frontend and backend:

- React 19 + Vite frontend in `src/`
- NestJS + Prisma + PostgreSQL backend in `backend/`
- REST APIs for CMS, authentication, and lead/CRM workflows

The public UI remains the same, but admin content, auth, and lead submission are backend-backed instead of browser-local.

## Architecture

- `src/` — public website and admin UI
- `backend/src/` — NestJS modules for auth, CMS, leads, health
- `backend/prisma/schema.prisma` — PostgreSQL schema
- `backend/prisma/seed.mjs` — seeds the current frontend content into PostgreSQL
- `docker-compose.yml` — local PostgreSQL for development

## Environment Variables

Frontend (`.env`):

- `VITE_API_BASE_URL=http://localhost:8000`

Backend (`backend/.env` from `backend/.env.example`):

- `DATABASE_URL`
- `FRONTEND_ORIGINS`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL`
- `JWT_REFRESH_TTL`
- `COOKIE_DOMAIN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

The backend is configured to fail fast when required secrets are missing.

## Development

1. Start PostgreSQL:

\`\`\`bash
docker compose up -d postgres
\`\`\`

2. Install frontend and backend dependencies:

\`\`\`bash
npm install
cd backend && npm install
\`\`\`

3. Create environment files:

- Copy `.env.example` to `.env`
- Copy `backend/.env.example` to `backend/.env`

4. Run Prisma:

\`\`\`bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
\`\`\`

5. Start the services:

\`\`\`bash
npm run dev
npm run dev:api
\`\`\`

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`

## Testing

- Frontend unit/integration: `npm test`
- Frontend e2e: `npm run e2e`
- Backend unit tests: `cd backend && npm test`
- Backend e2e tests: `cd backend && npm run test:e2e`

Install Playwright browsers when needed:

\`\`\`bash
npx playwright install
\`\`\`

## Deployment

- Build frontend: `npm run build`
- Build backend: `npm run build:backend`
- Run database migrations in the deployment pipeline: `cd backend && npm run prisma:deploy`

## Notes

- Universities, majors, FAQs, settings, and site copy are now fetched from the backend.
- Lead form submissions post to `POST /api/leads`.
- Admin authentication uses cookie-backed JWT sessions with refresh-token rotation.

## Project structure

\`\`\`
src/
components/ Reusable UI: Navbar, Hero, cards, sections, FAQ, footer, LeadForm, modals...
pages/ Home, Universities (directory), UniversityDetail, About, Contact
context/ LanguageContext — EN/AR toggle + RTL switching, one hook: useLanguage()
data/ universities.js (6 partner schools, full detail), directory.js (224 official
Türkiye + N. Cyprus universities, name/city/type only), majors.js, faqs.js,
translations.js — all editable content
theme/ tokens.js — every color & gradient in the app, in one place
hooks/ useCountUp, useOnScreen — small reusable logic
\`\`\`

## The two-tier university data model

- **Partner universities** (\`data/universities.js\`) — the schools you have a direct relationship
  with. Full detail page: tuition, majors, scholarships, admission docs, reviews, gallery, map,
  "Quick Apply". Add a school here once you've verified its real numbers.
- **Directory** (\`data/directory.js\`) — the full public list of every accredited university in
  Türkiye (YÖK) and Northern Cyprus (YÖDAK): 224 institutions, name/city/type/founded only, no
  invented tuition or ratings. Shown on \`/universities\` with a "Request Info" button that opens
  the lead form — your consultants fill in the real details by phone/WhatsApp. As you sign more
  university partnerships, move that entry from \`directory.js\` into \`universities.js\`.

## Editing content

- **Add/edit a university:** open \`src/data/universities.js\` and add an object to the
  \`UNIVERSITIES\` array. Every section (cards, filters, detail page, map, gallery) reads
  from this file automatically — nothing else to touch.
- **Change colors/gradients:** edit \`src/theme/tokens.js\`.
- **Change UI copy (EN/AR):** edit \`src/data/translations.js\`.
- **Add a new language:** add a new key (e.g. \`"fr"\`) to \`STRINGS\` in \`translations.js\`
  and to each \`{ en, ar }\` object in the data files, then add it to the toggle in \`Navbar.jsx\`.

## Connecting a real backend later

Two integration points are already marked in the code:

1. \`src/pages/UniversityDetail.jsx\` → \`ApplySidebar\`'s \`handleSubmit\` — replace the
   comment with a real \`fetch("/api/leads", ...)\` call to your CRM/email service.
2. \`src/data/universities.js\` → swap the static array for a \`fetch\` from your API/CMS.
   Components don't need to change since they only consume the exported shape.

For admin authentication migration, see `docs/backend-auth-migration.md`.

Admin dashboard auth is backend-backed and expects:

- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Deployment

Static output in \`/dist\` — deploy to Vercel, Netlify, Cloudflare Pages, or any static
host / S3 bucket. No server, database, or environment variables required for this
version of the project.
