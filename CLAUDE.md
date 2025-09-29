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

## Repository

- **GitHub**: https://github.com/jutopa31/europupis2
- **Deploy**: Import GitHub repo to Vercel (Next.js auto-detected)

## Architecture

- **Framework**: Next.js 15+ (App Router), JavaScript (no TypeScript)
- **Styling**: Tailwind v4 via `@import "tailwindcss"` in globals.css + PostCSS + Autoprefixer
- **State Management**: React hooks (useState, useEffect) + custom useLocalStorage hook
- **Data Layer**: Hybrid services (`lib/services/`) - Supabase when configured + env vars present, falls back to mock + localStorage
- **Routing**: App Router with pages: `/` (countdown), `/tasks`, `/expenses`, `/cities`, `/pantu-investiga`

## Key Config

- **Trip date**: `lib/tripConfig.js` (Oct 1, 2025 at 15:00)
- **Tailwind**: Plugin configured in `postcss.config.js` (`tailwindcss`)
- **Supabase**: Optional env vars in `.env.local` (copy from `.env.local.example`)

## Structure

```
app/
  layout.js              # Shell + global styles
  page.js                # Home (countdown)
  tasks/page.js          # Notas adhesivas
  expenses/page.js       # Registro de gastos
  cities/page.js         # Ciudades y ubicaciones
  pantu-investiga/page.js # Tablero de investigación con notas libres
components/
  ui/                    # Botones, inputs, etc.
  ResearchBoard.jsx      # Tablero de notas de investigación
  StickyNote.jsx         # Componente de nota adhesiva
lib/
  tripConfig.js
  hooks/
  mocks/
  services/
    researchService.js   # Servicio para notas de investigación
```

## Important Development Notes

- **Spanish UI**: Preserve Spanish UI copy and tone in all frontend text
- **Tailwind v4**: Avoid `@apply` with custom classes; use plain CSS when needed
- **Service Layer**: All data operations go through `lib/services/` - hybrid approach with Supabase + fallback
- **Mock Data**: Lives in `lib/mocks/` and persists via localStorage using `useLocalStorage` hook
- **Supabase Integration**: Cities service already integrated; auto-detects env vars and user auth
- **Theme**: Mediterranean color scheme with blue brand colors and terracotta/amber accents in globals.css
- **Design**: Enhanced backgrounds with subtle gradients and decorative elements (cat image in Pantu Investiga)
- **Keep minimal**: Prefer editing existing files over creating new ones

