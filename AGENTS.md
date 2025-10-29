# Repository Guidelines

## Project Structure & Module Organization
Type-CN runs on Next.js App Router with Supabase. Routes, layouts, and server actions sit in `app/` (`auth`, `dashboard`, `lesson`, `payment`). Reusable UI belongs in `components/` feature folders such as `components/landing`. Keep utilities and Supabase clients in `lib/`, database artifacts in `drizzle/`, static assets in `public/`, and ancillary docs or automation scripts inside `docs/` and `scripts/`.

## Build, Test, and Development Commands
Use pnpm everywhere. `pnpm dev` starts the Turbopack dev server, `pnpm build` compiles production assets, and `pnpm start` serves the generated `.next/` output. `pnpm lint` runs the ESLint ruleset and is required before committing. Database helpers: `pnpm db:generate` diffs schema into SQL, `pnpm db:migrate` applies migrations locally, `pnpm db:push` syncs directly to Supabase, `pnpm db:seed` runs `scripts/setup-db.ts`, and `pnpm db:studio` opens the Drizzle dashboard.

## Coding Style & Naming Conventions
Write components in TypeScript; prefer server components and add `"use client"` only when hooks demand it. Name files in kebab-case, exported components in PascalCase, and hooks in camelCase. Use Tailwind utilities in layout→spacing→color order and lean on `class-variance-authority` and `tailwind-merge` for variant-heavy UI. Preserve the two-space indentation and rely on `pnpm lint --fix` for formatting.

## Testing Guidelines
Automated tests are not enabled yet. Before committing, exercise key flows (auth, lesson typing, dashboard streak, payment) plus `pnpm lint`. When adding coverage, colocate `*.test.tsx` beside the feature, mock Supabase sessions, and document the run command so future CI wiring stays obvious.

## Commit & Pull Request Guidelines
Keep commits small and imperative (e.g., `Tighten lesson error handling`) and reference issue IDs or brief context in the body. PRs must summarize the intent, list validation commands, and include screenshots or recordings for visible work. Call out schema changes, env var additions, or data migrations in a short “Deployment notes” block so reviewers can stage Supabase updates safely.

## Environment & Data Layer Notes
Duplicate `.env.example` to `.env.local`, then fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Store Supabase service keys only in Vercel/Supabase dashboards, never in Git. Drizzle reads connection details from `drizzle.config.ts`; always regenerate migrations rather than hand-edit SQL and commit the SQL plus `drizzle/meta` pair together. Coordinate `db:push` usage in Slack to avoid clobbering teammates.
