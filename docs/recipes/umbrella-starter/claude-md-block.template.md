# CLAUDE.md blocks for umbrella participants

> **Template file.** Paste the matching block into each repo's CLAUDE.md session-start
> checklist (keeper block into the keeper repo, participant block into every other repo),
> replace placeholders, and renumber `N.` to fit the target checklist. Placeholders as
> defined in `README.template.md`.

## Block for the KEEPER repo's CLAUDE.md

```markdown
N. **Umbrella keeper duties.** This repo is the umbrella keeper for the {{UMBRELLA_NAME}}
   multi-repo coordination protocol. Read `{{STRATEGY_DOC}}` if you haven't this session,
   then `docs/umbrella/_changelog.md` (last ~10 entries), AND scan all
   `docs/umbrella/<project>.log.md` files for `[needs-response]` or `[open]` markers.
   Also sweep for reporting gaps: a participating repo with commits newer than its last
   log entry gets flagged. If any sub-project has filed an entry that needs umbrella-side
   action, address it before the operator's first ask OR flag it in your first response.
   When you act on a log entry, reply in the same log with the resolution. When a decision
   proves durable, promote it to {{STRATEGY_DOC}} + add a `_changelog.md` entry + mark the
   original log entry `[stable]`. Full protocol: `docs/umbrella/README.md`.
```

## Block for each PARTICIPATING repo's CLAUDE.md

```markdown
N. **Umbrella read-in.** This repo participates in the {{UMBRELLA_NAME}} coordination
   protocol; the keeper is `{{KEEPER_REPO}}`. Read `{{KEEPER_PATH}}/{{STRATEGY_DOC}}`
   (umbrella truth), `{{KEEPER_PATH}}/docs/umbrella/_changelog.md` (last ~10 entries),
   and `{{KEEPER_PATH}}/docs/umbrella/{{PROJECT}}.log.md` (last ~10 entries; watch
   for `[needs-response]` / `[open]` / WORK ORDER entries addressed to this repo).
   When this session makes a cross-cutting change (architecture, shared schema, domain,
   brand, sub-product status), append a dated entry to that log and COMMIT it in the
   keeper repo the same session. Routine internal work needs no umbrella entry.
```
