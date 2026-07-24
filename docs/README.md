# Docs

This folder is the project's living documentation. Every markdown file here serves three purposes:

1. **Human reference**: Lessons learned, architectural decisions, integration quirks, and incident postmortems
2. **AI context**: A knowledge base that AI agents read to understand the project deeply
3. **Publishable docs**: Markdown with a `SUMMARY.md` table of contents, ready to build into a docs site

## Structure

```
docs/
  README.md          # This file: explains the docs convention
  SUMMARY.md         # Table of contents (required for doc site generators)
  index.md           # Landing page / project overview
```

## When to Write a Doc

- You discover non-obvious behavior in an API or library
- You make an architectural decision and want to record the reasoning
- An incident happens and you want to capture what went wrong
- A subsystem is complex enough that future-you would benefit from a walkthrough

## How to Write a Doc

- **One topic per file.** Don't combine unrelated things.
- **Lead with context.** Start with what this is and why it matters.
- **Include concrete examples.** Code snippets, config samples, error messages.
- **Record what surprised you.** The stuff not in official docs is most valuable.
- **Keep it current.** When code changes invalidate a doc, update or remove it.

## For AI Agents

- **Read before you write.** Check `docs/` for existing context on the area you're working in.
- **Write as you go.** When you discover something non-obvious, add it to the relevant doc.
- **Update SUMMARY.md** whenever you add or remove a doc.
- **Don't duplicate CLAUDE.md.** CLAUDE.md is the quick-start reference. Docs are for deep dives.
