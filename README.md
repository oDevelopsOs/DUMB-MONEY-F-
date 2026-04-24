# DUMB MONEY - Landing

Mobile-first Astro landing with waitlist integration.

## Stack

- Astro 4
- Tailwind integration (used as utility layer)
- Semantic CSS architecture in `src/styles/global.css`
- Supabase REST API for waitlist

## Project structure

- `src/pages/index.astro`: main landing content and client-side interaction logic
- `src/pages/privacy.astro`: privacy page used by footer link
- `src/layouts/Base.astro`: shared metadata, Open Graph/Twitter tags, JSON-LD
- `src/styles/global.css`: mobile-first styles, sections, components and breakpoints
- `public/robots.txt`: crawler rules + sitemap URL
- `public/llms.txt`: AI context file

## Environment variables

Create `.env` (or `.env.local`) with:

```bash
# Server-only
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code. All writes now flow through `/api/waitlist`.

## Run locally

```bash
npm install
npm run dev
```

Default Astro URL is shown in terminal (usually `http://localhost:4321`).

## Mobile-first notes

- Base styles target small screens first.
- Responsive scaling is applied with `min-width` breakpoints.
- Most previous inline styles were replaced by reusable semantic classes.
- Motion respects `prefers-reduced-motion`.

## Waitlist behavior

- Counter is read through `GET /api/waitlist` (server-side Supabase access).
- Form submits to `POST /api/waitlist` with `email`, `what_they_expect`, and `referrer`.
- Handles duplicate submission (`409`) as success.
- Includes basic anti-abuse controls: rate limit + honeypot field.

## Supabase hardening assets

- SQL migration: `supabase/migrations/20260424_waitlist_hardening.sql`
- Optional public aggregate function: `supabase/migrations/20260424_waitlist_public_counter.sql`
- API route: `src/pages/api/waitlist.ts`

Apply the SQL migration in Supabase SQL editor or through the Supabase CLI before production deploy.

## Netlify deployment checklist

1. In Netlify Site Settings -> Environment Variables, set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY` (optional)
2. Trigger a deploy.
3. Smoke test in production:
   - New email submit returns success UI.
   - Duplicate email returns success UI (conflict handled gracefully).
   - Counter still loads.
   - Rapid repeated submits eventually return 429 and recover after cooldown.

## SEO / discoverability

- Canonical URL from Astro runtime
- Open Graph + Twitter cards
- JSON-LD (`SoftwareApplication`)
- `robots.txt` and `llms.txt` included
