# Starting a new project from bobi-stack-template

Step-by-step walkthrough for spinning up a new project with this template. Expect ~30 minutes end-to-end the first time, ~10 minutes once the pattern is familiar.

## 1. Clone + re-init

```bash
# Clone the template (not a git clone — a filesystem copy so the new project has its own history)
cp -r C:/dev/bobi-stack-template C:/dev/my-project
cd C:/dev/my-project

# Drop the template's git history, start fresh
rm -rf .git
git init -b main

# First commit marks the starting baseline
git add -A
git commit -m "Initial scaffold from bobi-stack-template"
```

## 2. Rename + fill in placeholders

**`README.md`** — replace "Bobi Stack Template" header + usage with project-specific intro.

**`CLAUDE.md`** — replace every `{{PLACEHOLDER}}`:

- `{{PROJECT_NAME}}` — human-readable project name
- `{{PROJECT_DIR_SLUG}}` — Claude projects dir name (see below)
- `{{PROJECT_OVERVIEW_PARAGRAPH}}` — one paragraph: who it's for, what it replaces, current phase
- `{{SUPABASE_PROJECT_REF}}` — fill in after creating the Supabase project
- `{{RLS_STATE}}` — describe current RLS posture
- `{{PRODUCTION_DOMAIN}}` — fill in after deploy

**How to find your `{{PROJECT_DIR_SLUG}}`:**

Claude Code stores memory per project at `~/.claude/projects/<slug>/`. The slug is the absolute path to your repo with slashes replaced by dashes and the drive-letter colon removed.

Examples:
- `C:/dev/my-project` → `C--dev-my-project`
- `/Users/me/projects/thing` → `-Users-me-projects-thing`

Run Claude Code once in the repo to let it auto-create the slug dir, then look in `~/.claude/projects/` for the matching folder.

## 3. Set up Supabase

```bash
# Create a project at supabase.com — note the project ref + region
# Add to .env.local (copy from .env.example):
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY

./ops.sh install            # pnpm install
./ops.sh gen-types          # pulls types from your Supabase project

# First migration — create a baseline table or two
# (use the /new-query or /new-mutation skills once tables exist)
```

## 4. Seed memory files

Copy the template memory files into your Claude memory folder:

```bash
PROJECT_SLUG="C--dev-my-project"   # adjust to match your path
MEM_DIR="$HOME/.claude/projects/$PROJECT_SLUG/memory"
mkdir -p "$MEM_DIR"
cp -r .claude/memory-templates/* "$MEM_DIR/"

# Edit MEMORY.md + session_history.md to match project
```

The 4 universal feedback principle files (`feedback_error_handling.md`, `feedback_mutual_check_in.md`, `feedback_client_facing_quality.md`, `feedback_invoice_language.md`) are drop-in. Don't rewrite them unless you have a specific project reason.

## 5. Deploy to Vercel

```bash
# Push to GitHub first (create the repo via gh or the web UI)
gh repo create my-project --private --source=. --remote=origin --push

# Then link to Vercel
vercel link            # one-time setup
vercel env pull .env.local   # pulls env vars (optional — usually pushed FROM local)
./ops.sh deploy prod   # first production deploy
```

## 6. Opt-in tooling

Based on project needs, enable:

### Google Drive integration (if project stores/reads files from Drive)

1. Create a service account in Google Cloud Console
2. Download the JSON credentials
3. Base64-encode: `base64 -w0 creds.json` (Linux) or `certutil -encode creds.json creds.b64 && type creds.b64` (Windows)
4. Add to `.env.local` as `GOOGLE_CREDENTIALS_BASE64=...` (no quotes, no newlines)
5. Share whatever Drive folders the service account needs with its email (Editor access)
6. Add root folder ID to `.env.local` as `GOOGLE_DRIVE_FOLDER_ID=...`
7. Test: `node scripts/drive-cli.mjs roots`

### Daily test suite + report email (if project is production + client-facing)

1. Add a Resend account; add `RESEND_API_KEY` + `TEST_SUITE_RECIPIENTS` to Vercel env
2. Add `CRON_SECRET` to Vercel env (random 32-byte hex)
3. Set up test modules in `lib/tests/`
4. Add cron entry to `vercel.json`:
   ```json
   { "path": "/api/tests/run", "schedule": "0 7 * * *" }
   ```
5. Deploy → wait for first cron fire → verify email arrives

### Call notes (if project involves client/team calls)

- Drop raw transcripts in `.transcripts/YYYY-MM-DD-slug.txt` (gitignored)
- Write parsed notes at `docs/calls/YYYY-MM-DD-slug.md` (committed)
- Add a row to `docs/calls/INDEX.md` for every call — it's standard, not optional, and it's what `./ops.sh check-integrity` diffs against
- Filing a call is a **Session-END obligation** (see the checklist in `CLAUDE.md`); `./ops.sh check-integrity` flags anything unfiled
- See `docs/calls/README.md` for the format

## 7. First Claude Code session

Open the project in Claude Code (or continue in whatever Claude session you're in):

1. Claude reads `CLAUDE.md` automatically on session start
2. Claude reads `~/.claude/projects/<slug>/memory/*.md` automatically
3. Paste `session_history.md`'s briefing into the chat if Claude doesn't mention it first — this is the session-start checklist

From there, build normally. Commit one logical change at a time. Update `TODO.md` as you go.

## 8. Things to do in the first week

- Fill in the Project Overview + Tech Stack + Database State sections of `CLAUDE.md`
- Create the first real memory file at `~/.claude/projects/<slug>/memory/project_current_state.md` with the project's current state
- If the project has a specific user you'll communicate with repeatedly, create `user_<firstname>.md` capturing their communication dynamics
- Set up `.env.example` with all required env vars listed (values blank)
- Write a short `docs/architecture.md` describing the data model

## Troubleshooting

**Claude doesn't seem to see memory files.** Check that the project slug dir exists at `~/.claude/projects/<slug>/memory/`. The slug must match the absolute path of the repo with slashes replaced by dashes (colon removed on Windows).

**Drive CLI fails with "Missing GOOGLE_CREDENTIALS_BASE64".** Make sure `.env.local` has the var with no quotes around the base64 string, no trailing newline. Check length: should be hundreds of characters on one line.

**Trailing-whitespace env var corruption.** If anything Drive-related silently fails with "File not found: .", suspect `\n` in env vars. `vercel env pull` adds literal newlines to some values. The `.trim()` in `loadEnv()` handles this; verify the pattern is used everywhere env vars get consumed.
