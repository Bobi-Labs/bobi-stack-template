---
name: Client-facing quality and form reliability
description: Forms + saves must be rock-solid. Form save bugs surface to the client faster and hit trust harder than almost any other bug class.
type: feedback
---

Form saves and edit functionality must be rock-solid on client-facing projects. When a client or their staff clicks Save and the data doesn't stick — or worse, silently reverts — it creates anxiety and erodes trust in the whole system. Bugs in any other area are recoverable; form-save bugs are trust-killers.

**Why:** Clients replacing paper or spreadsheet processes with software often carry reasonable skepticism about whether the new system is really as reliable as the old one. Every save failure reinforces that skepticism. Even after a bug is fixed, the pattern "I click save and it doesn't work" takes multiple successful sessions to rebuild trust around.

**How to apply:**

- After ANY form/mutation change, test all status combinations (active, closed, upcoming, etc. — whatever the enum values are for that domain).
- Empty fields must coerce to `null`, never empty strings — Postgres rejects `""` for date/number columns and returns cryptic errors.
- Always wire up refetch/invalidation after mutations so the UI reflects saves immediately. Optimistic updates are fine, but verify they reconcile correctly on server response.
- The refresh button must always work — clients use it to verify their changes stuck.
- Don't put internal bug fixes, caching improvements, or dev refactors in client-facing deliverables/done lists — it looks like padding and makes the client suspicious the billable work is gaming hours.
- Test edit flows specifically. Create-flows usually get testing attention; edit-flows get less and are where the regressions accumulate.
- When a form save fails, the error message must tell the user what to do next (see `feedback_error_handling.md`).

**Related principles:**

- `feedback_error_handling.md` — fail loudly when a save can't complete
- `feedback_invoice_language.md` — internal bug fixes don't belong on client-facing invoices
