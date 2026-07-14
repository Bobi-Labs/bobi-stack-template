# Changelog

Date-keyed, hand-written, one entry per meaningful change. **Not semver.** bobi-stack is a clone-and-fill scaffold with no version-pinned consumers, so it is not tagged or released (see "Deferred by design" at the bottom for the rationale, so it does not get re-litigated).

A downstream project reads this to decide whether a pattern is worth re-pulling. Keep entries about *what changed and why it matters to a project built on this*, not commit-by-commit detail.

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
