# CLAUDE.md: {{PROJECT_NAME}}

> **Template file.** Replace `{{PLACEHOLDERS}}` with project-specific content.
> Delete this blockquote once filled in.

## ⚠️ Session-start checklist: READ THIS FIRST, EVERY TIME

The #1 cause of unproductive sessions is skipping the context load. Before touching code or client-facing output:

1. **Read `~/.claude/projects/{{PROJECT_DIR_SLUG}}/memory/session_history.md` in full.** It's the briefing. It tells you what's shipped, what went wrong in prior sessions, and where the full chat archive lives.
2. **Open and read every memory file the session history points to**: `feedback_*.md`, `project_*.md`, `user_*.md`, `reference_*.md`. The `MEMORY.md` index is a table of contents, not a briefing.
3. **Read `docs/` files relevant to current work** + `TODO.md`. These are live sources of truth for what's in flight.
4. **Run `./ops.sh check-integrity`.** Mechanical drift detector for permanent ongoing obligations: unfiled call transcripts, stale `handoff_note.md` / `session_history.md`. Resolve anything it flags before starting work. This catches the gaps that relevance-gated context loading structurally misses.
5. **Run a health check** before touching anything client-visible: build passes, typecheck status known, deploy healthy.
6. **Summarize current state back to the user before proposing changes.** If you can't summarize it, you haven't read enough.
7. **One batch = one chat.** Long chats degrade. When a batch of work commits cleanly, end the session and start fresh.
8. **Never bundle "while I'm at it" fixes.** One commit per logical change.

If anything in this file conflicts with a memory file, **the memory file wins**. Memory files are the record of lessons learned; CLAUDE.md is a summary that can drift.

## ⚠️ Session-END checklist: DO THIS BEFORE THE CHAT CLOSES

The #1 cause of cross-chat knowledge loss is a permanent obligation with no end-of-session trigger. Relevance-gated context loading cannot catch obligations that aren't relevant to today's task, so they get caught here, at the boundary, every time. When a batch of work is committed and the session is wrapping:

1. **File any new call transcripts.** Raw → `.transcripts/YYYY-MM-DD-slug.txt` (gitignored), parse the load-bearing ones → `docs/calls/YYYY-MM-DD-slug.md`, add a row to `docs/calls/INDEX.md`. See `docs/calls/README.md`. `./ops.sh check-integrity` tells you what's unfiled.
2. **Update `handoff_note.md`** if project state changed. It's the next chat's first read. Bump its `lastWritten`.
3. **Update `session_history.md`** if a meaningful arc completed (shipped feature, scope change, new lesson).
4. **Update `TODO.md`**: mark done `[x]`, add anything discovered.
5. **Capture new lessons into memory** (`feedback_*` / `project_*` / `user_*`): anything learned the hard way this session that a future chat must not relearn.
6. **Push.** `git push`. Committed is not shipped: work stacks in front of code that never
   left the machine, other sessions read a repo that disagrees with your reality, and a
   disk failure costs everything since the last push. A session that ends with unpushed
   commits has not ended, it has stopped.
7. **Re-run `./ops.sh check-integrity`.** It should come back clean, and it now fails on
   unpushed commits, a missing upstream, or no remote. If it doesn't come back clean,
   you're not done.

## Project Overview

{{PROJECT_OVERVIEW_PARAGRAPH}}

<!-- One paragraph: who it's for, what it replaces/builds, current phase. -->

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript / React
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Dates:** date-fns
- **Backend:** Supabase (PostgreSQL, Auth, RLS) via the client-side SDK
- **Data Fetching:** TanStack React Query + Supabase browser client
- **Validation:** Zod (client-side, shared schemas)
- **Forms:** React Hook Form + @hookform/resolvers
- **Deployment:** Vercel (auto-deploy from GitHub on push to main)
- **Package Manager:** pnpm

<!-- Add project-specific stack items here (charts, maps, specific APIs, etc.) -->

## Database State

