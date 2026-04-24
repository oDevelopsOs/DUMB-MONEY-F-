# DUMB MONEY Frontend (Full Rewrite)

This frontend is now aligned to `actualizaCONTENIDO_Y_FRONTEND.md` with:
- English-only copy
- irreverent anti-marketing voice
- evidence-first conversion narrative
- mobile-first dark editorial design

## Stack

- Astro 4
- Tailwind integration (available)
- Semantic CSS architecture in `src/styles/global.css`
- Supabase REST for waitlist

## Core Files

- `src/pages/index.astro` - full landing flow + interactions
- `src/styles/global.css` - design tokens, sections, responsive behavior
- `src/layouts/Base.astro` - SEO/meta/canonical/OG/Twitter/JSON-LD
- `src/pages/privacy.astro` - privacy and legal boundaries
- `frontend-system.json` - machine-readable frontend system map

## Required Narrative Flow Implemented

1. Nav
2. Hero
3. The Crime
4. The Numbers
5. The Mirror
6. The Verdict
7. The Solution
8. Social Proof
9. Manifesto
10. Waitlist
11. Footer

## Voice and Messaging Rules

- Confrontational but clear
- Anti-corporate and anti-SaaS tone
- Witty/defiant style
- “Us vs them” framing maintained
- Hero starts with a declaration, not product feature language

## Conversion and Form Contract

Waitlist requirements:
- CTA is declarative: `I'm in`
- Counter is visible before/near form
- Microcopy explicitly promises:
  - no spam
  - no newsletter
  - no data sale

Supabase backend requirements (server-side):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

On **Vercel/Netlify**, those values exist at **runtime** in `process.env`. The API route reads `process.env` first so the build does not strip Supabase (using only `import.meta.env` without build-time values can compile to “always missing” and return 500).

Behavior:
- missing env -> visible status fallback
- submit success on `2xx` or `409`

## Vercel + Supabase (production waitlist)

1. **Supabase (once per project)**  
   SQL Editor → New query → paste and run the full file  
   [`supabase/setup_waitlist_one_shot.sql`](supabase/setup_waitlist_one_shot.sql)  
   (Same as running `migrations/20260424_waitlist_hardening.sql` plus the optional counter migration.)

2. **Supabase → Project Settings → API**  
   Copy **Project URL** and **service_role** key (not `anon` for this API).

3. **Vercel → your site → Settings → Environment Variables**  
   Add for **Production** (and **Preview** if you use preview URLs):

   | Name | Value |
   |------|--------|
   | `SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role secret |

4. **Node.js on Vercel:** the project pins **Node 20** (`engines.node` in `package.json` and `.nvmrc`). `@astrojs/vercel` 7.x maps unknown Node majors (e.g. **22**) to **`nodejs18.x`**, which Vercel may reject. After every Astro build that emits `.vercel/output`, `scripts/fix-vercel-node-runtime.mjs` (chained in `npm run build`) rewrites any `nodejs18.x` in `.vc-config.json` to **`nodejs20.x`**. In Vercel → Settings → General you can still set **20.x** so the build itself matches production.

5. **Redeploy** the project (rebuild so serverless picks up env vars).

6. **Smoke test** (replace host if yours differs):

   - `GET https://dumb-moneyy.vercel.app/api/waitlist` → `{"ok":true,"count":...}`
   - `POST` same URL with JSON body `{"email":"you@example.com"}` → `201` or `409` duplicate

   If **POST returns `405`**, the route is still being served as a static file: redeploy after pulling the latest code (`src/pages/api/waitlist.ts` must export `prerender = false` so Vercel runs it as a serverless function).

Local dev: copy [`.env.example`](.env.example) to `.env` with the same two variables, then `npm run dev`.

**Note:** Enabling **Integrations → Data API** in Supabase is not required for this flow; the Astro route uses the JS client with `SUPABASE_URL` + service role on the server only.

## Interaction System

Implemented in `index.astro` script:

- Ripple effect (`.ripple-container`)
- Reveal on scroll (`.reveal` + IntersectionObserver)
- Count-up numbers (`.count-up`)
- Nav hide/show on scroll direction
- Hero primary CTA smooth-scrolls to `#crime`
- Waitlist counter fetch from Supabase
- Waitlist submit with error/success states

## Design System

### Color direction
- `--bg` / `--bg-alt`: dark editorial base
- `--text` / `--muted`: high readability layers
- `--danger`: conflict emphasis
- `--intel` / `--amber`: intelligence/action accents

### Typography direction
- Editorial serif headline
- Mono body/data layer
- Sans UI for buttons and conversion controls

### Layout direction
- Mobile-first defaults
- Expansion at `@media (min-width: 48rem)`
- Reduced-motion handling included

## SEO and Public Assets

From `Base.astro`:
- canonical URL
- Open Graph + Twitter cards
- JSON-LD `SoftwareApplication`
- robots meta

Public files:
- `public/robots.txt`
- `public/llms.txt`
- `public/dumb-money-logo.png`
- `public/og-image.png`

## Legal Positioning

Footer and privacy copy explicitly state:
- this is an intelligence tool
- no financial advice
- no brokerage execution

## Run and Validate

```bash
npm install
npm run dev
npm run build
```

Recommended smoke checks:
- nav hides on scroll down, returns on scroll up
- hero CTA scrolls to crime section
- all sections reveal correctly
- numbers animate on scroll
- waitlist form submit success/failure paths
- `/privacy` route + footer links
# Frontend Documentation (Detailed)

