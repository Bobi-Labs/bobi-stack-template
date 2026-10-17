# Changelog

Date-keyed, hand-written, one entry per meaningful change. **Not semver.** bobi-stack is a clone-and-fill scaffold with no version-pinned consumers, so it is not tagged or released (see "Deferred by design" at the bottom for the rationale, so it does not get re-litigated).

A downstream project reads this to decide whether a pattern is worth re-pulling. Keep entries about *what changed and why it matters to a project built on this*, not commit-by-commit detail.

## 2026-10-17

Agents that agree too easily, and builds nobody stress-tested before starting.

- **New in CLAUDE.md: "Hold your position."** Pushing back once and folding on the second exchange is
  the same failure as never pushing back. Make the case with evidence and the cost of being wrong;
  change your view when the evidence changes, not when the operator repeats himself; when persuaded,
  say what persuaded you; tell the operator when he is wrong. The decision stays his.

- **New in CLAUDE.md: "Run a pre-mortem before a big build."** Assume it shipped and failed, list
  why, fix the causes that are cheap to prevent now.

- **New in `docs/multi-agent.md`: every box names the keeper and its one channel, and disagreement
  between boxes has a settlement path.** Boxes defer to each other the way a model defers to its
  user, so agreement looks settled when nobody checked. A disagreeing box makes its case; a proposal
  is answered with what was checked, never "taken" alone; two rounds, then structure goes to the
  keeper, plans go to the operator, and when the keeper is a party a fresh one-off session rules on
  the two written cases.

- **Next 16.2.12 to 16.3.8, pnpm 10.15.1 to 10.34.7.** 16.3.6 is the floor for the September
  security advisories; `eslint-config-next` is now pinned to the same minor (`~16.3.8`) because a
  caret let it run ahead to 16.4. Projects on 16.2 or earlier should take this bump.

- **pnpm overrides for `nanoid` (>=3.3.18) and `source-map-js` (>=1.2.2).** Both arrive through
  Next's pinned postcss, so no Next bump fixes them; the override does. Drop it when Next's postcss
  moves past them.

## 2026-08-13 (later)

Completes the August back-port begun this morning: multi-agent coordination, claims discipline, and
a session-end step for recurring obligations.

- **New: `docs/multi-agent.md`** — the first scaffold content for estates where several agent seats
  work many repos. **Explicitly skippable for single-box projects**, and says so in its first line.
  Six load-bearing rules (one repo one owner with carve-outs *named*; walls ship with a sanctioned
  channel or get breached by necessity; seams where the file is a channel and not an owner; one
  operator board written directly by every box; aggregators read the newest entry and both marker
  forms; two boxes in one repo need a seat qualifier on every shared instruction). Ends with the
  failure catalogue it was built from, one line per incident, so the rules read as earned.

- **New: "Claims and public surfaces" in CLAUDE.md.** The dangerous claims surfaces are the ones that
  do not look like documents: seed data, dashboard headlines, knowledge folders, page copy. Every
  public figure verifiable on request; retired things speak in past tense everywhere the day they
  retire; a public refusal constrains the roadmap; announce or decide on the record not to;
  built-but-unexercised proves nothing; and the kill told with numbers is a better story than the
  limp-along.

- **Session-END gains step 8: sweep recurring obligations.** Relevance-gated context loading
  structurally cannot catch an obligation that was irrelevant to today's task — a demo trailing the
  product, a shared log owed a reply, a surface that must flip to past tense. The boundary is the
  only place those get caught, so the boundary now owns them.

## 2026-08-13

Three sections added to `CLAUDE.md` plus a new `docs/SECURITY-DECISIONS.md` template. All of it is
back-ported from a two-week window on a live estate where each lesson cost something specific. The
scaffold's previous entry was 2026-07-30, so everything below was being re-learned by hand in every
project built on it.

- **New: "Working with the operator".** Answer first and put detail in a file, because a reply that
  buries its conclusion in paragraph four costs the reader the time it took to find it. Anything the
  operator must do himself carries **numbered steps to execute** with exact paths and commands, a
  statement of what you verified safe, and an observable finished-when: a handoff explaining *why* but
  not *how* hands him the research on top of the work, when you already did that research. Open items
  **name the question, never the owner**, because "X owes a decision" is a phantom that still looks
  legitimate nine days later.

