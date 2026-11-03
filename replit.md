# Lughati Course App

An Arabic-first English-learning app with learner access, course progress, lessons, group chat, and a Supabase-backed admin console.

## Run & Operate

- `pnpm --filter @workspace/course-app run dev` — run the web app
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Supabase setup and SQL scripts: `artifacts/course-app/docs/supabase-setup.md` and `artifacts/course-app/supabase/`
- Required environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
- Keep `SUPABASE_SERVICE_ROLE_KEY` private and server-only; never give it a `VITE_` prefix.

## Stack

- React, Vite, TypeScript, Tailwind CSS, and Wouter
- Supabase Auth, database, storage, and realtime features
- Express API for short-lived protected course/chat media links
- OpenAPI + Orval for API types and validation

## Where things live

- `artifacts/course-app/src/` — learner and admin app
- `artifacts/course-app/supabase/` — Supabase schema, course, and chat SQL
- `artifacts/course-app/docs/supabase-setup.md` — environment and Supabase setup
- `lib/api-spec/openapi.yaml` — shared API contract
- `artifacts/api-server/src/routes/` — media signing and health routes

## Architecture decisions

- Supabase is the app's data and authentication provider; do not migrate its schema to the workspace PostgreSQL database.
- The browser receives only the Supabase URL and anon key; the API server uses the private service-role key for signing media links.
- Private media URLs are short-lived access controls, not DRM. A browser app cannot prevent operating-system screenshots or screen recordings.

## Product

Learners enter with an email and one-time access code, study course content, track progress, and participate in a shared community. Administrators manage learners, courses, lessons, and community settings.

## User preferences

- Supabase environment variables will be added manually by the user.
- Design the app for mobile phones first; keep desktop layouts usable.

## Gotchas

- Run the SQL scripts in the documented order before using Supabase-backed screens.
- `VITE_` values are included in the web bundle and must not contain private keys.

## Pointers

- `artifacts/course-app/docs/product-requirements.txt` — product scope
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
