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

## Backlog: Features

- [ ] **Data-sync rule for the stack's conventions:** a field the upstream source may fill in or change later never belongs in a dedupe or identity key. A sync that skips rows "by key" will double-count when the source back-fills that field. Add this to the data-layer skill, with a test that replays a back-filled row.

- [ ] **Kickoff friction, from a dry run of the "someone invited me" path (2026-10-27):**
  - The welcome says "about 20 to 40 minutes" and the paths picture says "ready in minutes". Make them agree.
  - "Copy from `.claude/memory-templates/`" doesn't say whether it means the kickoff folder's or the project's; both exist. Name the folder.
  - On a Mac, `code --version` fails until "Install 'code' command in PATH" is run, so the kickoff offers to install VS Code again. Check for the app first and give the PATH step.
  - The memory-folder example is Windows-style (`C--...`). Add the Mac form (`-Users-<name>-dev-<project>`).
  - A run from an account that already has `~/.bobi-stack/kickoff-progress.md` offers to resume. Fine for real users; say how to start fresh.
  - The invited path can't clone until the invite is accepted. Before cloning, check access and say "accept the invite first" instead of a raw clone error.

- [ ] Replace this with your first real task