**Connection:** `https://{{SUPABASE_PROJECT_REF}}.supabase.co` (env vars in `.env.local`)

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

**Option A, local file drop.** Drop screenshots into `.screenshots/` (gitignored). Tell Claude the filename or "latest". Claude uses the Read tool on the path directly.

**Option B, Google Doc.** Paste images into a doc shared with the project's service account (Editor). Then:

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
- `lib/query-keys.ts`: Centralized key factories, shared by reads and writes
- `lib/queries/index.ts`: Registry pairing keys with query functions
- `lib/mutations/index.ts`: Registry pairing mutation fns with invalidation keys
- `hooks/use-client-query.ts`: Read hook, enforces registry
- `hooks/use-client-mutation.ts`: Write hook, enforces registry + auto-invalidation

DB types flow end-to-end: schema → generated types → SDK → query fn → registry → hook → component. No manual type definitions for DB data.

### Role System

<!-- Fill in per-project. Example below from a typical multi-role client app. -->

| Role | Sees | Hard Restriction |
|------|------|------------------|
| Admin | Everything | None |
| {{Role2}} | {{Scope}} | {{Restriction}} |

### Two-tenant / Multi-company (optional)

<!-- If the project has multiple tenants sharing one DB, document the filtering rule here. Otherwise delete this section. -->

## Conventions

- **TypeScript:** Strict typing.
- **Components:** One component per file (exceptions documented).
- **Styling:** Tailwind utility classes. shadcn/ui primitives.
- **Numbers:** Financial figures use `font-mono`.
- **No hardcoded strings** for enums or lookup values. Source them from DB or config.

### Commits

The git log is documentation. It should read as a narrative, not a pile of squashed mega-commits.

- **Atomic.** One logical change per commit. Reinforces the Session-START rule "never bundle while-I'm-at-it fixes."
- **Conventional prefix.** `type(scope): imperative summary`. Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, `test`, `scaffolding`. Scope optional.
- **Subject says what, body says why.** The body is for the reasoning a future reader needs, not a restatement of the diff.
- **No em dashes in messages** (the `/prose` skill binds commit text too). Use commas, colons, periods.
- A reader skimming `git log --oneline` should understand the project's evolution without opening a single diff.

## Working with the operator

His time is the scarcest thing in the project. These rules exist because each one was asked for
after it cost him something.

### Answer first

**Lead with the answer, then the reasoning, and put the detail in a file.** His words:

> if every prompt I give returns a novel for me to read through to find the real meat and potatoes
> we're working against the real ethos

A response that buries its conclusion in paragraph four costs him the time it took to find it, every
time. Long is fine **in a file he can choose to open**. It is not fine in a reply.

Process narration is the worst offender: what you were about to do, what you considered, which tool
you reached for. Report the outcome and what it means.

### Anything he must do himself needs STEPS TO EXECUTE

A handoff that explains *why* but not *how* hands him the research on top of the work. You already
did the investigation, so withholding the path makes him repeat it.

Every ask carries:

1. **Why**, one short paragraph.
2. **What you verified safe**, whenever the action could plausibly break something. A rotation
   request that does not say whether the live site goes down is one he is right to stall on.
3. **Numbered steps** with the exact dashboard path, exact file paths, exact command. Not "update the
   env var" but the full path and the variable name.
4. **Finished when**, as something he can observe himself.
5. **Cautions**, where a neighbouring action would be wrong. "Roll the service-role key, do not touch
   the anon key."

Anything that is your job rather than his goes at the bottom, labelled as not his, so the ask does not
look bigger than it is.

**The test:** could he complete it from your message alone, without asking what you meant?

### Name the question, never the owner

An open item says what to decide. **"Matthew owes a decision on the schema" is a phantom** that will
still be sitting there in nine days looking legitimate. "Choose the private board's database home" is
a real item.

If the title does not say what to do, it is not an item, it is a note to yourself.

### Do not ask for a decision you can make

