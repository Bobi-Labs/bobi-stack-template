---
name: docs
description: Capture conversation learnings into docs and clean up the docs folder.
user-invocable: true
---

# /docs: Documentation Update

Capture learnings from the current conversation and clean up the docs folder.

## Steps

### 1. Gather context

Review the conversation for decisions, architectural changes, and new features. Read CLAUDE.md and list existing docs.

### 2. Capture new information

Find the right home for each learning. Prefer existing docs. Create new files only for substantial topics. Match existing tone and include reasoning.

### 3. Clean up and consolidate

Scan all docs for:
- Stale references to removed code
- Incorrect details
- Redundancy across files
- Dead links
- Outdated examples

Reframe "we used to do X" as "we do Y because [reason]." Only preserve lessons likely to recur.

### 4. Update CLAUDE.md

Apply the same cleanup, because it loads into every conversation.

### 5. Clarity pass

Lead with plain language, introduce jargon on first use, keep sentences short, use active voice.

### 6. Summary

Report what was captured, removed, consolidated, and clarified.
