# Back-port candidates

Patterns proven in downstream Bobi Labs projects that *might* be worth generalizing into the template. Per `CONTRIBUTING.md`, a pattern earns its place by working in a real project first, then being generalized.

**This file is a suggestion queue, not a commitment.** Each entry is graded by a single lens: **would a generic new project (single repo, one or two devs, no studio context) actually care?** A template session evaluating these should weight that lens heavily. The studio ecosystem these came from is unusual; most are not universal. The final generalize-or-skip call belongs to whoever evolves the template, not to the downstream session that filed the candidate.

Status legend: `[strong]` clear keeper for most new projects. `[optional]` good for some project shapes, ship gated or as a recipe. `[idea-only]` situational, document as a possible method, do not standardize.

---

## [strong] Vercel env trailing-newline gotcha

`echo "true" | vercel env add ...` stores the value as `"true\n"` with a trailing newline, which silently breaks `=== "true"` string comparisons in app code. Use `printf "true"` (no newline) instead. Cost a real project one failed deploy before the cause was found.

**New-project relevance:** high and universal. Any project that sets a Vercel env var from the CLI can hit this. One sentence in the `cli-first` skill (Vercel section) or `docs/` deployment notes fully addresses it. Lowest-cost, highest-certainty candidate in this file.

## [strong] Handoff-prompt for a delegated focused session

When a task is too big for the current chat (multi-hour, context-heavy), the proven move is: button up memory + docs, then write a paste-ready handoff prompt that boots a fresh focused session with exactly the context it needs (briefing path, scope boundary, definition of done, what NOT to touch). The template already has a session lifecycle (START/END checklists) but not this explicit delegation pattern.

**New-project relevance:** high. Any project eventually hits a task that should not be done in a context-bloated chat. Worth a short section in `CLAUDE.md` or a `docs/` note describing the handoff-prompt shape. Generic, not studio-specific.

## [optional] Zero-DB public demo recipe

Turning a Supabase app into a public, read-only demo with zero data-leak surface: clone the app, strip out-of-scope surfaces, an `IS_DEMO_MODE` env flag, mock-data fixtures shaped like the DB rows, a recursive Proxy stub that satisfies every supabase-js surface (`from`, `storage`, `rpc`, `channel`) and returns `{ data: null, error: null }` for any unintercepted path, plus a build-time loud-fail guard if real Supabase env vars are present while demo mode is on. Proven end to end in a shipped read-only demo.

**New-project relevance:** medium, shape-dependent. Only matters for projects that will publicly demo a Supabase-backed app without exposing real data (portfolio pieces, sales demos, client-work showcases). Not relevant to internal tools or single-tenant apps. Good candidate for an opt-in `docs/recipes/zero-db-demo.md` or a `/demo-clone` skill, gated, not a default scaffold file.

## [optional] STRATEGY.md as a source-of-truth that outranks CLAUDE.md drift

A dedicated strategy doc holding locked directional decisions (voice, audience, sequencing, architecture) that explicitly wins when it conflicts with CLAUDE.md, and is updated only when an explicit decision changes. Stops the slow drift where a summarizing CLAUDE.md contradicts settled strategy.

**New-project relevance:** medium. Projects with significant locked strategy benefit; small projects where CLAUDE.md is sufficient do not need the extra doc. Worth mentioning as an optional pattern in the template's docs conventions, with a clear "you probably do not need this unless you have real locked strategy" caveat.

## [optional] feedback_winning_work.md as a memory template

A fifth feedback principle: when a copy or design choice is between safer/cleaner and more-likely-to-win-the-work, go with what wins the work and name the tradeoff explicitly. Earned its place across portfolio and positioning work.

**New-project relevance:** low to medium, domain-specific. Only applies to projects with a sales/positioning/portfolio dimension. An internal CRUD tool or client app has no "wins the most work" axis. Candidate for an *optional* memory template (clearly labeled "for client-facing / portfolio / sales-adjacent projects"), not a fifth universal principle. The template's strength is that its four universal principles are genuinely universal; do not dilute that set.

## [idea-only] Path-based multi-deploy rewrite

A portfolio/marketing site fronting separate sub-app demo deployments via `portfolio.tld/<product>/:path*` Vercel rewrites to standalone Vercel projects. Lets one domain showcase many independently-deployed sub-products.

**New-project relevance:** low, situational. Only matters for a studio or portfolio site that hosts multiple demo deployments under one domain. Not a default concern. Document as a one-page recipe if a template session wants it; otherwise skip.

---

## How a template session should use this file

1. Read each candidate through the new-project-relevance lens, not the "was it useful to the studio" lens. The studio context is doing a lot of work in why these felt valuable there.
2. `[strong]` items are low-risk, generalize and ship them.
3. `[optional]` items: decide per project shape, ship gated (opt-in recipe / labeled memory template), never as a default scaffold file.
4. `[idea-only]` items: at most a documented situational method. Standardizing them would be process for its own sake, the exact failure mode `CONTRIBUTING.md`'s release-posture section warns against.
5. When a candidate is actioned or explicitly rejected, move it out of this file: actioned ones get a `CHANGELOG.md` entry, rejected ones get a line in `CHANGELOG.md`'s "Deferred by design" so the decision is not re-litigated.
