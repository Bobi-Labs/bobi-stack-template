# Recipe: security and failure modes

**Not situational. Read this one.** Everything here comes from a single day in 2026 when two independent classes of failure surfaced in a live client system: a full authentication bypass reachable with one curl command, and an app that had been quietly dying in users' browsers for months. Neither was caused by bad code. Both were caused by habits that felt reasonable at the time.

The full incident record lives in the keeper repo (held privately). This is the transferable part.

Run `./ops.sh audit-security` to check the mechanical subset. The rest needs eyes.

## The five habits that caused it

### 1. An exemption list that grew by convenience

Every security hole traced to one list of path prefixes that skip the session check. It started legitimately (a webhook and a cron job genuinely cannot present a session cookie) and grew: one reasonable-looking prefix at a time. Each addition was locally reasonable and globally catastrophic, because the exemption was justified by a comment rather than a compensating control:

> "These routes handle their own auth via the client-side auth provider."

That provider runs in the browser. It protects the UI, not the API. The comment was true, irrelevant, and load-bearing for years.

**Rule:** exempt exact paths, never trees. Every route added under a prefix later inherits an exemption nobody re-evaluated. Each entry must name the caller that cannot hold a session *and* the check that replaces it.

### 2. Authentication mistaken for authorization

The quiet variant of the same habit. Routes correctly verified that a caller was signed in, then did nothing with the answer. Any account of any role could write rows with the service role, submit records that were meant to be restricted, and spend money on a paid AI endpoint with a caller-supplied prompt.

`getUser()` answers "is this someone?" and reads like security. The question that matters is "is this someone who may do **this**?"

**Rule:** ship `requireRole(...)` on day one (`lib/auth/require-role.ts` in this scaffold) so the complete check is the path of least resistance. When only the easy half is convenient, only the easy half gets written.

Read roles from `app_metadata`, never `user_metadata`: the latter is user-writable, so a caller could grant themselves anything.

**Valid exception:** authenticating and then querying through the RLS-bound client is real authorization, because RLS constrains the rows. The dangerous shape is authenticating and then reaching for the service role, which bypasses RLS entirely and leaves nothing constraining the caller.

### 3. Silent failure modes chosen for convenience

Three places chose "keep going quietly" over "fail loudly": an anon-key fallback on timeout (which returns HTTP 200 and an empty array, cached by the query layer as *success*), a fire-and-forget mutation with a self-clearing form, and a global error handler that returned early whenever stale data existed.

Each was defensible alone. Together they made a completely broken application look merely **empty**, which is why it went undiagnosed for months and why the client, not the monitoring, was the detection mechanism.

**Rule:** a failure that renders as absence is worse than a crash. Empty state and error state must look different. Every write path must be able to report its own failure. Never downgrade privilege on error: throw.

### 4. A fix that was written and never shipped

The most uncomfortable one. The bug had been correctly diagnosed three weeks earlier, with a written post-mortem and three commits that fixed it, sitting on a local branch in a separate worktree that had drifted 199 commits behind origin. Never pushed. The client experienced a solved bug for three weeks.

**Rule:** work is done when it is deployed and observed, not when it is committed. `git branch -a --contains <sha>` before believing a fix is live. A branch that is not the deployment branch is a drawer.

### 5. A workaround that outlived its cause

An `Infinity` cache was added to dodge a spinner. The spinner was caused by a bug that was later fixed; the workaround stayed and became its own bug, leaving the board unable to recover from a single failed fetch.

**Rule:** every workaround cites the defect it compensates for, so it can be removed when that defect is fixed. An unexplained `Infinity` is permanent by default.

## The checklist

**Auth and routing**

1. No prefix-wide auth exemptions. Exempt exact paths; each entry names its caller and its replacement check in a comment.
2. `requireRole(...)` on every mutating route. Authentication is not authorization.
3. Every webhook verifies a shared secret and **fails closed** when the secret is unconfigured. An unset secret is a broken deploy, not an open door.
4. Never assume client-side auth protects a server route. Say out loud which layer enforces each route.
5. Any route using a service-role client must authenticate *and* authorize its caller itself. Grep for the admin client; audit every hit.
6. Cron-called routes return **401**, not a redirect. A 307 silently breaks the scheduler, which follows it and reports success while nothing ran.
7. Internal server-to-server calls need credentials too. A gated route calling an ungated sibling gates nothing.

**Failure behaviour**

8. Never fall back to a lower-privilege key on timeout. Throw.
9. Every mutation is awaited, and its form reports failure without discarding the user's input.
10. Empty state and error state must look different.
11. Session expiry is a page-level condition: a persistent banner, not a toast (toast stores drop messages under load).

**Client lifecycle**

12. Do not override the Supabase auth `lock`. It is cross-tab leader election for refresh tokens; without it every tab refreshes independently, one wins, and the rest get `refresh_token_already_used`, which signs them out.
13. A client-state SPA never re-enters middleware, so a dropped session renders a spinner forever with no redirect. Add explicit visibility/focus revalidation and a recovery screen.
14. `skipWaiting` + `clientsClaim` requires a `controllerchange` reload plus a chunk-error self-heal, or every deploy breaks every open tab until the user hard-refreshes.
15. Handle document navigations explicitly in the service worker. Framework defaults frequently mismatch them.
16. No unexplained `Infinity` caches.

**Process**

17. `git branch -a --contains <sha>` before believing a fix shipped.
18. Force-logout after security events and credential rotation, **not** after routine deploys. Habitual logouts train users to expect breakage and can strand offline field workers mid-sync.
19. When the client is your monitoring, you have no monitoring.

## Why a script and not just this document

A convention stated in a document is a request. Items 1, 2, 3, 5, 8, 12, 14 and 16 above are greppable, so `scripts/audit-security.mjs` checks them and CI fails on them. The script was calibrated against six real codebases until it reported clean on the clean ones, because a tool that cries wolf trains people to ignore it.

It found a live authentication bypass in a sibling repo on its first run: the same route, the same missing check, the same comment where a guard belonged. That is the argument for running it everywhere rather than trusting that a lesson learned in one repo stays learned.
