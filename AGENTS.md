# Repository Guidelines

## Project Structure & Module Organization
- Next.js (App Router) with JavaScript.
- Source: `app/` (routes via `.../page.js`, layout in `app/layout.js`).
- UI: `components/` (PascalCase files), shared inputs in `components/ui/`.
- Client logic and mocks: `lib/` (`hooks/`, `mocks/`, `services/`, `tripConfig.js`).
- Data schema: `db/supabase.schema.sql`. Env template: `.env.local.example`.
- Styles: `app/globals.css` (Tailwind directives + tokens in `tailwind.config.js`).

## Build, Test, and Development Commands
- Install: `npm install` — installs Next.js, React and dev tooling.
- Dev: `npm run dev` — start local server at `http://localhost:3000`.
- Build: `npm run build` — production build.
- Start: `npm start` — run the production build locally.

## Coding Style & Naming Conventions
- Language: JS/JSX (no TypeScript). Indent 2 spaces; include semicolons.
- Filenames: pages `page.js`/`layout.js` (lowercase); components `PascalCase.jsx`.
- Imports use single quotes; JSX props use double quotes.
- React: functional components; keep components small and focused.
- CSS: prefer Tailwind utility classes; extend via `tailwind.config.js`. Use project tokens (e.g., `text-zinc-...`, `brand.*`).
- Texto UI: la interfaz está en español; conserva el idioma al añadir o modificar copys.

## Testing Guidelines
- No formal test framework configured. Perform manual checks:
  - Countdown renders and updates; reaches “Bon voyage!” at zero.
  - Tasks/Expenses/Cities pages add/remove items and persist via `useLocalStorage` when present.
- If adding tests, prefer Playwright for e2e and colocate under `tests/` (name: `*.spec.ts`/`*.spec.js`). Keep coverage pragmatic.

## Commit & Pull Request Guidelines
- Commits: imperative, concise, scoped. Prefer Conventional Commits where sensible:
  - Examples: `feat(tasks): add sticky note form`, `fix(expenses): correct total rounding`, `chore(ui): tweak brand colors`.
- PRs: clear description, linked issue, before/after screenshots for UI, and test/verification notes. Keep diffs focused; avoid unrelated refactors.

## Security & Configuration Tips
- Do not commit `.env.local`. Use `.env.local.example` as reference.
- For Supabase (Phase 2), set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Client-only by default; review any server/data changes for PII and keys.

## Agent-Specific Instructions
- Match existing patterns; do not rename files/paths without need.
- Keep patches minimal and reversible. Update docs when behavior changes.
