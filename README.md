# Bobi Stack Template

> Project-agnostic starter kit + workflow conventions for Claude Code sessions.
> Seeded from The prior template; evolved through production client work.

## Two use cases

### 1. Start a new project

See [`docs/starting-a-new-project.md`](docs/starting-a-new-project.md).

Short version: clone this folder, rename, fill in the placeholders in
`CLAUDE.md`, set up Supabase + Vercel + Resend, adopt the conventions,
ship.

### 2. Bring an existing project up to these conventions

See [`docs/migrating-an-existing-project.md`](docs/migrating-an-existing-project.md).

Short version: open the target project in Claude Code, paste the
migration prompt, let Claude audit + propose deltas, approve what
fits, skip what doesn't.

## What's in here

**Stack scaffolding** (Next.js 14 + Supabase + TanStack Query + Tailwind +
shadcn/ui + Vercel + pnpm). Opt in as needed — the scaffold assumes the
full stack, but the workflow conventions are stack-agnostic.

**Workflow conventions** (stack-agnostic, always useful):

- `CLAUDE.md` — session-start checklist + project instructions pattern
- `.claude/memory-templates/` — memory file conventions (feedback /
  project / user / reference categories + MEMORY.md index)
- `docs/calls/` — parsed call notes convention (raw in `.transcripts/`
  gitignored, parsed committed)
- `.screenshots/` — image-sharing convention for Claude sessions
- Principle files — fail-loudly / mutual-check-in / invoice-language /
  client-facing-quality, all generic, all battle-tested

**Tooling** (opt-in, only if the project needs it):

- `scripts/lib/drive.mjs` + `drive-cli.mjs` — Google Drive helpers
  (service account + env-based config)
- `scripts/pull-doc-images.mjs` — pull images from a Google Doc into
  `.screenshots/` so Claude can read them without chat bloat
- `scripts/extract-docx-text.mjs` — quick text extraction from `.docx`
- `lib/tests/` + `/api/tests/run` — daily test suite harness pattern
  (synthetic end-to-end tests + health checks + Resend email report)

**Claude skills** (invocable via `/<skill>` in Claude Code):

- `cli-first` — prefer CLI tools + env vars for third-party services
- `supabase-mutations` — write-path convention (Zod + registry + RHF)
- `supabase-query-system` — read-path convention (registry + TanStack)
- `new-query` / `new-mutation` — code generators
- `docs` / `the prior template` / `todo` — doc + project conventions
- `bosskey` / `lsp` / `squad` — orchestration helpers

## Quick Start (new project)

```bash
# Clone
git clone <this-template> my-project && cd my-project && rm -rf .git
git init -b main

# Environment
cp .env.example .env.local    # fill in Supabase credentials
./ops.sh install              # pnpm install
./ops.sh dev                  # localhost:3000

# First session with Claude
# → fill in CLAUDE.md placeholders (project name, overview, tech stack
#   additions, domain notes)
# → copy .claude/memory-templates/ into your Claude memory folder at
#   ~/.claude/projects/<project-dir>/memory/
# → read docs/starting-a-new-project.md for the full walkthrough
```

## Project CLI

All operations go through `ops.sh`:

```bash
./ops.sh dev          # Dev server
./ops.sh build        # Production build
./ops.sh check        # Lint + typecheck
./ops.sh test         # Run tests
./ops.sh deploy       # Deploy preview
./ops.sh deploy prod  # Deploy production
./ops.sh gen-types    # Regenerate Supabase DB types
./ops.sh help         # See all commands
```

## Philosophy (short version)

- **Push back honestly.** If Claude (or you) sees a better path, say
  it — product robustness beats being agreeable. See
  `.claude/memory-templates/feedback_mutual_check_in.md`.
- **Fail loudly in client-facing steps.** Silent failures erode trust
  fastest. Every user-triggered action that can fail must surface a
  plain-English reason + path forward. See
  `.claude/memory-templates/feedback_error_handling.md`.
- **One commit per logical change.** No "while I'm at it" bundling.
- **Memory files are lessons learned, not summaries.** The memory
  folder captures what was hard-won; CLAUDE.md captures current
  project state. Different purposes.
- **Start fresh chats for new batches of work.** Long chats degrade.
  Memory carries forward what matters; chat context doesn't need to.

## Versioning

This template evolves. Each substantial pattern addition bumps the
minor version. Projects that adopted v1.x can selectively pull in
v1.y+1 patterns via the migration prompt.

Current: **v2.0** (2026-04)
