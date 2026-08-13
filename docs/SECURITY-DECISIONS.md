# Security decisions: check here BEFORE escalating a credential finding

**Read this file the moment you find a credential, key, token or password.** Not at session start,
not later: at the moment of the finding, before writing a word to the operator.

## Why this file exists

**A finding with no recorded verdict is a novel finding every single time.**

This pattern was created after an operator was asked to rotate something several times a week across
a fleet of projects and called it what it was: a time sink. The cause was not agent indiscipline. It
was structural, and every part of it will recur in any project without this file:

- **The trigger is permanent.** Git history keeps a committed credential forever, and deleting the
  line at HEAD is cosmetic.
- **Every fresh session meets it for the first time.** Context does not carry between sessions.
- **With no recorded decision to consult, escalating a plaintext credential is textbook-correct
  behaviour.**

So the loop re-fires on schedule, and it re-fires forever. The agent is not being noisy; it is
behaving correctly in the absence of a decision. **This file is where the decision lives.**

## How to use it

1. You find something that looks like a credential.
2. **Read this file first.**
3. If it is listed as `SETTLED`, it is handled. Do not escalate, do not add it to a waiting list, do
   not file it. Mention it only if you have **new evidence**, and say what the new evidence is.
4. If it is not listed, **triage before escalating** (see CLAUDE.md, Security), then file it.
5. Someone records a verdict here, and it stops being novel for every future session.

## OPEN: genuinely live, not noise

<!--
One row per credential that is confirmed live and awaiting rotation. Keep this section SHORT and
keep it honest: anything parked here that is not actually live trains the reader to skim it.
-->

| Raised | Item | State |
|---|---|---|
| | | |

## SETTLED: do not re-raise

<!--
Every resolved finding, with enough detail that a future session recognises it without re-deriving
the verdict. Record dead credentials too, not just rotated ones: "the project no longer exists" is a
verdict worth keeping, and it is the single most common one.
-->

| Date | Item | Verdict |
|---|---|---|
| | | |

## Adding to this file

**One writer.** In a single-agent project, that is you. In a multi-agent estate, the coordinating
seat owns this file and everyone else requests a row, so the file never has two authors.

**If you are about to escalate something that feels familiar, that feeling is the signal it belongs
here.**

## What NOT to record

Not every scanner hit is a decision. A `generic-api-key` match on a config lever name, a row
identifier, a filename or a placeholder is noise, and recording noise here dilutes the file until
nobody reads it.

**Record verdicts on credentials. Tune the scanner for everything else.**
