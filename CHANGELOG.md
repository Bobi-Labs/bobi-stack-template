# Changelog

Date-keyed, hand-written, one entry per meaningful change. **Not semver.** bobi-stack is a clone-and-fill scaffold with no version-pinned consumers, so it is not tagged or released (see "Deferred by design" at the bottom for the rationale, so it does not get re-litigated).

A downstream project reads this to decide whether a pattern is worth re-pulling. Keep entries about *what changed and why it matters to a project built on this*, not commit-by-commit detail.

## 2026-07-23

Security hardening, driven by a real incident: a live client system turned out to have a full authentication bypass reachable with one curl command, alongside an app that had been quietly dying in users' browsers for months. Neither was bad code; both were habits. The full record is the incident record, held privately.

- **New recipe: [security and failure modes](docs/recipes/security-and-failure-modes.md).** The five habits (an exemption list that grew by convenience; authentication mistaken for authorization; silent failure modes; a fix that was written and never shipped; a workaround that outlived its cause) and the 19-item checklist. Flagged as not-situational: this one is for every project.
- **New: `lib/auth/require-role.ts`.** `requireRole(...)` and `requireCronSecret(...)`, shipped on day one so the complete check is the path of least resistance. `getUser()` answers "is this someone?"; the question is "is this someone who may do *this*?" Roles read from `app_metadata` (service-role-writable) and never `user_metadata` (user-writable). Cron helper returns 401 rather than a redirect, because a 307 silently breaks schedulers that follow it and report success.
- **New: `./ops.sh audit-security`** (`scripts/audit-security.mjs`), wired into CI with `--strict`. Checks the greppable half: undocumented auth exemptions, exempt service-role routes with no caller check, authentication without authorization, webhooks without secret verification, privilege downgrade on failure, Supabase `lock` overrides, unexplained `Infinity` caches, service-worker deploy skew. Calibrated against six real codebases until the clean ones reported clean, because a tool that cries wolf gets ignored. **On its first run it found the same authentication bypass, unpatched, in a sibling repo** — same route, same missing check, same comment where a guard belonged.

## 2026-07-22 (later still)

Two lessons from the bobi-suite Phase 1 close, added to [source-only packages](docs/recipes/source-only-packages.md) because both generalize well beyond that recipe:

- **A rule stated in a README needs a test that fails when it is broken.** A package shipped a violation of its own convention and documented itself as compliant in the same commit: README, code comment, and ruling were all wrong about the same file, and only an adversarial review caught it. Prose is a request; a failing test is the rule.
- **Structured output guarantees well-formed results, not truthful ones.** A parallel audit lens returned `{"summary":"test","detail":"d"}` and the synthesis consumed it as real analysis, because it validated against the schema perfectly. Any workflow whose output feeds a decision needs a plausibility gate (minimum lengths, required file:line specifics, existence checks) before synthesis.

## 2026-07-22 (later)

Four scaffold defects reported by the bobi-suite extraction, each reproduced before fixing.

- **`globals.css` build failure fixed.** Line 2 read `@plugin "tw-animate-css";` and must be `@import`. The `@plugin` form throws `ERR_UNKNOWN_FILE_EXTENSION ".css"` on Tailwind 4.2 + tw-animate-css 1.3.3, so **every repo freshly scaffolded from this template broke the moment it compiled CSS.** Confirmed against three shipping apps (mastjoba, bobilabs, worktracker) on identical versions: all three use `@import`. The scaffold was alone and wrong.
- **CI actions un-deprecated.** `actions/checkout` and `actions/setup-node` bumped v4 → v5 (GitHub force-runs Node 20 actions on Node 24 and has a deprecation clock on them); `pnpm/action-setup` pinned to `v4.1.0`.
- **New recipe: [source-only workspace packages](docs/recipes/source-only-packages.md).** Captures the consumer requirements that fail silently (`transpilePackages`, Tailwind `@source`), the third-party-CSS rule (peer dependency + consumer-side `@import ... layer(base)`, never vendored), and the **smoke-build rule**: a package is not done until a throwaway consumer app has built against it. That rule exists because a package passed typecheck, 95 tests, and an adversarial review while being impossible to import.

## 2026-07-22

- **.gitignore: `node_modules/` unanchored** (was root-anchored `/node_modules`). The root-anchored form misses nested `packages/*/node_modules` the moment a clone becomes a pnpm workspace, which the bobi-suite scaffold hit on day one. One-line fix, no behavior change for single-package clones.

## 2026-07-14

