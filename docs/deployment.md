# Production deployment

Way Education is deployed as two services: the Vite application on Vercel and
the NestJS API on Render, backed by Neon PostgreSQL. Use custom subdomains of
the same registrable domain (for example `www.example.com` and
`api.example.com`) so secure, cookie-based admin sessions work consistently.

## 1. Neon PostgreSQL

1. Create a Neon project and production database.
2. Copy its pooled connection string into Render as `DATABASE_URL`. Keep the
   required SSL parameters supplied by Neon.
3. Do not run `prisma migrate dev` against production. Render runs
   `npm run prisma:deploy` as its pre-deploy step.

## 2. Render API

Create the service from `render.yaml`, or configure a Node 22 web service with
`backend` as the root directory. Set these secret values in Render; never put
them in Git:

| Variable | Production value |
| --- | --- |
| `DATABASE_URL` | Neon pooled PostgreSQL URL |
| `FRONTEND_ORIGINS` | Exact Vercel/custom frontend origins, comma-separated |
| `PUBLIC_API_URL` | Public HTTPS API origin, e.g. `https://api.example.com` |
| `COOKIE_DOMAIN` | Shared domain, e.g. `.example.com` |
| `JWT_ACCESS_SECRET` | Unique random value, at least 32 characters |
| `JWT_REFRESH_SECRET` | Different unique random value, at least 32 characters |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Transactional email provider settings |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial super-admin credentials; the password is used only when that account does not yet exist |

Keep `NODE_ENV=production`, `TRUST_PROXY=true`, and
`MEDIA_STORAGE_PATH=/var/data/media`. The Render blueprint attaches a
persistent disk at `/var/data`; without persistent object storage or a disk,
uploaded media is lost on a redeploy. Configure the health check as
`/api/health/ready`.

After the first deployment, sign in, change the bootstrap admin password using
the recovery workflow if desired, and verify `GET /api/health/ready` returns
200. Do not rotate `JWT_*_SECRET` casually: doing so invalidates active
sessions.

## 3. Vercel frontend

Import the repository into Vercel with `frontend` as its root directory. Use:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://api.example.com`

`frontend/vercel.json` supplies the SPA rewrite and immutable cache headers
for Vite assets. Add the Vercel domain to `FRONTEND_ORIGINS` before deploying.

## 4. Release checklist

1. `npm ci` in both `frontend` and `backend`.
2. Run `npm run lint`, `npm run test`, and `npm run build` in `frontend`.
3. Run `npm run typecheck`, `npm run test`, and `npm run build` in `backend`.
4. Run `docker build -t way-education:local .`.
5. Merge through the GitHub Actions workflow. It validates Prisma, runs tests,
   builds both applications, runs end-to-end tests, and builds the production
   image.
6. Confirm the Render pre-deploy migration succeeds, then check readiness,
   login, lead submission, and a media upload from the deployed frontend.
7. Keep Neon point-in-time recovery enabled and schedule an encrypted
   `snapshot/export` backup outside the application database.

## Local operations

Copy `backend/.env.example` and `frontend/.env.example` to local `.env` files.
Start PostgreSQL with `docker compose up -d`, then run `npm run prisma:deploy`
and `npm run prisma:seed` from `backend`. Local Docker credentials are for
development only and must never be reused in a hosted database.
