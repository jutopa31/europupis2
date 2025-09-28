# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

- Minimal Next.js app (App Router) for trip planning
- **CRITICAL**: Frontend UI text is Spanish-only; all new UI copy must be in Spanish
- Easy local dev and zero-config Vercel deploy
- Mock data phase (future: Supabase integration)

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

## Architecture

- **Framework**: Next.js 15+ (App Router), JavaScript (no TypeScript)
- **Styling**: Tailwind v4 via `@import "tailwindcss"` in globals.css + PostCSS + Autoprefixer
- **State Management**: React hooks (useState, useEffect) + custom useLocalStorage hook
- **Data Layer**: Mock services (`lib/services/`) with localStorage persistence; designed for future Supabase swap
- **Routing**: App Router with pages: `/` (countdown), `/tasks`, `/expenses`, `/cities`

## Key Config

- Trip date in `lib/tripConfig.js`
- Tailwind plugin configured in `postcss.config.js` (`tailwindcss`)

## Structure

```
app/
  layout.js         # Shell + global styles
  page.js           # Home (countdown)
  tasks/page.js     # Notas adhesivas
  expenses/page.js  # Registro de gastos
  cities/page.js    # Ciudades y ubicaciones
components/
  ui/               # Botones, inputs, etc.
lib/
  tripConfig.js
  hooks/
  mocks/
  services/
```

## Important Development Notes

- **Spanish UI**: Preserve Spanish UI copy and tone in all frontend text
- **Tailwind v4**: Avoid `@apply` with custom classes; use plain CSS when needed
- **Service Layer**: All data operations go through `lib/services/` for easy Supabase migration
- **Mock Data**: Lives in `lib/mocks/` and persists via localStorage using `useLocalStorage` hook
- **Theme**: Custom CSS variables in globals.css for brand colors and dark mode support
- **Keep minimal**: Prefer editing existing files over creating new ones

