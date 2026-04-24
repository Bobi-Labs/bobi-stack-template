# CLAUDE.md — {{PROJECT_NAME}}

> **Template file.** Replace `{{PLACEHOLDERS}}` with project-specific content.
> Delete this blockquote once filled in.

## ⚠️ Session-start checklist — READ THIS FIRST, EVERY TIME

The #1 cause of unproductive sessions is skipping the context load. Before touching code or client-facing output:

1. **Read `~/.claude/projects/{{PROJECT_DIR_SLUG}}/memory/session_history.md` in full.** It's the briefing. It tells you what's shipped, what went wrong in prior sessions, and where the full chat archive lives.
2. **Open and read every memory file the session history points to** — `feedback_*.md`, `project_*.md`, `user_*.md`, `reference_*.md`. The `MEMORY.md` index is a table of contents, not a briefing.
3. **Read `docs/` files relevant to current work** + `TODO.md`. These are live sources of truth for what's in flight.
4. **Run a health check** before touching anything client-visible: build passes, typecheck status known, deploy healthy.
5. **Summarize current state back to the user before proposing changes.** If you can't summarize it, you haven't read enough.
6. **One batch = one chat.** Long chats degrade. When a batch of work commits cleanly, end the session and start fresh.
7. **Never bundle "while I'm at it" fixes.** One commit per logical change.

If anything in this file conflicts with a memory file, **the memory file wins** — memory files are the record of lessons learned; CLAUDE.md is a summary that can drift.

## Project Overview

{{PROJECT_OVERVIEW_PARAGRAPH}}

<!-- One paragraph: who it's for, what it replaces/builds, current phase. -->

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

<!-- Add project-specific stack items here (charts, maps, specific APIs, etc.) -->

## Database State

**Connection:** `https://{{SUPABASE_PROJECT_REF}}.supabase.co` — env vars in `.env.local`

<!-- Fill in after creating Supabase project. Keep the table refreshed periodically. -->

| Table | Count | Notes |
|-------|-------|-------|
| `example` | 0 | TODO |

**RLS:** {{RLS_STATE}} <!-- e.g., "dev_anon_read policies for open SELECT during dev. Tightened auth coming in Phase X." -->

## Commands

```bash
./ops.sh dev          # Start Next.js dev server (localhost:3000)
./ops.sh build        # Production build
./ops.sh install      # pnpm install
./ops.sh lint         # ESLint
./ops.sh typecheck    # TypeScript type checker (tsc --noEmit)
./ops.sh check        # Run lint + typecheck together
./ops.sh test         # Run vitest tests
./ops.sh deploy       # Deploy preview to Vercel
./ops.sh deploy prod  # Deploy to production
./ops.sh gen-types    # Regenerate Supabase DB types → lib/supabase/database.types.ts
./ops.sh env-pull     # Pull env vars from Vercel
./ops.sh clean        # Remove .next/ and out/
```

### Drive CLI (opt-in)

If the project uses Google Drive:

```bash
node scripts/drive-cli.mjs <cmd> [args]   # Interactive Drive inspection / safe mutations
# commands: roots, list, tree, find, get, path, mkdir, trash, untrash, rm --yes
```

### Test suite (opt-in)

If `/api/tests/run` is wired to a daily Vercel Cron:

```bash
# Manual dry-run against production (no email):
SECRET=$(grep -oP 'CRON_SECRET=\K[^"\s]+' .env.local)
curl -sS -H "Authorization: Bearer $SECRET" \
  "https://{{PRODUCTION_DOMAIN}}/api/tests/run?noEmail=1" | jq

# Manual full run with email:
curl -sS -H "Authorization: Bearer $SECRET" \
  "https://{{PRODUCTION_DOMAIN}}/api/tests/run" | jq
```

Tests live in `lib/tests/`. See `lib/tests/_runner.ts` for the module list and `lib/tests/_email.ts` for the report format.

### Sharing images with Claude

Two paths, both lean on chat context:

**Option A — local file drop.** Drop screenshots into `.screenshots/` (gitignored). Tell Claude the filename or "latest" — Claude uses the Read tool on the path directly.

**Option B — Google Doc.** Paste images into a doc shared with the project's service account (Editor). Then:

```bash
node scripts/pull-doc-images.mjs <docId>
# → .screenshots/from-doc-<shortId>/image1.png, image2.png, …
```

Claude then Reads the files out of that folder. Option B works cross-machine since images live in Drive.

## Project Structure

