# The chat tree

> **Template file.** Save as `docs/umbrella/CHAT-TREE.md` in the keeper repo, fill the
> placeholders, delete this blockquote. Adopt at three or more participants; below that the
> logs alone are enough.

Which session owns what, who may write where, and how work moves between them.

Keep the reasoning inline. Every rule here should say why it exists, because a rule whose
reason is lost gets dropped by the first session that finds it inconvenient.

## The tree

```
                       OPERATOR ({{OPERATOR_NAME}})
                              |
                 KEEPER  ·  {{KEEPER_REPO}}
                 owns: arbitration, security, paths, the
                 scaffold, marketing, the umbrella logs
                       |                    |
              PRODUCTS |                    | CLIENTS
                       |                    |
   {{PRODUCT_REPO_1}}  |         {{CLIENT_1}} (leaf, or sub-keeper
   {{PRODUCT_REPO_2}}  |            once it runs 2+ concurrent chats)
   {{PRODUCT_REPO_3}}  |
                       |         <future client>
                       |            leaf until it needs more
```

One session per box. A box may be idle; it may not be shared. A box is a directory plus a
log, so it outlives any individual chat: close a chat, open a new one against the same log,
and the work continues.

**Products** report directly to the keeper. One chat each until the work genuinely demands
more.

**Clients** live behind a confidentiality wall: nothing from a client branch ever flows into
a product, into the scaffold, or into another client. Not a route map, not a name, not a
lesson written with their specifics still in it. Lessons cross only after the keeper
generalises them.

**Sub-keepers are earned, not default.** A client or product gets one only when it runs two
or more concurrent chats, and it then files ONE consolidated entry upward rather than one
per chat. Do not stand up coordination machinery before the work demands it.

**Disk layout stays flat.** Repos live side by side under `{{DEV_ROOT}}`; the hierarchy
lives in this document, not in directories. Claude's per-repo memory is keyed to a
path-derived slug, so moving a repo silently orphans its session history.

## Rule 1: one repo, one owner

A session writes only to the repo it owns. This keeps `git log` an honest record of who did
what.

**The keeper is the exception**, because cross-repo work is its job. When it writes into a
sub-project it MUST file an entry in that project's log the same session, naming the commits.

**Two carve-outs.** A sub-project may commit, into the keeper repo and nothing else: (a) its
own umbrella log entries, and (b) for shared-database projects, its own claimed migration
files, with the number claimed in its log before the file lands. An uncommitted entry at a
session boundary is dirty state of unknown provenance for the next session.

## Rule 2: triage before escalating

Every finding is tagged before it reaches the operator.

| Tag | Meaning | Who acts |
|---|---|---|
| `needs-operator` | Money, risk appetite, a click in a third-party dashboard, anything client-facing | Operator |
| `needs-keeper` | Cross-repo, or it changes a shared assumption | Keeper |
| `self-serve` | The session can just do it | The session |

A session that cannot decide which tag applies has a `needs-keeper` question, not an
operator question.

## Rule 3: the scaffold is upstream of everything

Anything in the shared scaffold propagates silently into repos that have nothing to do with
where it came from. Never client-identifying content: not a route path, not a verbatim
comment, not a filename carrying a sector and a date. Write the lesson, never the specifics.
Before anything lands there, ask whether it is true for every project or only the one in
front of you.

## Rule 4: public repos are a one-way door

Publishing exposes every commit, every commit message, and every file version ever
committed. Deleting a file does not remove it from history, and a force-push does not
guarantee the old objects are gone.

**Publish by pushing a verified-clean tree to a NEW repo. Never flip an existing repo
public.** Verify on both axes before publishing, because they fail independently: grep the
full history's trees, and grep its commit messages, separately.

## Rule 5: sessions end on a boundary, not on exhaustion

End a session when it crosses a phase boundary, when it degrades, or when its work is done.
Before ending it owes an updated briefing, a reconciled TODO, and any open items stated
plainly.

**The inverse also holds:** a new work order does NOT require a new chat. The box's open
session claims it unless that session is genuinely degrading. Per-batch fresh-chat habits
are a working preference, not tree law, and the operator should never have to open a chat
just to get filed work built.

## Rule 6: the keeper arbitrates, and says so out loud

When two sessions disagree, or a decision spans repos, the keeper decides and records the
decision in `_changelog.md`. Sub-projects do not negotiate with each other directly: chats
share no context, so an agreement in one is invisible in the other.

**Seams are the sanctioned exception.** Where one box writes daily under conventions another
owns, the keeper opens `docs/umbrella/seam-<topic>.md` naming the owner, the writers, and a
strict subject boundary; inside it they talk directly. A seam covers conventions, never
cases, and a seam crossing the client wall carries no client specifics. Seams are opened by
the keeper, never assumed by a box.

## Starting a session

Every session, keeper or box, opens by reading:

1. `{{KEEPER_REPO}}/docs/STRATEGY.md` (or whatever holds umbrella-level truth)
2. `{{KEEPER_REPO}}/docs/umbrella/_changelog.md`, last ten entries
3. Its own `docs/umbrella/<project>.log.md`, scanning for `[open]` and `[needs-response]`
4. Its own repo's `CLAUDE.md` and `TODO.md`

The keeper additionally reads every log, because it is the only session that sees them all.

## What this does not cover

Boxes decide their own internals: architecture, libraries, file layout, anything that stops
at their repo boundary. This document is about the seams between sessions, not how any one
of them does its work.
