# Call Notes

Parsed notes from calls (client, team, vendor). One file per call.

## Convention

- **Filename**: `YYYY-MM-DD-short-slug.md` — date-sortable, content-descriptive
- **Raw transcripts**: live in `.transcripts/` (gitignored) at the same filename with `.txt`
- **Parsed version committed**; raw stays local-only to keep the repo lean

## Format

Each file follows this skeleton:

```markdown
# YYYY-MM-DD — Title

**Participants:** who was on the call
**Duration:** rough estimate
**Raw:** `.transcripts/YYYY-MM-DD-slug.txt`

## TL;DR
3–5 bullets. What was decided + direction.

## Decisions
Explicit decisions made, in bullet form.

## Action Items
| # | What | Owner | Priority |

## Open Questions
What's still undecided.

## Notable Quotes
Direct quotes worth preserving for memory/context. Attribute correctly —
auto-transcripts often mis-label speakers, so verify against the raw.

## Context / Color
Business-state or interpersonal notes that color how to interpret the
decisions. (E.g., "primary contact on leave until X" — explains why asks
are backing up.)
```

## Why parse vs. just keep raws?

Auto-transcripts are high-noise: verbal filler, overlapping speakers,
mis-labels, typos. Grepping them wastes tokens and produces shaky
citations. The parsed version is the searchable, quotable artifact —
raw stays local for verification if a parsed claim ever comes into
question.

When parsing: distrust speaker labels. The auto-transcriber routinely
flips roles across the same file.

## INDEX.md

For projects with many calls, maintain an `INDEX.md` in this folder
listing each call's date + topic hint + raw file path + parsed note
path. Lets future sessions locate a specific call fast without
grepping transcripts.
