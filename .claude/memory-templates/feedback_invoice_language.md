---
name: Invoice + client-facing language rule
description: What belongs on client-facing invoices and deliverable lists, and what doesn't
type: feedback
---

**The rule:** Client-facing deliverable lists, invoices, and "What You Can Do Now" sections describe **capabilities and outcomes**, not internal engineering work.

**Do NOT put on a client invoice:**

- Dev jargon or file paths (`/api/some-endpoint`, "Zod validation", "SQL view v_foo", "TypeScript orchestrator")
- Bug fixes, even significant ones: they're build hardening, not billable deliverables
- Data cleanup of errors we introduced: fixing our own mistake, not delivering value
- Small UI polish (button wiring, hover cursor, empty states, role badges): part of shipping, not a line item
- Documentation updates (internal docs, memory files): internal hygiene
- Line items that duplicate each other at different levels of detail

**Do put on a client invoice:**

- Capabilities the client can now use that they couldn't before
- Features visible in the UI with a clear user-facing benefit
- Real scope expansions (new pages, new roles, new flows) beyond the original agreement

**Format:** Each line is a feature expressed as "what the user can do" or "what the system now does for them", in plain English with no internal terminology.

**The scope doc is the source of truth** for what was promised. When writing deliverables, pull directly from that document's bullets and rewrite in past-tense-completed form. Don't invent new line items from the commit log.

**When padding is suspected:**

If an invoice has 12+ in-scope items for a week of work, the client is likely to read it as padding. Tighten. Combine related items into outcome-level bullets. A clean 6-8 outcome list reads more professional than a bloated 15-item list that reads like a changelog.

**Out-of-scope "gifts":**

If scope-creep work was delivered beyond the agreement at no additional charge, list it separately as "Extras Delivered / Above and Beyond." Makes the value visible without billing for it, and establishes that the next out-of-scope ask might not be free.
