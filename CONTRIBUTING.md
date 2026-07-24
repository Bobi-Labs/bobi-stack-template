# Contributing to bobi-stack

This repo is a **clone-and-fill scaffold**, not a published package. Nobody installs it at a version; you copy it, strip its git history, and grow a project from it. Its value is the *process* baked in, so the process is written down here.

## Two kinds of work

### 1. Spinning up a new project from the template

Follow `docs/starting-a-new-project.md` end to end. Do not improvise the setup, the doc is the contract. If a step is wrong or stale, fix the doc in the same session you hit the problem.

### 2. Evolving the template itself

The template improves by back-porting patterns proven in real downstream projects (this is exactly how the session-integrity scaffolding landed: it was learned the hard way in a client project, then generalized back here). When you change the template:

- **Back-port, do not invent.** A pattern earns its place in the template by working in a real project first. Generalize it (strip project-specific names, derive from cwd, etc.), then bring it here.
- **Conventional, atomic commits.** `type(scope): imperative summary`. One logical change per commit. The log is the changelog's raw material. See the Commits convention in `CLAUDE.md`.
- **CI must pass.** `.github/workflows/ci.yml` runs `./ops.sh check` + `./ops.sh test` + `./ops.sh build` on every PR and push to `main`. Green before merge.
  **Know what that means here, though.** Those steps are gated on a `pnpm-lock.yaml` existing, which is deliberate: a freshly generated repo has no lockfile and should not spam failure emails before anyone has filled it in. The consequence is that in *this* repo, which is the bare template and has never had a lockfile, CI reports green without having run anything. So a green tick on a bobi-stack PR means "nothing to check", not "checks passed". Verify template changes locally, and do not read the badge as coverage.
- **Update `CHANGELOG.md`.** One human-written entry per meaningful change, keyed by date. This is what a downstream project reads to decide whether to re-pull a pattern.
- **Run `./ops.sh check-integrity`** before wrapping. It is the mechanical guard against the exact failure mode this template now defends against: a permanent obligation with no lifecycle trigger.

## The session lifecycle

`CLAUDE.md` carries a Session-START and a Session-END checklist. They are not optional ceremony, they are the load-bearing fix for cross-chat knowledge loss. Read them. The END checklist is the one that gets skipped and the one that matters most.

## Release posture (deliberately minimal)

bobi-stack is **not** semver-tagged or release-automated, on purpose. Tags, `make release-*` targets, tag-triggered release CI, and build artifacts solve a problem a clone-and-fill scaffold does not have: it has no installed consumers pinning a version. Adding that machinery now would be process for its own sake.

If bobi-stack ever becomes a genuinely published, version-pinned artifact, revisit this. The rationale and the specific deferred mechanisms are recorded in `CHANGELOG.md` under "Deferred by design" so a future session does not re-litigate the decision from scratch.

## Style

The `/prose` skill binds all prose output here, including commit messages, docs, and PR text: no em dashes, no AI-tell vocabulary, plain direct writing. Write the way a sharp engineer writes quickly to a colleague.
