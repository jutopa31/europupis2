# Europupis2 — Minimal Web App Architecture (Next.js)

A tiny travel-planning web app for a couple’s Europe trip. Built with Next.js so it runs locally with `npm run dev` and deploys to Vercel with zero config. Includes a countdown that says “Europupis starts in…” to 1 October, 15:00 hours, plus simple mock-driven Tasks/Sticky Notes, Expense Tracker, and Cities & Locations.

Note: The UI copy is localized to Spanish (frontend only). Data models and code identifiers remain in English for simplicity.

## Tech Choices

- Framework: Next.js (App Router, latest stable)
- Language: JavaScript (no TypeScript to keep it minimal)
- Styling: Global CSS (`app/globals.css`) + utility classes (Tailwind v4 via `@import "tailwindcss"` and PostCSS plugin)
- State/Data: React hooks (`useState`, `useEffect`); optional `useLocalStorage` custom hook for mock persistence
- Date math: Native `Date` + `setInterval` (no date libs)
- Deployment: Vercel (Next.js preset, zero-config)

## Folder Structure

```
Europupis2/
  app/
    layout.js             # Root layout (HTML shell + global styles)
    page.js               # Home page with countdown
    globals.css           # Minimal global styles
    tasks/page.js         # Tasks & Sticky Notes page (mock)
    expenses/page.js      # Expense Tracker page (mock)
    cities/page.js        # Cities & Locations page (mock)
  components/
    CountdownTimer.jsx    # Reusable countdown component
    TasksList.jsx         # Renders tasks/sticky notes
    StickyNote.jsx        # Single sticky note UI
    ExpenseList.jsx       # Renders expenses + add form
    CityList.jsx          # Renders cities & transfers
    CityCard.jsx          # Single city card UI
  lib/
    tripConfig.js         # Trip start date & constants
    hooks/
      useLocalStorage.js  # Optional: persist mock state locally
    mocks/
      tasksMock.js        # Mock tasks data
      expensesMock.js     # Mock expenses data
      citiesMock.js       # Mock cities data
    services/
      tasksService.js     # Mock service now; Supabase later
      expensesService.js  # Mock service now; Supabase later
      citiesService.js    # Mock service now; Supabase later
    supabaseClient.js     # Placeholder for phase 2 (real sync)
  public/
    favicon.ico           # App icon (placeholder ok)
    hero.jpg              # Optional hero image
  next.config.js          # (Optional) Next.js config, usually empty
  package.json            # Dev/build/start scripts
  README.md               # Quick start & deployment notes (optional)
```

Notes:
- Using the Next.js App Router keeps routing simple with `app/.../page.js` files.
- Phase 1 is entirely client-side with mock data; no API routes needed.
- Phase 2 will swap `lib/services/*` to use Supabase via `lib/supabaseClient.js`.

### Tailwind v4 setup
- `postcss.config.js` uses `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`.
- Avoid `@apply` to custom classes; when needed, use plain CSS to prevent build failures.
- Theme tokens (light/dark) live in `app/globals.css` using CSS variables.

## Features Overview

- Countdown Timer
  - Page/Component: `app/page.js` uses `components/CountdownTimer.jsx`
  - Target: 1 October, 15:00 hours (configure in `lib/tripConfig.js`)
  - UI text shown in Spanish (“Europupis comienza en…”, “¡Buen viaje!”)
- Tasks / Sticky Notes (Mock)
  - Page/Component: `app/tasks/page.js` uses `TasksList.jsx` + `StickyNote.jsx`
  - Data: `lib/mocks/tasksMock.js` via `lib/services/tasksService.js`
  - Later: Replace service calls with Supabase CRUD
- Expense Tracker (Mock)
  - Page/Component: `app/expenses/page.js` uses `ExpenseList.jsx`
  - Data: `lib/mocks/expensesMock.js` via `lib/services/expensesService.js`
  - Later: Replace service calls with Supabase CRUD and aggregations
- Cities & Locations (Mock)
  - Page/Component: `app/cities/page.js` uses `CityList.jsx` + `CityCard.jsx`
  - Data: `lib/mocks/citiesMock.js` via `lib/services/citiesService.js`
  - Later: Replace service calls with Supabase CRUD; add search logging

## Countdown Component

