---
name: bosskey
description: Turn your recent git history into a standup-ready status update.
user-invocable: true
---

# /bosskey: Status Update Generator

Turn your recent git history into a standup script that sounds good without inviting follow-up questions.

## Steps

### 1. Identify the user

Run `git config user.name` to get the current user's git identity.

### 2. Gather recent commits

Collect the last 3 days of commits OR the last 10 commits (whichever set is larger), filtered to the user.

### 3. Review the actual changes

For each commit, read the diff. Don't just rely on commit messages. Look at the code.

### 4. Synthesize a status update

**Tone:** Confident but casual. "Catching up a coworker" not "presenting to the board." Vague enough that nobody asks follow-ups, specific enough to sound real.

**Translation guide:**
- Fixed a null pointer → "Hardened some edge cases in the data pipeline"
- Added a CSS margin → "Polished the UX on a key workflow"
- Refactored a function → "Cleaned up some tech debt in a core module"
- Updated dependencies → "Took care of some security and stability stuff"
- Wrote tests → "Added coverage on some critical paths"
- Debugged for 4 hours, changed one line → "Tracked down a subtle bug and got it fixed"

3-6 bullet points max, plus one-liner for "what's next." No em dashes. Short sentences. Contractions are good.

### 5. Output format

**Full version:**
> Here's where I'm at:
> - [bullet 1]
> - [bullet 2]
> - ...
> Next up I'm [one liner].

**Hallway version:**
> "Been heads down on [summary], making good progress."
