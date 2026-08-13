# Recipe: multi-session orchestration (the chat tree)

**Situational, opt-in.** A single-repo project does not need any of this; the
session-START/END checklists and `check-integrity` already cover the single-repo case.
Reach for this recipe when one operator runs **multiple coordinated repos through multiple
Claude sessions** and cross-session knowledge loss starts costing real rework. Field-tested
across a fifteen-box tree spanning products, a client engagement, and personal projects.

## The shape

Storage first. Three layers, top down:

1. **One keeper.** Exactly one repo (usually the oldest or most central) is the umbrella
   keeper. Its sessions carry the coordination duty: read all logs at session start,
   resolve stale items, arbitrate, and promote durable decisions.
2. **Per-project comms logs.** The keeper holds `docs/umbrella/<project>.log.md`, one per
   participant. Append-only, dated entries, each ending in a status marker: `[open]`
   `[needs-response]` `[resolved]` `[stable]`. Both sides write to the same file; the log
   IS the conversation.
3. **A curated changelog.** `docs/umbrella/_changelog.md` holds only promoted, durable
   decisions. Every participant's `CLAUDE.md` tells its sessions to read the last ten
   entries at session start.

Add a fourth file the day the tree has more than three participants: **the constitution**
(`docs/umbrella/CHAT-TREE.md`), which names every box, who owns what, and the rules below.
Write the reasoning inline. A rule whose reason is lost gets dropped by the first session
that finds it inconvenient.

## The tree

Boxes, not conversations. A **box** is a directory plus a log file, and it outlives any
individual chat: close a chat, open a new one against the same log, and the work continues
exactly where it stopped. One session per box at a time. A box may be idle; it may not be
shared.

Three tiers:

```
                        OPERATOR
                           |
                    KEEPER (one repo)
                    owns: arbitration, security, paths,
                    the scaffold, the umbrella logs
                     |                    |
            PRODUCTS |                    | CLIENTS
            report direct                 behind a confidentiality wall
```

**The wall is the load-bearing part.** Nothing from a client branch flows into a product,
into the scaffold, or into another client: not a route map, not a name, not a lesson with
their specifics still in it. Lessons cross only after the keeper strips them to mechanism.
This exists because client detail that drifted upward into shared scaffolding eventually
reached a public repo, and the fix propagated to the scaffold but not to the repos that had
already copied from it.

**Sub-keepers are earned, not default.** A client or product gets one only when it runs two
or more concurrent chats; it then files ONE consolidated entry upward instead of one per
chat. Below that bar, a box is a leaf reporting straight to the keeper. Do not build
coordination machinery before the work demands it.

**Disk layout stays flat.** Repos live side by side, and the hierarchy lives in the
constitution, not in directories. The mechanical reason: Claude's per-repo memory is keyed
to a path-derived slug, so moving a repo silently orphans its entire session history. The
reporting structure is a document; the filesystem is an address book.

## The rules

Six, each earned by something going wrong.

1. **One repo, one owner.** A session writes only to the repo it owns, so `git log` stays
   an honest record. The keeper is the exception, because cross-repo work is its job, and
   when it writes into a sub-project it MUST file an entry naming the commits.
   *Two carve-outs:* a sub-project commits its own log entries into the keeper repo, and,
   for shared-database projects, its own claimed migration files. Nothing else.
