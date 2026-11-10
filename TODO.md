<!-- When prompted, complete tasks from the list below.
     Before starting work, mark the item as pending [~] so parallel agents don't collide. -->

## Backlog: Setup

- [ ] Run /bobi-stack to auto-fill CLAUDE.md with real project data
- [ ] Create Supabase project and add env vars to .env.local
- [ ] Run ./ops.sh gen-types to generate database types
- [ ] Add first query with /new-query
- [ ] Add first mutation with /new-mutation
- [ ] Set up Vercel project and deploy preview
- [ ] Configure RLS policies in Supabase

- [x] **Clear the Dependabot alerts:** 13 open on 2026-11-10 (4 critical, 5 high, 3 moderate, 1 low). Every new project copies them. Bump with pnpm, pass check, test and build, push to both remotes, read the CI, and leave the `kickoff` tag alone. Done 2026-11-10: Next 16.4.6, Zod 4, resolvers 5, Vite 8.3.7 (see CHANGELOG).

- [ ] **Decide whether to move the `kickoff` pin past the dependency fix.** It still points at 9d49f8a, which has Next 16.3.8 with two critical RCEs, so anyone who starts from the kickoff prompt gets the old lockfile until the pin and `site/start/` move.

- [ ] **Clear the minimatch advisory once the TypeScript ESLint parser allows minimatch 11** (GHSA-g3hv-75wg-m249, moderate, dev only). `pnpm audit` reports it; Dependabot had not as of 2026-11-10. Retry `pnpm update` when `@typescript-eslint/typescript-estree` widens its range, rather than forcing an override across a major.

## Backlog: Features

- [ ] **Data-sync rule for the stack's conventions:** a field the upstream source may fill in or change later never belongs in a dedupe or identity key. A sync that skips rows "by key" will double-count when the source back-fills that field. Add this to the data-layer skill, with a test that replays a back-filled row.

- [ ] **Kickoff friction, from a dry run of the "someone invited me" path (2026-10-27):**
  - The welcome says "about 20 to 40 minutes" and the paths picture says "ready in minutes". Make them agree.
  - "Copy from `.claude/memory-templates/`" doesn't say whether it means the kickoff folder's or the project's; both exist. Name the folder.
  - On a Mac, `code --version` fails until "Install 'code' command in PATH" is run, so the kickoff offers to install VS Code again. Check for the app first and give the PATH step.
  - The memory-folder example is Windows-style (`C--...`). Add the Mac form (`-Users-<name>-dev-<project>`).
  - A run from an account that already has `~/.bobi-stack/kickoff-progress.md` offers to resume. Fine for real users; say how to start fresh.
  - [x] The invited path can't clone until the invite is accepted. Before cloning, check access and say "accept the invite first" instead of a raw clone error. (Done 2026-11-10, after a real run made a repo of its own.)
  - Add a dry run of path 1 from an account with **no access** (invite expired or never accepted). Passing means it stops and asks for a new invite, and creates nothing.

- [ ] **Upkeep is never a question:** add to the scaffold's CLAUDE.md that a session updates the records it owns (docs, TODO, memory) in the same turn something changes, and asks only what is the owner's to answer, with each question standing on its own (the decision, the options, a recommendation, the default). Machines without a user-level CLAUDE.md get it only from here (2026-10-29).

- [ ] Replace this with your first real task