```
app/
  globals.css            # Dark theme, custom CSS vars
  layout.tsx             # Root layout with providers
  page.tsx               # Entry point
  provider.tsx           # QueryClientProvider setup
  api/                   # API routes

components/
  pages/                 # Page-level view components
  ui/                    # shadcn/ui primitives

hooks/
  use-client-query.ts    # Type-safe query hook (registry-paired)
  use-client-mutation.ts # Type-safe mutation hook (registry + auto-invalidation)

lib/
  query-keys.ts          # Centralized query key factories
  queries/               # Read functions + index registry
  mutations/             # Write functions + index registry
  schemas/               # Zod schemas (shared by forms + mutations)
  supabase/
    client.ts            # Browser Supabase client (createBrowserClient<Database>)
    server.ts            # Server Supabase client + admin client (bypasses RLS)
    database.types.ts    # Auto-generated DB types (./ops.sh gen-types)
  utils.ts               # cn() helper

scripts/                 # (opt-in) Drive CLI, doc pullers, seed scripts
lib/tests/               # (opt-in) Daily test suite harness

docs/
  README.md              # Docs conventions
  calls/                 # Parsed call notes (one per call)
  ...                    # Domain + architecture docs

.claude/
  skills/                # Project conventions + slash commands
  memory-templates/      # Reference memory files for /~/.claude/projects/.../memory/

CLAUDE.md                # ← THIS FILE
TODO.md                  # Backlog + blockers + future phase items
README.md                # Repo readme
ops.sh                   # Project CLI
```

## Architecture

### Data Layer (Supabase + TanStack Query)

Reads and writes flow through registries paired with typed hooks:

**Reads:**
```
Component → useClientQuery("name") → registry → Supabase SDK → RLS → TanStack cache → render
```

**Writes:**
```
Form → React Hook Form + Zod → useClientMutation("name") → registry → Supabase SDK → RLS → auto-invalidate queries
```

Key files:
- `lib/query-keys.ts` — Centralized key factories, shared by reads and writes
- `lib/queries/index.ts` — Registry pairing keys with query functions
- `lib/mutations/index.ts` — Registry pairing mutation fns with invalidation keys
- `hooks/use-client-query.ts` — Read hook, enforces registry
- `hooks/use-client-mutation.ts` — Write hook, enforces registry + auto-invalidation

DB types flow end-to-end: schema → generated types → SDK → query fn → registry → hook → component. No manual type definitions for DB data.

### Role System

<!-- Fill in per-project. Example below from a typical multi-role client app. -->

| Role | Sees | Hard Restriction |
|------|------|------------------|
| Admin | Everything | — |
| {{Role2}} | {{Scope}} | {{Restriction}} |

### Two-tenant / Multi-company (optional)

<!-- If the project has multiple tenants sharing one DB, document the filtering rule here. Otherwise delete this section. -->

## Conventions

- **TypeScript:** Strict typing.
- **Components:** One component per file (exceptions documented).
- **Styling:** Tailwind utility classes. shadcn/ui primitives.
- **Numbers:** Financial figures use `font-mono`.
- **No hardcoded strings** for enums or lookup values — source from DB or config.

## Current Phase

<!-- Running checklist of what's shipped + what's in flight. Keep refreshed. -->

- [ ] Phase 1 — core scaffold
- [ ] Phase 2 — feature set A
- [ ] Phase 3 — feature set B

## Known Issues

<!-- Ongoing list of things that work but have rough edges. Update as they're addressed. -->

- None yet

## What's Wired vs Mock

### Wired (live data)

<!-- -->

### Still Mock

<!-- -->

## Key Workflows

### Docs

`docs/` is the source of truth. Update as conventions evolve. `docs/calls/` holds parsed call notes — see `docs/calls/README.md`.

### TODO

`TODO.md` — Active backlog + blocked items + future phase items. Mark `[~]` pending, `[x]` done.

### Skills

`.claude/skills/` — auto-loaded reference skills + invocable task skills.

**Active reference skills (auto-load in Claude Code):**

- `cli-first` — CLI tools + env files for third-party services
- `the prior template` — Docs, TODO, ops.sh workflow conventions
- `supabase-query-system` — Read path
- `supabase-mutations` — Write path

**Invocable slash commands:**

- `/new-query <table> [cols]` — generate a new query + registry entry
- `/new-mutation <action-table> [fields]` — generate a new mutation + registry entry

## Memory

`~/.claude/projects/{{PROJECT_DIR_SLUG}}/memory/` holds lessons learned across sessions. **Before any client-facing work, read these.**

Starter memory files live at `.claude/memory-templates/` in this repo — copy them into the Claude memory folder when setting up the project for the first time. See that folder's `README.md` for how to use them.

Key memory categories:

- `session_history.md` — briefing for future sessions (what shipped, where chat archives live)
- `feedback_*.md` — lessons about how to communicate + what the client/team values
- `project_*.md` — current state notes that don't belong in committed docs (blocked items, DB state as-of-a-date, etc.)
- `user_*.md` — communication style + dynamics for specific people
- `reference_*.md` — credentials, test accounts, API keys (only what's safe to store locally)
