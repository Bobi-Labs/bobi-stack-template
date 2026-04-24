# CLAUDE.md — [Project Name]

## Project Overview

<!-- TODO: One paragraph describing your project, who it's for, and what it replaces. -->

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript / React
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Dates:** date-fns
- **Backend:** Supabase (PostgreSQL, Auth, RLS) — client-side SDK
- **Data Fetching:** TanStack React Query + Supabase browser client
- **Validation:** Zod (client-side, shared schemas)
- **Forms:** React Hook Form + @hookform/resolvers
- **Deployment:** Vercel (auto-deploy from GitHub on push to main)
- **Package Manager:** pnpm

## Database State

<!-- TODO: Fill in after creating your Supabase project -->

**Connection:** `https://your-project.supabase.co` — env vars in `.env.local`

| Table | Count | Notes |
|-------|-------|-------|
| `example` | 0 | TODO: Add your tables here |

## Commands

```bash
./ops.sh dev          # Start Next.js dev server (localhost:3000)
./ops.sh build        # Production build
./ops.sh install      # pnpm install
./ops.sh lint         # ESLint
./ops.sh typecheck    # TypeScript type checker (tsc --noEmit)
./ops.sh check        # Run lint + typecheck together
./ops.sh test         # Run vitest tests (data layer config validation)
./ops.sh deploy       # Deploy preview to Vercel
./ops.sh deploy prod  # Deploy to production
./ops.sh gen-types    # Regenerate Supabase DB types → lib/supabase/database.types.ts
./ops.sh env-pull     # Pull env vars from Vercel
./ops.sh clean        # Remove .next/ and out/
```

## Project Structure

```
app/
  globals.css              # Global styles — dark theme, custom CSS vars
  layout.tsx               # Root layout with providers
  page.tsx                 # Main entry point
  provider.tsx             # QueryClientProvider setup

components/
  pages/                   # Page-level view components
  ui/                      # shadcn/ui primitives (Button, Card, Input, etc.)

hooks/
  use-client-query.ts      # Type-safe query hook — enforces registry pairing
  use-client-mutation.ts   # Type-safe mutation hook — enforces registry + auto-invalidation

lib/
  query-keys.ts            # Centralized query key factories (shared by queries + mutations)
  utils.ts                 # cn() helper (clsx + tailwind-merge)
  queries/
    index.ts               # Query registry — pairs key factories with query functions
  mutations/
    index.ts               # Mutation registry — pairs fns with invalidation keys
  schemas/                 # Zod validation schemas (shared between forms & mutations)
  supabase/
    client.ts              # Browser Supabase client (createBrowserClient<Database>)
    server.ts              # Server Supabase client + admin client (bypasses RLS)
    database.types.ts      # Auto-generated DB types (./ops.sh gen-types)

__tests__/
  data-layer.test.ts       # Registry config validation (./ops.sh test)

docs/
  README.md                # Docs convention guide
  SUMMARY.md               # Table of contents

.claude/
  settings.json            # Claude Code permissions + hooks
  hooks/                   # Notification + status line scripts
  skills/                  # Auto-loaded reference + task-invocable skills

CLAUDE.md                  # ← THIS FILE
TODO.md                    # Backlog: tasks ranked by impact
ops.sh                     # Project CLI — single entry point for all operations
```

## Architecture

### Data Layer (Supabase + TanStack Query)

All data flows client-side through the Supabase browser SDK with the logged-in user's session. RLS policies enforce authorization at the database level.

**Reads:**
```
Component → useClientQuery("name") → registry → Supabase SDK → RLS → TanStack cache → render
```

**Writes:**
```
Form → React Hook Form + Zod → useClientMutation("name") → registry → Supabase SDK → RLS → auto-invalidate queries
```

Key files:
- **`lib/query-keys.ts`** — Centralized key factories, shared by reads and writes
- **`lib/queries/index.ts`** — Registry pairing keys with query functions
- **`lib/mutations/index.ts`** — Registry pairing mutation fns with invalidation keys
- **`hooks/use-client-query.ts`** — Type-safe read hook, enforces registry
- **`hooks/use-client-mutation.ts`** — Type-safe write hook, enforces registry + auto-invalidation
- **`lib/supabase/client.ts`** — Browser client typed with `Database` from generated types

DB types flow end-to-end: schema → generated types → SDK → query function → registry → hook → component.

### Adding a Query

Use `/new-query` to scaffold automatically:
```
/new-query users                                    # all columns, no params
/new-query users id,name,email                      # specific columns
/new-query users id,name --param teamId:string      # with filter param
```

### Adding a Mutation

Use `/new-mutation` to scaffold automatically:
```
/new-mutation create-user name:string email:string
/new-mutation update-user name:string --invalidates users
/new-mutation delete-user
```

## Conventions

- **TypeScript:** Strict typing. DB types auto-generated, never manual.
- **Components:** Page-level in `components/pages/`, primitives in `components/ui/`.
- **Styling:** Tailwind utility classes. shadcn/ui primitives. Dark mode default.
- **Touch targets:** 48px minimum on interactive elements for mobile.
- **Numbers:** Financial figures use `font-mono`.

## Key Workflows

### Docs

`docs/` is the single source of truth for institutional knowledge. See `docs/README.md`.

### TODO

`TODO.md` — Active backlog. Mark `[~]` pending, `[x]` done. Use `/todo` to manage.

### Skills

`.claude/skills/` — Auto-loaded reference skills + invocable task skills. Key skills:
- `cli-first` — CLI tools + env files for third-party services
- `supabase-query-system` — Read path: registry, key factories, TanStack Query
- `supabase-mutations` — Write path: Zod validation, mutation registry, auto-invalidation
- `/new-query` — Scaffold a new query (key + function + registry)
- `/new-mutation` — Scaffold a new mutation (schema + function + registry)

## What's Wired vs Mock

### Wired to Supabase (live data)

<!-- TODO: List features connected to live data -->

### Still Mock Data

<!-- TODO: List features still using placeholder data -->

## The prior template Updates

This project was scaffolded from the [the prior template template](https://github.com/the prior templatemd/prior-template). Periodically check for upstream updates — new skills, improved patterns, or bug fixes:

```bash
# Check what's changed since you last looked
git clone https://github.com/the prior templatemd/prior-template.git /tmp/prior-template-check
diff -rq .claude/skills/ /tmp/prior-template-check/kit/.claude/skills/
```

Key things to watch for:
- New or updated skills in `kit/.claude/skills/`
- Changes to `kit/.claude/settings.json` (hooks, permissions)
- New utility scripts in `kit/.claude/hooks/`

When updates exist, manually review and merge what's useful — don't blindly overwrite project-specific customizations.

## Current Phase

<!-- TODO: Add your phase checklist here -->