2. **Triage before escalating.** Every finding is tagged before it reaches the operator:
   `needs-operator` (money, risk appetite, a click in someone else's dashboard),
   `needs-keeper` (cross-repo or changes a shared assumption), or `self-serve`. A session
   that cannot pick a tag has a `needs-keeper` question, not an operator question.
3. **The scaffold is upstream of everything, so it gets stricter rules.** It is copied into
   every new project, so anything in it propagates silently. Never client-identifying
   content. Write the lesson, never the specifics. A recipe naming a real deployment is a
   targeting guide, not a lesson.
4. **Public repos are a one-way door.** Publishing exposes every commit, message, and file
   version ever committed; deleting a file does not remove it from history. So publish by
   pushing a verified-clean tree to a NEW repo, never by flipping an existing one. Verify
   on both axes: grep trees AND commit messages, separately.
5. **Sessions end on a boundary, not on exhaustion.** Before ending, a session owes an
   updated briefing, a reconciled TODO, and any open items stated plainly. The inverse also
   holds: a new work order does NOT require a new chat. The box's open session claims it.
6. **The keeper arbitrates, and says so out loud.** When two sessions disagree or a decision
   spans repos, the keeper decides and records it in the changelog. Sub-projects do not
   negotiate bilaterally, because chats share no context and an agreement in one is
   invisible in the other.

## The work order

The highest-leverage artifact. When the keeper delegates, it appends everything a session
needs to execute without archaeology:

```markdown
## YYYY-MM-DD: WORK ORDER, <title>, from <keeper> (keeper)

<Decision context: what the operator approved, in one paragraph.>

**What:** <the deliverable>
**Spec:** <schema, routes, constraints, naming rules, out-of-scope>
**Conventions:** <which repo patterns to follow>
**Guardrails:** <what must not change, and what to check before starting>

Reply here when landed with <the specific facts the keeper needs back>.

**Waiting on Bees:** nothing.
**Status:** [needs-response], awaiting a <project> session to claim.
```

The operator then says little more than "check your log and claim it."

## The Waiting on Bees line

Every entry ends with one, named for whoever the operator is:

```markdown
**Waiting on Bees:** rotate the database password in the dashboard.
```

Imperative one-liners, maximum three, or the literal word "nothing". It exists because
thorough sessions write thorough conclusions, and a human reading six of them cannot tell
what is a report from what is a request. Keeper-facing asks do not go here; they stay in the body.

**Scope demotion (2026-08-10): this line is a courtesy pointer, not a tracking system.** Once the
estate runs a shared operator board (see `docs/multi-agent.md`, rule 4), anything that genuinely
needs the operator goes on the board as a card with steps-to-execute, and this line at most points
at it. The board is the queue; a "waiting" line that only lives in a log is where asks go to be
forgotten.

## Seams

Rule 6 has a real cost when one box writes DAILY under conventions another box owns: every
routine question becomes a keeper round trip on work needing no arbitration. A **seam** is
the narrow fix. The keeper opens `docs/umbrella/seam-<topic>.md`, names the owner, the
writers, and a strict subject boundary; inside it the parties talk directly and the keeper
only watches.

Two hard constraints. A seam covers **conventions, never cases**: the moment an exchange
needs a specific engagement's facts, it leaves the seam. And a seam crossing the client wall
carries **no client specifics**, tested by asking whether the question would read identically
for any client. Seams are opened by the keeper, never assumed by a box.

## Failure modes, learned the hard way

- **Sub-projects stop reporting.** One repo shipped roughly 25 commits over weeks with zero
  log entries. Mitigation: the keeper's session-start sweep flags any participant with
  commits newer than its last log entry, and the keeper has resolution rights on asks that
  have rotted.
- **Stale status markers.** Append-only means an old `[open]` can sit above its own
  resolution. Convention: the newest entry wins, and closing entries name what they close.
- **Decisions trapped in logs.** If it matters beyond one pair, promote it to the changelog
  the same day or it gets re-litigated.
- **Committed is not shipped.** Fixes sat committed but undeployed for days while the logs
  read as though they were live. Worse than the delay: work stacks in front of undeployed
  code, each commit assuming code that is not live, so cost and surprise both grow with the
  gap. Deploy by default, hold only deliberately, and make every hold visible. A
  `check-integrity` counter that nags on unshipped commits older than three days is the
  cheap mechanism.
- **A credential in a private repo is exposed to every collaborator it ever had.** Private
  feels safe and is not. Redaction at HEAD is cosmetic because history keeps it; only
  rotation is a fix.
- **Verification that cannot fail proves nothing.** Any check on security or access control
  must be proven to discriminate: break the thing deliberately, confirm the check catches
  it, then restore. Too-loose and too-tight both pass a green build.

## When not to use this

One repo, or repos that never actually depend on each other: skip all of it. The overhead is
real. Start with a keeper and one log the first time two repos need to agree on something,
and let the rest grow.

## Adopting it

Starter files live in [`umbrella-starter/`](umbrella-starter/):

1. **Pick the keeper.** Oldest or most central; it must also own the strategy doc.
2. Copy `README.template.md` and `_changelog.template.md` into the keeper as
   `docs/umbrella/README.md` and `_changelog.md`; fill the placeholders.
3. For each participant, copy `project.log.template.md` to `docs/umbrella/<project>.log.md`.
4. Paste the matching block from `claude-md-block.template.md` into each repo's `CLAUDE.md`
   session-start checklist (keeper block or participant block).
5. **At three or more participants**, copy `CHAT-TREE.template.md` to
   `docs/umbrella/CHAT-TREE.md` and fill in the boxes. Below three, the logs are enough.
6. Keep the standup prompts. `chat-standup-prompts.template.md` holds one paste-ready
   kickoff prompt per box, so opening a session is a copy and paste rather than a
   re-explanation. This file becomes the single most-used artifact in the tree.

First real use: the next time a cross-cutting decision happens, write it as a log entry
instead of re-explaining it in the next chat. The system earns its keep from that moment.