- **New: "Verification: check the instrument, not just the result".** The largest single source of
  wasted work in the source estate was not bad code, it was trusting a tool that was lying. Nine
  incidents, one shape. A malformed grep nearly produced a false all-clear on a live CVSS 8.2. `curl`
  and `WebFetch` both cleared a page that was serving a real client's name in rendered text, because
  a fetch only sees the shell of a client-rendered page. One project card needed two migrations
  because the long-form copy lived in a second column and only the render showed it. **A negative
  result from a tool is a claim about the tool as much as about the world**, so a reassuring surprise
  earns the same suspicion as an alarming one. Also covers gates: one that tests the wrong hurdle
  stays undecidable forever, one whose closing check cannot see the failure it prevents certifies that
  failure, and an aggregator reading one field loses everything filed in the other.

- **New: "Security"**, with `docs/SECURITY-DECISIONS.md` as its companion. **Triage by role, not by
  count** - skipping that step does not create noise, it *inverts priority*, proven when thirty
  harmless findings reached the operator as an emergency while a credential reaching client personal
  data sat twelve days. **Probe, do not classify**: rule class decides how hard you look, never
  whether a finding is real, since the most serious credential in that estate was a plaintext password
  filed under the scanner's noisiest rule. Never infer liveness from a token's own `exp` (two
  confirmed-dead keys claimed a decade out). Plus **no credential before its consumer exists**, since
  an unused key cannot do anything useful, can leak, and starts a rotation clock.

- **Two scanner defects shipped as warnings**, both of which made a sweep report false confidence:
  `[ -d .git ]` skips git worktrees where `.git` is a file, silently excluding working trees from a
  scan that claimed full coverage; and scanning history answers per-repo rather than per-branch, so a
  fix on one branch makes every branch look fixed. In the source estate two branches read a password
  from the environment while a third hardcoded it in fifteen files, and the repo scanned clean.

- **Why `SECURITY-DECISIONS.md` is a template and not a doc:** a finding with no recorded verdict is a
  novel finding every single time. Git history keeps a credential forever, context does not carry
  between sessions, and with no decision to consult, escalating a plaintext credential is
  textbook-correct behaviour. The loop is structural and it re-fires forever without this file.

## 2026-07-30 (later)

- **New: `./ops.sh secret-scan`** (`scripts/secret-scan.sh`), promoted from the tools box after passing an exercise gate: made to catch a deliberately planted secret, then shown to report clean once removed. It wraps gitleaks over a repo's FULL HISTORY, because redaction at HEAD is cosmetic and only rotation is a remedy. **Deliberately a command, not a pre-push hook**: a false positive during a live incident is how a check earns being ignored, and `--no-verify` teaches exactly the wrong reflex. Exits 127 with install instructions when gitleaks is absent rather than failing confusingly. Why it matters for private projects: GitHub's secret scanning is a paid add-on for private repos (verified, API 422), so a private repo has no scanner by default. On its first fleet run across 24 repos it found secrets in history in 4 of them, including a private key in a real-money trading script. **A gitleaks quirk worth knowing before trusting your own wrapper:** on 8.30.1 the process exit code does not signal leaks (a leaky scan exits 0, with or without `--exit-code`), so the verdict must be judged from the JSON report, and `NUL` or `/dev/null` as a report path turns every run into an error.

## 2026-07-29

Onboarding and orchestration overhaul, driven by a week of running a fifteen-box tree in anger. Two problems: a fresh machine discovered its missing tooling one failure at a time, and the orchestration recipe still taught the flat keeper-and-consumers model the tree had already outgrown.

