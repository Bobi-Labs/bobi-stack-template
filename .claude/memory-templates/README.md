# Memory Templates

Starter memory files for Claude sessions. These live at `~/.claude/projects/<your-project-dir>/memory/` — NOT in this repo's committed state. Copy them into the Claude memory folder when setting up a new project.

## Why a separate location

- Memory files contain project-specific details that evolve per session (client names, current state, lessons learned). Committing them mixes operational state with scaffolding.
- The Claude Code harness reads memory files from `~/.claude/projects/<dir>/memory/` automatically when a session starts, keyed to the working directory.
- Separating memory from repo means `git reset` never nukes accumulated wisdom.

## Setup (new project)

```bash
# Figure out the Claude projects dir name for your repo.
# It's the absolute path to the repo with slashes replaced by dashes and no leading drive-letter colon.
# E.g., C:/dev/my-project → C--dev-my-project

PROJECT_SLUG="C--dev-my-project"   # adjust to yours
MEM_DIR="$HOME/.claude/projects/$PROJECT_SLUG/memory"
mkdir -p "$MEM_DIR"
cp -r .claude/memory-templates/* "$MEM_DIR/"

# Then edit MEMORY.md + session_history.md to match your project.
```

## Files in this folder

### Always copy (universal principles — they apply everywhere)

- `feedback_error_handling.md` — fail loudly in client-facing steps
- `feedback_mutual_check_in.md` — push back honestly, product > ego
- `feedback_client_facing_quality.md` — forms + saves must be bulletproof
- `feedback_invoice_language.md` — invoices describe capabilities, not dev work

### Always copy (structural)

- `MEMORY.md` — index file (fill in per project)
- `session_history.md` — day-one briefing (fill in per project)

### Copy + rename if relevant

- `project_example.md` — template for DB state / blocker notes / current-state
- `user_example.md` — template for person-specific communication notes
- `reference_example.md` — template for credentials / test accounts / API doc links

## Why these specific four principles

Three failure modes have shown up repeatedly across client projects, regardless of domain:

1. **Silent failure** → client thinks the system is broken, loses trust (`feedback_error_handling.md`)
2. **Yes-and culture on design calls** → miss the better path because nobody pushed back (`feedback_mutual_check_in.md`)
3. **Form save bugs** → client notices every time, undermines trust faster than any other bug class (`feedback_client_facing_quality.md`)
4. **Invoice line items that read like commit logs** → client feels padded-against, questions the work's value (`feedback_invoice_language.md`)

Each principle file is short (1 page) and actionable. Read all four before any client-facing work.

## Don't

- Don't commit actual memory files from a live project back into this template. They contain operational state + names + context that's project-specific.
- Don't add project-specific lessons here — those go in the live project's `~/.claude/projects/.../memory/` folder.
- Don't edit these templates in-place while working in a specific project. Edit the live memory file instead; if a pattern emerges that's universal, consider porting back into the template in a separate pass.
