---
name: Session History
description: Consolidated timeline + pointer to full archived chat history across sessions
type: reference
---

# Session History

This file is a **briefing for future Claude sessions** on this project. It tells you what happened, when, where the raw history lives, and how to dig deeper if you need to.

## Timeline at a glance

<!-- Refresh as batches of work complete. -->

| Period | Machine | Topic | Where |
|--------|---------|-------|-------|
| {{YYYY-MM-DD}} – {{YYYY-MM-DD}} | {{machine}} | {{batch description}} | `{{path to JSONL archive if applicable}}` |

## What has shipped

<!-- High-level summary of phases or features that are done. Reference committed docs for detail. -->

- Phase 1 — {{status}}
- Phase 2 — {{status}}

## Key decisions & rules (don't re-ask)

<!-- Pointers to memory files the next session should read in full. -->

- `feedback_error_handling.md` — fail loudly in client-facing steps
- `feedback_mutual_check_in.md` — push back honestly
- `feedback_client_facing_quality.md` — forms + saves must be bulletproof
- `feedback_invoice_language.md` — invoices describe capabilities
- `user_{{person}}.md` — {{short description, if applicable}}
- `project_{{state}}.md` — {{short description, if applicable}}

## Known issues / watchouts

<!-- Ongoing problems, recurring pitfalls, things to double-check. -->

1. {{watchout}}

## Deep-dive pointers

If the actual conversation content is needed for a specific date or topic, grep the JSONL chat archive files. Each line is a JSON object with `timestamp`, `content`, and type fields.

```bash
# Example: find messages in a chat archive mentioning a specific topic
grep -l "<topic>" ~/.claude/projects/<project-slug>/*.jsonl

# Example: extract user messages from a specific session
grep '"role":"user"' <session-id>.jsonl | grep -oE '"content":"[^"]{0,500}'
```

## How to use this file

At session start, read this file FIRST. It tells you what's been done, where the full history lives if a deep-dive is needed, and what the hard rules are that must not be re-litigated. Then read the individual `feedback_*`, `project_*`, and `user_*` files for the full context of each rule. Only then touch client-facing work.