Routine judgement calls are yours. Reserve questions for cases where two readings lead to materially
different work, and when you do ask, **recommend one** rather than presenting a menu.

---

## Verification: check the instrument, not just the result

**The largest single source of wasted work in this project has not been bad code. It has been
trusting a tool that was lying.** Nine separate incidents, one shape. Read this before reporting any
result you did not watch happen.

### The rule

> **For anything the operator must reproduce on screen, open it. For anything a tool reports, ask
> what would make that tool wrong.**

### A surprising result is a reason to re-check the tool, not to report

A malformed `grep` returned no matches and nearly produced a false all-clear on a live CVSS 8.2
vulnerability. The dedicated search tool found all three affected files immediately.

**A negative result from a tool is a claim about the tool as much as about the world.** Alarm and
all-clear fail in exactly the same way, so a *reassuring* surprise deserves the same suspicion as an
alarming one. When verification contradicts a grounded finding, **re-check the instrument first.**

### `curl` and `WebFetch` see only the shell on a client-rendered page

Both cleared a page that was, at that moment, serving a real client's name in rendered text. If the
data arrives in the browser, **a fetch proves nothing.** Use a real browser and read the rendered
text.

Corollary: a page that renders content client-side will look empty to every command-line check you
run against it. That is not evidence of absence.

### A row changed is not a page corrected

One project card needed **two** migrations, because the long-form copy lived in a second column and
only the render revealed it. `UPDATE ... 1 row affected` tells you the write succeeded, not that the
page is right.

**Load the page. Read it.**

### Reading source tells you what exists, not what a user sees

A 1,556-line component held every tab's markup. Attributing a table to the wrong tab sent the
operator hunting for a screen that does not exist, and cost a whole exchange to unpick.

If he has to click it, open it first.

### A grep hit is not a finding

- "secret" on a scheduling page was that vendor's shipped i18n dictionary.
- Sixteen `generic-api-key` hits in one file were prose.
- A "duplicate" address count was the same href appearing in both the HTML and the RSC payload.

**Read the surrounding context before you report a match.** A count is not a severity and a match is
not a verdict.

### A gate must test the hurdle it claims to test

- **A gate that tests the wrong hurdle stays undecidable forever.** If the threshold cannot be
  reached by the thing being measured, the gate never fires and the decision never gets made.
- **A ritual whose closing gate cannot see the failure it prevents certifies that failure.** A
  session-end check that cannot detect unpushed work will happily close a session with unpushed work.
- **An aggregator that reads one field loses everything filed in the other.** If a sweep reads only
  one marker, everything using the other marker is invisible, and the sweep reports clean.

### Report faithfully

If a check was skipped, say so. If output was ambiguous, say that instead of resolving it in your own
favour. **"I verified X" must mean you watched X happen**, not that you ran something that would
probably have caught it.

---

## Security

**Read `docs/SECURITY-DECISIONS.md` at the moment you find a credential, not at session start.**

### Triage before you escalate: sort by role, not by count

Skipping this step does not merely create noise. **It inverts priority**: on one occasion thirty
harmless findings reached the operator as an emergency while a credential that reached client
personal data sat untriaged for twelve days.

| Kind | Severity | Action |
|---|---|---|
| Supabase **anon** JWT | **Low, public by design** | None, ever. It ships in every browser bundle; RLS is the guard. |
| Supabase **service-role** JWT | **Critical** | Rotate. Escalate with the project named. |
| Private key (signing, SSH, platform) | **Critical** | Rotate. Escalate. |
| Account-scoped token or PAT | **High** | Rotate. Note that it reaches every project on the account. |
| Project-scoped password | **Medium** | Rotate at a convenient window. |
| Credential whose platform or project **no longer exists** | **None** | Dead. Record it, do not escalate. |

### Probe, do not classify

**Rule class decides how hard you look. It never decides whether a finding is real.** The most
serious credential ever found in this estate was a plaintext database password, which the scanner
files under its noisiest rule.