- **Umbrella pattern becomes a first-class opt-in** (operator call, upgrading yesterday's recipe-only treatment). README gains a "Scaling up: many repos, many sessions" section describing the master-chat + pointed-worker-chat model, when to adopt, and when to deliberately skip. New `docs/recipes/umbrella-starter/` ships copy-paste adoption files: genericized protocol README, per-project log template (with entry + work-order formats inline), decisions-changelog template, and CLAUDE.md blocks for keeper vs participant repos. The recipe doc gains an "Adopting it" section wiring these together. Still NOT default scaffold: nothing activates in a clone (no CLAUDE.md block, no `docs/umbrella/`) until a project copies the starters in; single-repo projects remain untouched by design. One deliberate carve-out, so it is not re-litigated: the log-entry wire format (`## YYYY-MM-DD — title — from X` and the `[status] —` lines) keeps its em-dash separators. That format is field-proven across the live umbrella's logs and is machine-scannable structure, not prose; the no-em-dash rule continues to apply to all prose around it.

## 2026-07-13

- **Recipe added: multi-session orchestration** (`docs/recipes/multi-session-orchestration.md`, first entry in a new `docs/recipes/` dir). Actions the `[idea-only]` umbrella-protocol candidate from `backport-candidates.md` at exactly the treatment that entry prescribed: a documented situational method, explicitly NOT standardized into the scaffold. Operator-requested after the pattern carried a multi-repo marketing build-out. Adds the parts the original candidate predated: the master-chat + pointed-worker-chat session hierarchy, the work-order entry format, context-window hygiene (pointed same-tree chats exhaust context slower and stay more accurate), and the failure modes (reporting gaps, stale status markers, keeper resolution rights). Single-repo projects should keep ignoring all of it.

## 2026-05-17

Git-hygiene and cross-chat continuity pass. Root-caused by a real client project where a permanent obligation (filing call transcripts) lapsed silently because the convention had a home but no lifecycle trigger and no mechanical check. It survived only on someone remembering, which fails across context-constricted chats.

- **Session lifecycle, enforced.** `CLAUDE.md` now carries a Session-START drift-check step and a full Session-END checklist (file transcripts, refresh handoff/session_history, update TODO, capture lessons). The END trigger fires regardless of task relevance, which is the exact gap that relevance-gated context loading cannot close.
- **`./ops.sh check-integrity`** (`scripts/check-integrity.mjs`): dependency-free, template-portable drift detector. Flags unfiled `.tmp/` transcripts, `.transcripts/` files missing from `docs/calls/INDEX.md`, and stale `handoff_note.md` / `session_history.md` vs the last commit. Advisory by default, `--strict` for hook-chaining.
- **`docs/calls/INDEX.md` is now standard, not optional.** A stub ships with the template. It is the source of truth `check-integrity` diffs against.
- **CI.** `.github/workflows/ci.yml` runs `./ops.sh check` + `./ops.sh test` + `./ops.sh build` on every PR and push to `main`, so CI and local never disagree.
- **Commit convention** added to `CLAUDE.md`: atomic, conventional-prefixed, what-in-subject / why-in-body. The log should read as a narrative.
- **Skills added:** `/cicd` (generates the CI file above) and `/prose` (strict no-em-dash, no-AI-tell writing, binds all output including commits and docs).
- **`CONTRIBUTING.md`** added: documents both the new-project ritual and the template-evolution ritual. The template's value is its process, so the process is now written down.

## 2026-05-14

- MIT license added.

## 2026-04-24

Initial scaffold built out.

- Workflow foundation: `CLAUDE.md` session-start checklist, `.gitignore`, call-notes convention, README rebrand.
- Memory-template system: the 4 universal feedback principles plus structural `project_/user_/reference_/session_history` templates. This is bobi-stack's strongest original asset.
- Onboarding + scripts: genericized Drive CLI, `pull-doc-images`, `extract-docx`, `starting-a-new-project.md`, `migrating-an-existing-project.md`. `docs/SUMMARY` linked to the new guides.

## Deferred by design

Recorded so a future session does not re-decide these from scratch. Revisit only if the stated condition changes.

- **Semver tags, `make release-*` targets, tag-triggered release CI, build artifacts, marketing site.** bobi-stack is clone-and-fill with no version-pinned consumers, so this release machinery would be process for its own sake. **Revisit if** bobi-stack becomes a genuinely published, version-pinned artifact.
- **PR/issue templates, commitlint, branch protection as config, Dependabot.** Useful at team scale. bobi-stack has a single maintainer. The commit convention in `CLAUDE.md` plus CI is the proportionate amount of structure for now. **Revisit if** more than one person regularly commits here.
