# Recipe: multi-session orchestration (the umbrella pattern)

**Situational, opt-in.** A single-repo project does not need any of this; the session-START/END checklists and `check-integrity` already cover the single-repo case. Reach for this recipe when one operator runs **multiple coordinated repos through multiple Claude sessions** and cross-session knowledge loss starts costing real rework. Proven across six repos and a three-month marketing build-out in the Bobi Labs ecosystem.

## The shape

Three layers, top down:

1. **One keeper.** Exactly one repo (usually the oldest or most central) is the umbrella keeper. Its Claude sessions carry the coordination duty: they read all logs at session start, resolve stale items, and promote durable decisions.
2. **Per-project comms logs.** The keeper repo holds `docs/umbrella/<project>.log.md`, one per participating repo. Append-only, dated entries, each ending in a status marker: `[open]` `[needs-response]` `[resolved]` `[stable]`. Both sides write to the same file; the log IS the conversation.
3. **A curated changelog.** `docs/umbrella/_changelog.md` holds only promoted, durable decisions (brand rules, architecture calls, process lessons). Every participating repo's CLAUDE.md instructs its sessions to read the last ~10 entries at session start.

Each participating repo's CLAUDE.md gets a short block: which logs to read at session start, when to file an entry (cross-cutting changes and state shifts, not routine internal work), and where the keeper lives.

## The session hierarchy

The repo layer above is storage. The working layer is **one master chat + pointed worker chats**:

- The **master chat** lives in the keeper repo. It plans, files work orders, does small cross-repo work directly, and synthesizes state for the operator.
- **Worker chats** are opened per repo (or per task within a repo), pointed at a specific work order, and end when it lands.
- Chats never coordinate live; they coordinate through the logs. That is what makes the system survive context resets, machine changes, and weeks of idle time.

Two field-tested reasons this beats one giant chat:

- **Context-window hygiene.** Pointed chats on one task exhaust context far slower and stay more accurate, because the window holds one problem's files instead of five problems' worth of drift. Multiple pointed chats in the *same* tree work well for the same reason.
- **No overwrite collisions.** Each worker owns its repo's working tree; the master only touches shared docs and the keeper repo. Nobody stomps anybody.

## The work order

The highest-leverage artifact. When the master chat delegates, it appends a `WORK ORDER` entry to the target repo's log containing everything a fresh session needs to execute without archaeology:

```markdown
## YYYY-MM-DD — WORK ORDER: <title> — from <keeper> (keeper)

<Decision context: what the operator approved, in one paragraph.>

**What:** <the deliverable>
**Spec:** <schema, routes, constraints, naming rules, out-of-scope>
**Conventions:** <which repo patterns to follow>

Reply here when landed with <the specific facts the keeper needs back>.

**Status:** [needs-response] — awaiting a <project> session to claim.
```

The operator then opens a chat in that repo and says little more than "check the umbrella log and pick up the work order."

## Failure modes (learned the hard way)

- **Sub-projects stop reporting.** A repo shipped ~25 commits over weeks with zero log entries; the keeper later reconstructed state from `git log`. Mitigations: the keeper's session-START checklist includes a reporting-gap sweep (any participating repo with commits newer than its last log entry gets flagged), and keeper sessions have **resolution rights**: after a reasonable gap, the keeper may resolve a dangling `[needs-response]` itself and record what it did, rather than letting asks rot.
- **Stale status markers.** Append-only logs mean an old `[open]` can sit above its own resolution. Convention: the *newest* entry's status is authoritative; closing entries explicitly reference what they close.
- **Decisions trapped in logs.** If a decision matters beyond one repo pair, promote it to `_changelog.md` (and the keeper's strategy doc) the same day, or future sessions will re-litigate it.

## When not to use this

One repo, or repos that never actually depend on each other: skip it all. The overhead is only worth it once cross-repo state genuinely exists (shared database, shared brand rules, one product embedding another). Start with just a keeper + one log the first time two repos need to agree on something, and let the rest grow as needed.

## Adopting it

Starter files live in [`umbrella-starter/`](umbrella-starter/). The mechanical steps:

1. **Pick the keeper** (the oldest or most central repo; it must also own the umbrella's strategy doc).
2. Copy `umbrella-starter/README.template.md` and `umbrella-starter/_changelog.template.md` into the keeper repo as `docs/umbrella/README.md` and `docs/umbrella/_changelog.md`; fill placeholders.
3. For each participating repo, copy `project.log.template.md` to `docs/umbrella/<project>.log.md` in the keeper repo.
4. Paste the matching block from `claude-md-block.template.md` into each repo's CLAUDE.md session-start checklist (keeper block vs participant block).
5. First real use: when the next cross-cutting decision happens, write it as a log entry instead of re-explaining it in the next chat. The system earns its keep from that moment.

Day to day, run it as described in "The session hierarchy" above: one master chat in the keeper, pointed worker chats picking up work orders from the logs.
