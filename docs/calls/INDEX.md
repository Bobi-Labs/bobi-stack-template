# Call Transcript Index

Chronological index of calls (client, team, vendor). Raw transcripts live in `.transcripts/` (gitignored); a parsed note lives in `docs/calls/` when a call has been deep-parsed.

**Topic hints are inferred starting points, not authoritative summaries.** When a specific call becomes relevant, deep-parse it into a dated note file in this folder following the template in [README.md](README.md).

This file is the source of truth `./ops.sh check-integrity` diffs against. Keep one row per call, added at session-end (see the Session-END checklist in `CLAUDE.md`).

| Date | Topic Hint | Raw | Parsed Note |
|------|------------|-----|-------------|
| _YYYY-MM-DD_ | _first call (replace this row)_ | `.transcripts/YYYY-MM-DD-slug.txt` | n/a |

## Parsing on demand

Auto-transcribers produce high-noise output. Full parsing is costly in context. Deep-parse only when a call's content becomes load-bearing for current work. To request a deep parse: reference the date or topic, point at the raw file, and the parse lands in `docs/calls/YYYY-MM-DD-slug.md` following the template in [README.md](README.md).

## Why raw stays local-only

- High noise-to-signal: grepping a long transcript for one quote wastes tokens
- Speaker labels are routinely wrong: auto-transcribers flip roles
- Committed parsed notes preserve the signal; raw is preserved locally for verification when needed
