# Way Education

Premium, mobile-first landing page for a MENA-to-Türkiye/N.Cyprus university
admissions company. Built with React + Vite + Tailwind CSS v4.

## Stack
- **React 19 + Vite** — fast dev server, instant HMR, small production bundle
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` (no separate config file needed)
- **React Router** — client-side routing (`/` and `/university/:id`)
- **lucide-react** — icon set
- No backend required. All content lives in `src/data/*.js` — swap in a real API later without touching any component.

## Getting started
\`\`\`bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to /dist — deploy this folder anywhere static
npm run preview   # preview the production build locally
\`\`\`

## Project structure
\`\`\`
src/
  components/     Reusable UI: Navbar, Hero, cards, sections, FAQ, footer, LeadForm, modals...
  pages/          Home, Universities (directory), UniversityDetail, About, Contact
  context/        LanguageContext — EN/AR toggle + RTL switching, one hook: useLanguage()
  data/           universities.js (6 partner schools, full detail), directory.js (224 official
                  Türkiye + N. Cyprus universities, name/city/type only), majors.js, faqs.js,
                  translations.js — all editable content
  theme/          tokens.js — every color & gradient in the app, in one place
  hooks/          useCountUp, useOnScreen — small reusable logic
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

## Deployment
Static output in \`/dist\` — deploy to Vercel, Netlify, Cloudflare Pages, or any static
host / S3 bucket. No server, database, or environment variables required for this
version of the project.
