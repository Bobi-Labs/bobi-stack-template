# Umbrella: cross-Claude coordination

> **Template file.** Adopt via the "Adopting it" steps in `../multi-session-orchestration.md`;
> this folder is source material, not a copy-everything bundle. Placeholder glossary:
> `{{UMBRELLA_NAME}}` the umbrella's name; `{{KEEPER_REPO}}` the keeper's repo name;
> `{{KEEPER_PATH}}` the keeper repo's filesystem path as seen from a participant's machine;
> `{{STRATEGY_DOC}}` the keeper-repo-relative path of the strategy doc (e.g. `docs/STRATEGY.md`);
> `{{PROJECT}}` a participating repo's name; `{{OPERATOR}}` the human's name or handle, as used in
> each log entry's "Waiting on" line. Fill them, delete rows/files you don't need,
> then delete this blockquote.

This folder is the coordination layer between Claude Code sessions running in different repos under the **{{UMBRELLA_NAME}}** umbrella:

| Repo | Role |
|------|------|
| `{{KEEPER_REPO}}` (this) | **Umbrella keeper.** Owns `{{STRATEGY_DOC}}` + this folder. |
| `{{PROJECT_A}}` | Consumer + reporter. {{PROJECT_A_DESCRIPTION}} |
| `{{PROJECT_B}}` | Consumer + reporter. {{PROJECT_B_DESCRIPTION}} |

## What's in this folder

| File | Purpose | Owner |
|------|---------|-------|
| `README.md` (this) | Protocol explanation | keeper |
| `_changelog.md` | High-impact umbrella decisions, dated. Curated; promoted from project logs when stable. | keeper writes; everyone reads |
| `<project>.log.md` | Two-way comms between the keeper's Claude and that project's Claude, one file per project | both |
| `CHAT-TREE.md` | The constitution: every box, who owns what, the rules and their reasoning. Adopt at three or more participants | keeper |
| `chat-standup-prompts.md` | One paste-ready kickoff prompt per box, kept current | keeper |
| `seam-<topic>.md` | A narrow direct channel between two boxes on ONE subject, opened by the keeper when routing every routine question through it becomes pure latency | the named parties |
| `archive/` | Rotated logs (created lazily; see Keeper duties) | keeper |

## Why this exists

Multi-repo work means decisions made in one Claude session need to propagate to others. Without a coordination layer, the operator becomes the only courier, re-explaining architecture pivots across chats. This folder is the persistent, async, git-tracked communication primitive that lets sessions coordinate without polling, daemons, or MCP servers.

The pattern: **canonical truth lives in `{{STRATEGY_DOC}}`** (rewritten when decisions stabilize), but **conversations happen in the log files** (append-only, dated, attributed). When a decision proves durable, the keeper promotes it and marks the log entry `[stable]`.

## Read protocol (every Claude, every session start)

After the repo's own CLAUDE.md session-start checklist:

1. **Read `{{STRATEGY_DOC}}`** in the keeper repo if you haven't this session: it's the umbrella truth.
2. **Read `docs/umbrella/_changelog.md`** in the keeper repo, last ~10 entries.
3. **Read your own log file**, last ~10 entries. Look for `[needs-response]` or `[open]` markers.
4. **If anything's open or unanswered:** address it before the operator's first ask, OR flag it in your first response.

The keeper's Claude reads ALL project log files at session start, and additionally sweeps for **reporting gaps**: any participating repo whose git history is newer than its last log entry gets flagged.

## Write protocol (when something cross-cuts)

Trigger: **any change that affects another repo's assumptions** (architecture pivots, shared-schema changes, domain/DNS moves, sub-product status changes, brand/voice decisions, renames that break references). Routine internal work needs no entry.

Format, appended to the relevant project log:

```markdown
## YYYY-MM-DD, <short title>, from <project>

**What changed:** one-line summary.

**Why:** the reason in 1-3 sentences.

**Asks of <other project>:** concrete asks, or "none, FYI".

**Status:** [open] | [needs-response] | [resolved] | [stable]
```

Rules: append-only (never edit old entries); the NEWEST entry's status is authoritative; closing entries explicitly reference what they close; commit your own log entries in the same session that writes them.

## Keeper duties

- Reply to `[needs-response]` items; promote durable decisions to `{{STRATEGY_DOC}}` + `_changelog.md`.
- **Resolution rights:** if an ask sits unanswered past a reasonable gap, the keeper may resolve it directly and record what it did, rather than letting it rot.
- File **work orders** (see the log template) when delegating builds to a project's next session.
- **Rotation:** when a log grows unwieldy, the keeper may move fully `[resolved]`/`[stable]` history to `archive/<project>.log.<year>.md`, leaving a dated pointer entry in the live file. The newest-entry-is-authoritative rule applies to the live file.
