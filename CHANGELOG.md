# Changelog

Date-keyed, hand-written, one entry per meaningful change. **Not semver.** bobi-stack is a clone-and-fill scaffold with no version-pinned consumers, so it is not tagged or released (see "Deferred by design" at the bottom for the rationale, so it does not get re-litigated).

A downstream project reads this to decide whether a pattern is worth re-pulling. Keep entries about *what changed and why it matters to a project built on this*, not commit-by-commit detail.

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
