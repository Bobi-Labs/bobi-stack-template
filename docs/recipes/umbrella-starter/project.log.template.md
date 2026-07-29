# {{PROJECT}} ↔ {{KEEPER_REPO}}: umbrella comms log

> **Template file.** Save as `docs/umbrella/{{PROJECT}}.log.md` in the keeper repo,
> replace placeholders, delete this blockquote. One file per participating repo.

Append-only conversation between the keeper's Claude and {{PROJECT}}'s Claude. See `README.md` in this folder for the protocol + format.

Status markers: `[open]` `[needs-response]` `[resolved]` `[stable]`

---

## {{YYYY-MM-DD}}: log opened (from {{KEEPER_REPO}})

Log file initialized. No open items. When {{PROJECT}}'s Claude makes a cross-cutting change (architecture, schema, brand, sub-product status), append an entry below in the standard format.

**Waiting on Bees:** nothing.
**Status:** [resolved]

<!--
Entry format:

## YYYY-MM-DD: <short title> (from <project|keeper>)

**What changed:** ...
**Why:** ...
**Asks of <other project>:** concrete asks, or "none, FYI".
**Waiting on Bees:** imperative one-liners for the operator, max three, or "nothing".
**Status:** [open] | [needs-response] | [resolved] | [stable]

The Waiting on Bees line is mandatory on every entry. It is the operator-action extract:
what THIS entry needs from the human, stated as things they can do, capped at three. It
exists because thorough sessions write thorough conclusions and a human reading six of
them cannot tell a report from a request. Keeper-facing asks do not go here; they stay in
the body and the status marker.

Work-order format (keeper delegating a build to this project's next session):

## YYYY-MM-DD WORK ORDER: <title> (from <keeper>, the keeper repo)

<Decision context: what the operator approved, one paragraph.>

**What:** <the deliverable>
**Spec:** <schema, routes, constraints, naming rules, out-of-scope>
**Conventions:** <which repo patterns to follow>

Reply here when landed with <the specific facts the keeper needs back>.

**Status:** [needs-response], awaiting a <project> session to claim.
-->