- **Anything with an endpoint gets a read-only probe before you report it.** A Supabase key against
  `/rest/v1/` answers `200` (live, rotate), `401`/`403` (already dead), or fails DNS (project gone,
  nothing to rotate). That is a verdict in one second with no judgement involved.
- **Never infer liveness from a token's own `exp` claim.** Two confirmed-dead keys both claimed
  expiry a decade out. The token cannot tell you whether the thing it opens still exists.
- **Decode and deduplicate first.** Thirty-five findings in one repo were one token.

### Standing rules

- **Redaction at HEAD is cosmetic. Rotation is the only remedy**, and only the operator can perform
  it, because only the platform owner can invalidate a value.
- **A credential in a private repo is exposed to every collaborator that repo has ever had.** Private
  is not a mitigation.
- **No credential before its consumer exists.** An unused key cannot do anything useful, can leak,
  and starts a rotation clock. Create it when the thing that reads it exists.
- **Storage scope must not exceed blast radius.** An account-scoped token never lives in a
  per-project `.env.local`.
- **Tokens carry an expiry and are named by purpose and date**, never by tool. `cli-2026-08`, not
  `Claude`.
- **Identify which token leaked by fingerprint, not by age.** Dashboards show *last used*, not
  *created*, so "revoke anything older than the commit" silently fails.
- **A public artifact derived from client work is GENERATED, never anonymised.** Renaming real records
  leaves real structure, real amounts and real dates.

### Two scanner defects worth knowing before you trust a sweep

1. **`[ -d .git ]` skips git worktrees**, where `.git` is a *file*. A sweep reporting "20 repos
   scanned" silently excluded two working trees, one of which held a plaintext production password.
   Test `-e`.
2. **Scanning history answers per-repo, not per-branch.** A fix on one branch makes every branch look
   fixed. Two branches read the password from the environment while a third still hardcoded it in
   fifteen files, and the repo scanned clean.

## Current Phase

<!-- Running checklist of what's shipped + what's in flight. Keep refreshed. -->

- [ ] Phase 1: core scaffold
- [ ] Phase 2: feature set A
- [ ] Phase 3: feature set B

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

`docs/` is the source of truth. Update as conventions evolve. `docs/calls/` holds parsed call notes. See `docs/calls/README.md`.

### TODO

`TODO.md`: Active backlog + blocked items + future phase items. Mark `[~]` pending, `[x]` done.

### Skills

`.claude/skills/`: reference skills (conventions) + task skills (generators).

**Do not rely on a skill loading itself.** Claude Code moved to explicit invocation
(changelog v2.1.215), so a convention that used to apply unprompted may simply not.
Reference skills are therefore all `user-invocable: true`, and the rule is: **invoke the
relevant convention by name before writing code in its area.**

**Reference skills (invoke before working in their area):**

- `cli-first`: CLI tools + env files for third-party services
- `bobi-stack`: Docs, TODO, ops.sh workflow conventions
- `supabase-query-system`: Read path. Invoke before adding a query
- `supabase-mutations`: Write path. Invoke before adding a mutation or form

**Invocable slash commands:**

- `/new-query <table> [cols]`: generate a new query + registry entry
- `/new-mutation <action-table> [fields]`: generate a new mutation + registry entry

## Memory

`~/.claude/projects/{{PROJECT_DIR_SLUG}}/memory/` holds lessons learned across sessions. **Before any client-facing work, read these.**

Starter memory files live at `.claude/memory-templates/` in this repo. Copy them into the Claude memory folder when setting up the project for the first time. See that folder's `README.md` for how to use them.

Key memory categories:

- `session_history.md`: briefing for future sessions (what shipped, where chat archives live)
- `feedback_*.md`: lessons about how to communicate + what the client/team values
- `project_*.md`: current state notes that don't belong in committed docs (blocked items, DB state as-of-a-date, etc.)
- `user_*.md`: communication style + dynamics for specific people
- `reference_*.md`: credentials, test accounts, API keys (only what's safe to store locally)
