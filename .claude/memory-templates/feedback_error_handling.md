---
name: Fail loudly in client-facing steps
description: When a user-visible action can fail, surface a specific error with a path forward. Silent failure masks fixable user actions and erodes trust faster than visible bugs.
type: feedback
---

Client-facing steps that can fail silently must surface the actual reason and give the user a path forward. This is non-negotiable on anything the client or their staff clicks.

**Why:** Silent failure is the failure mode that erodes client trust fastest. Each instance surfaces as the client asking "is it broken?" rather than the system saying "here's what went wrong." That's the inverse of the experience you want to deliver.

**How to apply:**

1. **On any user-triggered action that can fail**, the UI must show a toast / banner / inline error with:
   - *What* went wrong in plain language (not "Upload failed")
   - *Why*, if known (empty file, invalid format, network, auth, size)
   - *What to do next* (re-export the file, check connection, try a smaller file, contact support)

2. **Prefer server-side validation with structured errors** — the API returns `{ error: "<plain-english reason>" }`; the UI parses and displays it in the toast description. Don't drop the body.

3. **Fail early** — reject empty files, oversized files, obviously-wrong formats at the edge. Don't let them reach the downstream service and surface as a generic 500.

4. **Magic-byte / signature checks** where a MIME type lies. PDFs that aren't PDFs, spreadsheets that are HTML exports, etc. Validate intent, not just the label.

5. **If the failure is the user's side of a fixable condition** (wrong file format, expired session, over quota), tell them how to fix it. Specific > generic.

6. **Mute for background jobs, not for user-visible actions.** Cron jobs can log and email; user clicks must surface.

7. **Apply this at build time, not after a bug report.** Every new upload/create/submit endpoint gets this pattern baked in from commit one.

**Related principles:**

- `feedback_client_facing_quality.md` — broader form/save robustness rule, same spirit