- `CountdownTimer.jsx`
  - Props: `targetDate` (ISO string or `Date`), `prefixText` (default: `"Europupis starts in…"`).
  - Behavior: Calculates remaining time every second and renders `Xd Xh Xm Xs`. Stops at zero and shows `"Bon voyage!"`.
  - Accessibility: `aria-live="polite"` for non-intrusive updates.

Example implementation (for reference):

```jsx
'use client';
import { useEffect, useState } from 'react';

function computeTimeLeft(target) {
  const now = new Date();
  const diff = Math.max(0, target - now);
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, done: diff === 0 };
}

export default function CountdownTimer({ targetDate, prefixText = 'Europupis starts in…' }) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(computeTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (timeLeft.done) return <p>Bon voyage! 🎉</p>;

  return (
    <p aria-live="polite">
      {prefixText} {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </p>
  );
}
```

Home page usage (`app/page.js`):

```jsx
import CountdownTimer from '../components/CountdownTimer';
import { TRIP_START_ISO } from '../lib/tripConfig';

export default function Page() {
  return (
    <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Europupis</h1>
      <p>A tiny hub for our Europe adventure.</p>
      <CountdownTimer targetDate={TRIP_START_ISO} />
    </main>
  );
}
```

`lib/tripConfig.js` (set the exact target):

```js
// 1 October, 15:00 hours. Adjust year/timezone as needed.
export const TRIP_START_ISO = '2025-10-01T15:00:00'; // local time
```

## Tasks / Sticky Notes (Mock Now, Supabase Later)

- UI Flow
  - List existing notes (title + text) and allow adding/editing/removing in-memory.
  - Optional: persist locally using `useLocalStorage` so mock data survives reloads.

- Components & Pages
  - `app/tasks/page.js` renders `TasksList` with data from `tasksService`.
  - `components/TasksList.jsx` handles list state and add/remove UI.
  - `components/StickyNote.jsx` renders a single note.

- Mock Data & Service
  - `lib/mocks/tasksMock.js` exports an array of notes.
  - `lib/services/tasksService.js` exposes async-like functions (`list`, `add`, `update`, `remove`) that currently wrap mock data and optionally localStorage.

- Phase 2: Supabase Integration Points
  - `lib/supabaseClient.js`: initialize Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Update `tasksService.js` methods to call Supabase (`from('tasks')...`).
  - Suggested table: `tasks(id uuid pk, title text, body text, created_at timestamptz, updated_at timestamptz)` with RLS.

## Expense Tracker (Mock Now, Supabase Later)

- UI Flow
  - Show a list of expenses (date, description, amount, paidBy, category), quick add form, and totals.
  - Keep state in-memory (optional localStorage) for phase 1.

- Components & Pages
  - `app/expenses/page.js` renders `ExpenseList` with `expensesService`.
  - `components/ExpenseList.jsx` includes list + add form and total summary.

- Mock Data & Service
  - `lib/mocks/expensesMock.js` exports an array of expenses.
  - `lib/services/expensesService.js` provides `list`, `add`, `remove`, and `summary`.

- Phase 2: Supabase Integration Points
  - Update `expensesService.js` to use Supabase table `expenses(id, date, description, amount numeric, paid_by text, category text, created_at)`.
  - Optional SQL views for summaries per person/category.

## Cities & Locations (Mock Now, Supabase Later)

- UI Flow
  - Show a list of cities with transfer info and notes.
  - Allow adding “searched info” notes per city in-memory.

- Components & Pages
  - `app/cities/page.js` renders `CityList` with `citiesService`.
  - `components/CityList.jsx` maps cities to `CityCard`.
  - `components/CityCard.jsx` displays city name, transfers, and a small form to add a note.

- Mock Data & Service
  - `lib/mocks/citiesMock.js` exports cities with `{ id, name, transfers: string[], notes: string[] }`.
  - `lib/services/citiesService.js` manages list and note additions using mock data.

- Phase 2: Supabase Integration Points
  - Table: `cities(id uuid, name text, created_at)` and `city_notes(id uuid, city_id uuid, body text, created_at)`; optional `city_transfers` table.
  - Update `citiesService.js` to query/insert via Supabase joins.

## Custom Hook (Optional) — `useLocalStorage`

- Purpose: Persist mock state without external dependencies.
- Location: `lib/hooks/useLocalStorage.js`
- API: `[value, setValue] = useLocalStorage(key, initialValue)`
- Usage: Wrap initial mock arrays to keep data after reload while staying client-only.

Example (for reference):

```js
import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);

  return [value, setValue];
}
```

## Libraries Used

