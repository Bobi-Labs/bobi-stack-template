# Migrating an existing project to bobi-stack-template conventions

For projects already in motion (not brand new) that want to adopt the workflow patterns from this template. Covers audit-first adoption, what's worth porting vs skipping, and a copy-paste prompt for a Claude Code session.

## Philosophy

- **Audit before touching code.** Claude (in the target project's session) compares current state to the template, produces a list of deltas, then waits for your approval per delta.
- **Don't copy blindly.** A small internal side project doesn't need the full Deliverables panel. A personal script doesn't need daily cron tests. Adopt what fits the project's stage + audience.
- **No cross-pollination.** The template is intentionally generic. Nothing from another project's domain should leak in through adoption.
- **One commit per adoption.** Each pattern added gets its own commit with a message that describes the pattern + why it was adopted.

## The prompt

Open Claude Code in the project you want to upgrade. Paste this:

```
I want to bring this project up to the conventions in bobi-stack-template.
Reference lives at C:/dev/bobi-stack-template (adjust path if different).

Before changing anything:

1. Audit the current state of this project. For each category below,
   report what exists and what's missing:
   - CLAUDE.md — does it exist? Does it have a session-start checklist?
   - Memory folder — is there a ~/.claude/projects/<this-slug>/memory/?
     What files are in it? Does it have the 4 universal feedback
     principles (error-handling / mutual-check-in / client-facing-quality
     / invoice-language)?
   - docs/calls/ — is there a call-notes convention?
   - .screenshots/ + .transcripts/ — are they set up + gitignored?
   - Drive tooling — does the project need it? If yes, is it present?
   - Test suite — does the project have /api/tests/run + lib/tests/?
     Is it wired to a daily cron?
   - Error handling in client-facing flows — is the "fail loudly" pattern
     applied? Are there silent-failure surfaces?
   - ops.sh — present?
   - .gitignore — does it include .screenshots/, .transcripts/, .tmp/,
     .claude/*.lock, .claude/worktrees/?
   - TODO.md — present? Up to date?
   - Commit hygiene — scan recent commit history. One logical change
     per commit, or bundled?

2. For each gap, propose whether it's worth adopting. Weigh:
   - Project size + maturity (small script ≠ production client app)
   - Audience (internal ≠ client-facing ≠ public-facing)
   - Team size (solo ≠ multi-collaborator)
   - Whether the project is in-flight or near-complete (late-stage
     adoption is more disruptive)

3. Return a proposal list with per-item "adopt / skip / adapt" and a
   one-line rationale for each. Don't touch code yet.

4. I'll review the proposals. After I approve, implement gradually —
   one commit per logical adoption. Each commit message should describe
   the pattern + why it was adopted (not just "added X").

5. Do NOT import content from other projects (names, domain terms,
   client-specific examples). The template has generic versions; use
   those. If a memory file from another project gets pulled in by
   mistake, that's a bug to revert.

Start with the audit. Report the findings. Wait for my go before
touching code.
```

## What to actually look for in the audit

### CLAUDE.md

- Does it have a session-start checklist that tells Claude what to read first?
- Does it describe the stack, project structure, commands, and known issues?
- Does it reference the memory folder location?

### Memory folder

- Does `~/.claude/projects/<slug>/memory/` exist?
- Is there a `MEMORY.md` index?
- Is there a `session_history.md`?
- Are the 4 universal feedback principles present?
- Are there project-specific memory files that capture lessons learned? (Not just state dumps — actual lessons.)

### `.screenshots/` + image sharing

- Is the folder gitignored + present?
- Is there a convention documented somewhere for how to share images with Claude?

### Drive tooling

- If the project uses Google Drive: is there a `scripts/lib/drive.mjs` + `scripts/drive-cli.mjs`?
- Does the `loadEnv()` function `.trim()` values (defense against trailing-whitespace corruption)?

### Test suite

- If the project is production-facing: is there a daily test cron?
- Are there synthetic end-to-end tests for the critical user-facing paths?
- Is there a health-check test for env vars (no trailing whitespace, correct length)?

### Error handling

- Are user-triggered actions surfacing plain-English errors on failure?
- Or are there silent failures / generic "Something went wrong" toasts?

### Commit hygiene

- Scan the last 20 commits. Are they single-logical-change, or bundled?
- Commit messages describe the _why_, not just the _what_?

## What usually isn't worth porting

- **Deliverables panel** — unless the project has a client paying per-item and you want to show the work. Overkill for internal tools.
- **Test suite daily cron** — unless the project is production + has real users. Local tests are enough for side projects.
- **Drive CLI** — unless the project actually uses Google Drive. Don't import if not needed.
- **Call notes convention** — unless the project involves recurring calls with stakeholders.

## What's always worth porting

- The 4 universal feedback principles
- `CLAUDE.md` session-start checklist pattern
- `.gitignore` additions for `.screenshots/`, `.transcripts/`, `.tmp/`
- One-commit-per-logical-change discipline
- Error-handling "fail loudly" pattern on any user-facing flow

## After adoption

Keep the template reference current by reviewing it quarterly. If a new pattern emerges in any specific project that's universally useful, port it back into `bobi-stack-template` (genericized, scrubbed of domain references).
