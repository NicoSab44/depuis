# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## Depuis — Mobile App (`artifacts/time-case`)

Expo (React Native Web) app that tracks time elapsed since important dates.

### Features
- Add/edit/delete/reorder timers with label, date+time, and pastel color
- Smart time units: shows the 2 most significant units (hours+days → days+weeks → weeks+months → months+years)
- Dark/light/system theme with persistence
- French/English language with system detection
- No backend — data persisted in AsyncStorage (localStorage on web)

### Architecture
- **Deployment**: Static web export (`expo export --platform web`) served by Node.js (`server/serve.js`)
- **Data**: AsyncStorage key `@time_case_timers_v2`, settings key `@time_case_settings_v1`
- **State**: `TimersContext` (timers CRUD), `SettingsContext` (theme + language)
- **Hooks**: `useColors()` (stable memoized colors), `useNow()` (shared 60s interval singleton), `useTranslation()` (i18n)
- **i18n**: `constants/i18n.ts` — FR and EN translations, `getSystemLocale()` via `navigator.language`
- **TimerEntry interface**: `{ id, label, date (ISO string), color (hex) }`

### Important files
- `components/TimerCard.tsx` — timer display with elapsed time calculation
- `components/AddTimerSheet.tsx` — create/edit modal sheet
- `components/SettingsSheet.tsx` — theme + language picker
- `context/TimersContext.tsx` — CRUD operations
- `context/SettingsContext.tsx` — theme/language preferences
- `constants/i18n.ts` — all UI strings (FR/EN)
- `constants/colors.ts` — light/dark palette tokens
- `server/serve.js` — static file server with security headers
- `eas.json` — EAS Build profiles (development, preview APK, production AAB)

### Web-specific notes
- Date/time inputs use raw `<input type="date">` and `<input type="time">` HTML elements
- Delete confirmation uses `window.confirm()` instead of `Alert.alert()`
- Shadow uses `boxShadow` CSS property on web, native shadow props on iOS/Android

### Android build
- Package: `com.depuis.app`
- Build via EAS: `pnpm android:preview` (APK) or `pnpm android:build` (AAB for Play Store)
- Version: 1.0.0 / versionCode 1