- Next.js (includes React): routing, dev server, production build
- No additional libraries required for phase 1 (mock-only)
- Phase 2: `@supabase/supabase-js` for real-time data sync (optional)

## Supabase Integration Status

**✅ PARTIALLY IMPLEMENTED** (as of Session 2025-09-28)

### What's Done:
- ✅ `@supabase/supabase-js` dependency added
- ✅ `lib/supabaseClient.js` initialized and ready
- ✅ **Cities service** fully integrated with hybrid approach:
  - Auto-detects Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - Falls back to mock data if Supabase not configured or user not authenticated
  - Supports cities, city_notes, and city_transfers tables
- ✅ `.env.local.example` provided with sample configuration

### What's Pending:
- ⏳ Tasks service (still mock-only)
- ⏳ Expenses service (still mock-only)
- ⏳ Database schema deployment (`db/supabase.schema.sql`)
- ⏳ RLS policies setup

Schema: see `db/supabase.schema.sql` (includes tables, RLS, indexes).

Env template: `/.env.local.example` — copy to `.env.local` and fill.

### Hybrid Service Example (Cities - IMPLEMENTED):
```js
// lib/services/citiesService.js
import { supabase } from '../supabaseClient';

function envReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listCities() {
  try {
    if (!envReady()) return citiesMock;

    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return citiesMock;

    const { data, error } = await supabase
      .from('cities')
      .select(`id, name, origin, arrival_datetime, city_notes(body), city_transfers(info)`)
      .order('arrival_datetime', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || citiesMock;
  } catch {
    return citiesMock; // Graceful fallback
  }
}
```

## Configuration

- `package.json` scripts:
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "next": "latest",
      "react": "latest",
      "react-dom": "latest"
    }
  }
  ```

- `next.config.js` (optional):
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {};
  module.exports = nextConfig;
  ```

## Local Development

- Prereqs: Node 18+ and npm
- Steps:
  - `npm install`
  - `npm run dev`
  - Open `http://localhost:3000`

## Deploying to Vercel

- Push the repo to GitHub/GitLab/Bitbucket.
- In Vercel, import the repo.
- Framework Preset: Next.js (auto-detected)
- Build Command: `next build` (default)
- Output: handled automatically by Vercel for Next.js
- Click Deploy — no extra config needed.

## Testing Basics

- Manual checks:
  - Home shows a countdown to 1 October, 15:00 (from `TRIP_START_ISO`).
  - Tasks/Expenses/Cities pages render mock data and allow adding items/notes in-memory.
  - Optional: `useLocalStorage` keeps mock state across refreshes.

---

This plan stays minimal for phase 1 (mock-only) to keep setup and deployment simple. Phase 2 swaps the `lib/services/*` implementations to Supabase without changing page/component structure.

## Phase 3 — UI Output Agent (Polish the Frontend)

- Goal: Upgrade visuals/UX and address rough edges by introducing a style system and component library, driven by a repeatable agent workflow.

- Proposed Stack (Phase 3):
  - Styling: Tailwind CSS + CSS variables for theme tokens
  - Components: Radix UI primitives + optional shadcn/ui for common patterns
  - Navigation: Replace `<a>` with `next/link` for client routing
  - Forms: Client validation with lightweight patterns; accessible labels

- Agent Workflow
  - Inputs: Current pages/components, design tokens (colors/spacing/typography), acceptance criteria (a11y, responsiveness), and a diff-friendly prompt.
  - Output: A patch that adds Tailwind config, updates components to consistent layouts, and improves semantics/accessibility.
  - Review: Run locally (`npm run dev`) and visually verify across pages.

- Concrete Steps
  1) Install Tailwind: `npx tailwindcss init -p` and wire into `app/globals.css`
  2) Add tokens: update Tailwind config (colors, font, spacing) and base styles
  3) Replace inline styles with classes; unify layout grids/cards
  4) Introduce shared UI: `components/ui/Button`, `Card`, `Input`, `Textarea`
  5) Swap nav to `next/link`; add active state and header/footer
  6) Optional theming: dark/light with CSS variables
  7) Accessibility pass: labels, roles, keyboard focus, `aria-*`

- Acceptance Criteria
  - Pages responsive on mobile and desktop
  - No console errors, Lighthouse a11y ≥ 90
  - Consistent spacing/typography and interactive states

Note: Phase 3 focuses on look-and-feel; data flow remains unchanged from Phase 2.