- **New: [`docs/prerequisites.md`](docs/prerequisites.md).** The complete toolchain in install order (Node, pnpm, Git, Claude Code, the `gh`, `vercel`, and `supabase` CLIs), what each unlocks, the accounts, a verification block, and four traps that read as broken code when they are actually setup: the ESLint 9 pin, `gen-types` overwriting hand-maintained types, CLI-created Vercel projects where a push does not deploy, and IPv6-only direct Postgres hosts. The setup docs previously mentioned each CLI inline, mid-procedure, which is how a prerequisite becomes a surprise.
- **README gains a "Start here" section.** Five ordered steps, each assuming the one above it. Also corrected a stale claim: the scaffold ships Next 16 and React 19, not Next 14.
- **[Multi-session orchestration](docs/recipes/multi-session-orchestration.md) rewritten to the chat tree.** Boxes rather than chats (a box is a directory plus a log, and outlives any conversation), three tiers with a confidentiality wall between client work and everything else, sub-keepers earned at two or more concurrent chats rather than granted by default, flat disk layout for a mechanical reason (per-repo memory is keyed to a path-derived slug, so moving a repo orphans its history), and the six rules with their reasoning inline.
- **New starter templates.** `CHAT-TREE.template.md` (the constitution, adopt at three or more participants) and `chat-standup-prompts.template.md` (one paste-ready kickoff prompt per box, which turns out to be the most-used file in a live tree).
- **The `Waiting on Bees:` line is now mandatory on every log entry.** Imperative one-liners for the operator, maximum three, or the word "nothing". Thorough sessions write thorough conclusions, and a human reading six of them cannot tell a report from a request; this line is the extract, and the keeper aggregates them into one "who needs what" on demand.
- **Seams.** Where one box writes daily under conventions another box owns, routing every routine question through the keeper is pure latency. A seam is a keeper-opened file with a strict subject boundary where two boxes talk directly: conventions, never cases, and nothing crossing the client wall carries client specifics.
- **Three failure modes added to the recipe**, each from a real incident: committed is not shipped (work stacks in front of undeployed code, so cost and surprise grow with the gap), a credential in a private repo is exposed to every collaborator it ever had and only rotation fixes it, and a verification that cannot fail proves nothing (break it deliberately, confirm it catches that, restore).


## 2026-07-23

Security hardening, driven by a real incident: a production system turned out to have a full authentication bypass reachable with one curl command, alongside an app that had been quietly dying in users' browsers for months. Neither was bad code; both were habits. The incident record is held privately by the system owner; the transferable rules live in the recipe.

- **New recipe: [security and failure modes](docs/recipes/security-and-failure-modes.md).** The five habits (an exemption list that grew by convenience; authentication mistaken for authorization; silent failure modes; a fix that was written and never shipped; a workaround that outlived its cause) and the 19-item checklist. Flagged as not-situational: this one is for every project.
- **New: `lib/auth/require-role.ts`.** `requireRole(...)` and `requireCronSecret(...)`, shipped on day one so the complete check is the path of least resistance. `getUser()` answers "is this someone?"; the question is "is this someone who may do *this*?" Roles read from `app_metadata` (service-role-writable) and never `user_metadata` (user-writable). Cron helper returns 401 rather than a redirect, because a 307 silently breaks schedulers that follow it and report success.
- **New: `./ops.sh audit-security`** (`scripts/audit-security.mjs`), wired into CI with `--strict`. Checks the greppable half: undocumented auth exemptions, exempt service-role routes with no caller check, authentication without authorization, webhooks without secret verification, privilege downgrade on failure, Supabase `lock` overrides, unexplained `Infinity` caches, service-worker deploy skew. Calibrated against six real codebases until the clean ones reported clean, because a tool that cries wolf gets ignored. **On its first run it found the same authentication bypass in a sibling repo**, same route, same missing check, same comment where a guard belonged. That one was removed and verified in production the same day, which is the point of a scanner that runs everywhere rather than once.

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

- **Umbrella pattern becomes a first-class opt-in** (operator call, upgrading yesterday's recipe-only treatment). README gains a "Scaling up: many repos, many sessions" section describing the master-chat + pointed-worker-chat model, when to adopt, and when to deliberately skip. New `docs/recipes/umbrella-starter/` ships copy-paste adoption files: genericized protocol README, per-project log template (with entry + work-order formats inline), decisions-changelog template, and CLAUDE.md blocks for keeper vs participant repos. The recipe doc gains an "Adopting it" section wiring these together. Still NOT default scaffold: nothing activates in a clone (no CLAUDE.md block, no `docs/umbrella/`) until a project copies the starters in; single-repo projects remain untouched by design. The log-entry wire format originally kept em-dash separators as a deliberate carve-out, on the grounds that it was machine-scannable structure rather than prose. That carve-out was retired on 2026-07-24: the no-dash rule is absolute, with no structural exemption. The templates now use a colon after the date and commas between fields. Entries already written in the live umbrella logs are append-only history and stay as they are.

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