This document describes the current frontend state of `Dumbmoney` in detail: architecture, sections, behavior, data flow, responsive rules, and operational notes.

## 1) Frontend Scope

Main frontend files:

- `src/pages/index.astro`
- `src/pages/privacy.astro`
- `src/layouts/Base.astro`
- `src/styles/global.css`
- `public/robots.txt`
- `public/llms.txt`
- `tailwind.config.mjs`

## 2) Architecture

- **Framework:** Astro 4
- **Rendering model:** Static pages with client-side script inside `index.astro`
- **Styling model:** Mobile-first semantic CSS in `global.css` with Tailwind integration available
- **Layout wrapper:** `Base.astro` (shared head/meta and global CSS import)

## 3) Routes

- `/` -> `src/pages/index.astro`
  - Marketing narrative + waitlist conversion funnel
- `/privacy` -> `src/pages/privacy.astro`
  - Privacy statement and contact info

## 4) Base Layout and SEO Layer

Implemented in `src/layouts/Base.astro`:

- Dynamic `<title>` and `<meta name="description">`
- Canonical URL via `Astro.url.href`
- Open Graph metadata
- Twitter card metadata
- `robots` meta
- JSON-LD (`SoftwareApplication`)
- Favicon

Supporting public files:

- `public/robots.txt` (crawler directives + sitemap URL)
- `public/llms.txt` (AI-readable project context)

## 5) Page Sections (`index.astro`)

Order and purpose:

1. **Sticky Nav (`.dm-nav`)**
   - Brand mark + anchor CTA to `#waitlist`

2. **Hero (`.hero`)**
   - Headline (`DUMB` / `MONey`)
   - Supporting copy + primary CTA
   - Background dollar mark
   - Scroll indicator
   - Side panel appears at larger breakpoint (`.hero-panel`)

3. **Problem (`.problem`)**
   - Core thesis: structural disadvantage for retail users

4. **Stats (`.stats-grid`)**
   - 4 data cards with count-up animation

5. **Charges (`.enemy`, `.crime-list`)**
   - Card-based narrative examples

6. **Proof (`.proof-grid`)**
   - Real cases (GameStop, Wirecard, Robinhood/FINRA)

7. **Manifesto (`.manifesto`)**
   - Brand positioning and movement voice

8. **Solution (`.solution-grid`)**
   - 3-pillar value proposition

9. **Waitlist (`#waitlist`)**
   - Form + status line + success state

10. **Footer (`.dm-footer`)**
    - Legal framing + links

## 6) Design Tokens and Style System

Defined in `src/styles/global.css`:

- **Colors:** `--acid`, `--navy`, `--coral`, `--cream`, `--cream-dark`, `--navy-2`
- **Typography:** `--mono`, `--serif`, `--h1`, `--h2`, `--body`
- **Spacing:** `--section-x`, `--section-y`

Core reusable classes:

- Layout: `.section`, `.section-light`, `.section-dark`, `.container`
- CTA: `.btn`, `.btn-small`, `.btn-dark`
- Hero: `.hero`, `.hero-inner`, `.hero-title-main`, `.hero-title-acid`, `.hero-panel`
- Cards: `.scard`, `.crime-card`, `.proof-card`, `.solution-card`
- Form: `.waitlist-form`, `.form-status`, `.success-wrapper`
- Footer: `.dm-footer`, `.footer-grid`, `.footer-links`

## 7) Interactions and Frontend Logic

Client logic lives at the bottom of `src/pages/index.astro`.

### 7.1 Ripple effect

- Binds click listeners to `.ripple-container`
- Inserts temporary `.ripple-effect` span at click coordinates
- Auto-removes after timeout

### 7.2 Reveal on scroll

- Uses `IntersectionObserver` on `.reveal`
- Adds `.visible` class when element enters viewport
- Unobserves after first reveal

### 7.3 Count-up animation

- Observes `.count-up` nodes
- Reads `data-target`
- Animates from 0 with eased progression

### 7.4 Waitlist counter read

- Triggered on load via `loadCounter()`
- Calls internal `GET /api/waitlist`
- Falls back to `-` on missing config or fetch failure

### 7.5 Waitlist submit

- Binds submit on `#waitlist-form`
- Sends `POST` to internal `/api/waitlist`
- Payload:
  - `email` (normalized to lowercase)
  - `what_they_expect`
  - `referrer`
- Success condition:
  - `response.ok` OR `response.status === 409`
- Error behavior:
  - shows message in `#form-status`
  - re-enables button

## 8) Environment Variables

Required for waitlist operations:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If missing, server API returns an explicit configuration error.

## 9) Responsive Strategy (Mobile-first)

Base styles (mobile) are declared as defaults.

Breakpoints:

- `@media (min-width: 48rem)`
  - Hero becomes 2-column
  - `hero-panel` becomes visible
  - grids expand to multiple columns
  - reveal transitions are enabled

- `@media (min-width: 64rem)`
  - `proof-grid` -> 3 columns
  - `solution-grid` -> 3 columns

Reduced motion support:

- `@media (prefers-reduced-motion: reduce)` minimizes animation/transition effects

## 10) Build/Run Notes

Standard commands:

- `npm install`
- `npm run dev`
- `npm run build`

Tailwind content scanning configured in:

- `tailwind.config.mjs`

## 11) Current Operational Status

- Frontend structure consolidated under `Dumbmoney`
- Privacy route present and linked
- SEO metadata layer present
- Waitlist flow has fallback/error handling
- Mobile-first hero and section system active
