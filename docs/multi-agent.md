# Running multiple agents across an estate

**Skip this file entirely if one agent works one repo.** Everything here exists because the
single-agent assumption broke on a live estate of 20+ repos with a dozen concurrent agent seats, and
each rule below was written after its absence cost something. If your project is a single box, the
main CLAUDE.md is the whole contract.

Vocabulary: a **box** is a durable agent seat (a directory plus a log that outlives any one chat).
The **keeper** is the coordinating seat that owns the estate-wide files.

## The six load-bearing rules

### 1. One repo, one owner — with carve-outs NAMED, never assumed

Every repo has exactly one box that writes it. Everything else is read-only, and cross-repo asks
travel as log entries, not edits.

The carve-outs that exist are listed explicitly (own log entries in the coordination repo; own
claimed migration files; any shared file the keeper has granted by name). **An unnamed carve-out is
a breach**, even when the edit is correct — because the next session cannot distinguish your good
judgement from drift.

When ownership genuinely transfers (a box is retired, an emergency), the acting seat records *why it
was allowed to act* in the commit itself. Future readers must be able to tell sanctioned crossing
from a wall breach without asking anyone.

### 2. Confidentiality walls need a sanctioned channel, or they fail

**A wall with no sanctioned channel gets breached by necessity.** If box A holds something box B
legitimately needs and no route exists, an agent will eventually route around the wall — correctly,
by its own logic — and the wall is gone.

So every wall ships with its door: cross-cutting findings go **to the keeper, who relays** a
generalised version into the receiving box's own log. Boxes never browse sibling logs. The lesson
crosses; the client detail does not.

### 3. Seams: a sanctioned direct channel, where the file is a channel and not an owner

Two boxes that exchange work constantly may share a seam file. The seam belongs to the *exchange*,
not to either box — which means an aggregator attributing a seam entry to "whoever touched the file
first" mis-routes it. Attribute by the entry's own `from X` line, and take the **last** one, because
seam files accumulate replies.

### 4. One board for everything that needs the operator, written by every box directly

Keeper-relay for operator tasks was tried and rejected as pure friction: it added a hop, and the hop
added latency and loss. Every box writes the shared board directly, with the write shape (board,
category, priority, title-as-imperative-action, steps-to-execute) defined once in the estate's
coordination doc.

**The filter for what becomes a card:** only he can do it, it gates work, and it will not be answered
in the normal back-and-forth of an open chat. A question in dialogue is not a card — until it has
gone unanswered long enough to block, at which point it becomes one.

**Wrong board is a drag; a missing card is the failure.**

**The read half matters as much as the write half.** Boxes read the board at session start and stop
re-asking for work that is already done — a list that reports finished work as pending gets ignored
exactly as fast as one that misses open work. Completion is a row state **only the operator sets**;
nobody deletes rows, nothing resurrects Done, and dedup is by normalised title so the same ask never
accumulates as three cards. Any older per-log "waiting on the operator" line is a courtesy pointer,
not a tracking system; the board is the queue.

### 5. The aggregator reads the newest entry, and both marker forms

Whatever mechanical sweep the keeper runs over box logs must read each log's **newest entry** (not
the first match), both marker forms (`[needs-response]` and `[needs-operator]` and whatever else the
estate uses), and attribute by the entry's final `from X`. Each of those three clauses is a repair
for a real silent failure: an urgent item missed because it sat in a newer entry than the match; an
item missed because it used the other marker; and a taxes item attributed to the financials box.

**An aggregator that reads one field loses everything filed in the other — and reports clean.**

### 6. Two boxes in one repo need a seat qualifier on every shared instruction

When a second box lives inside another box's repo, every instruction in that repo's CLAUDE.md that
belongs to only one seat must SAY WHICH SEAT, by name, with an explicit "everyone else skips this."
An instruction written for "whoever opens this file" will be executed by whoever opens the file —
which produced a confidentiality breach when a guest seat followed the host seat's checklist and read
every sibling log in the estate.

## Communication discipline

- **No cross-chatter.** A box talks to its own log, the shared board, and its seams. It does not
  message other boxes directly, quote their logs, or answer on their behalf. Anything that needs
  another box goes through the keeper relay or a sanctioned seam.
- **"The operator will carry it" is a pending state, not a completion.** If a message to another box
  travels via the operator's hands, the item stays open in your log until the receiving box's log
  shows it arrived. Operators drop things; that is not a fault, it is a property of the channel.
- **Check-ins are cheap; silence is not clear.** A box with an open item that has not logged in days
  reads as dark, and the keeper's sweep flags it. If nothing changed, say nothing changed — one line
  closes the question.
- **Keeper relays carry the verdict, not the homework.** When the keeper moves a finding into your
  log, it arrives with the evidence already gathered, the settled parts marked settled, and only
  your half of the work left open. A relay that forwards raw findings just moves the triage cost to
  the seat least equipped to do it.

## What the keeper must NOT own: recurring security work

**A recurring security watch must not live with the coordinating seat.** The coordinating seat
triages by loudness — correctly, by its own logic, since it relays for everyone — and security is
never the loudest thing in the room until it is catastrophic. In the estate this file comes from,
the keeper held the security watch informally and let a scan sit untriaged for twelve days while
escalating lesser findings twice in one day. The failure is structural, so the fix is structural: a
dedicated seat with a mechanical trigger (a scheduled run that fires whether or not anyone
remembers), a verdict store it owns, and an escalation contract hard-capped at "N checked, X need
rotation, one line each, with steps."

## What the keeper owes the estate

- The **verdict stores** (security decisions, standing rulings) that stop settled questions from
  being re-litigated by every fresh session.
- The **relay duty**: cross-cutting lessons reach every box that needs them, generalised, in that
  box's own log — never by telling boxes to go read each other.
- The **sweep**: a mechanical pass over every log for open items, run at session start, so nothing
  depends on the keeper remembering.
- **Honest state at the boundary**: the keeper's session-end includes leaving the umbrella logs
  accurate, because the next session's first read is only as good as the last session's last write.

## Every box knows the keeper, and the one way to reach it

Each box's `CLAUDE.md` names the keeper as the top seat and the single channel to it: that box's own
log in the coordination repo, which the keeper reads and relays from. Never email, never another box's
log, never a direct message the keeper didn't set up. A box that doesn't know the keeper exists will
invent a channel, and an invented channel is one nobody reads.

## Disagreement between boxes: argue, then settle

Boxes defer to each other the way a model defers to its user. One proposes, the other agrees, and
nobody checked. Agreement nobody earned is worse than open disagreement, because it looks settled.

- **A box that disagrees makes the case:** what it would do instead, its evidence, and the cost of
  being wrong. It does not fold to be agreeable.
- **A proposal is answered with what was checked, or with a counter and its evidence.** "Taken" alone
  is not an answer.
- **Two rounds at most, then it settles:**
  - **Structural questions go to the keeper.**
  - **Plans and product calls go to the operator,** with both cases side by side on one page so he
    can decide fast.
  - **When the keeper is itself a party,** it can't judge its own case. A fresh, one-off session gets
    only the two written cases and rules. It has no stake in the code or the idea, which is the
    point, and it costs nothing between disputes.

## The failure catalogue this file is built from

Each rule above maps to a real incident. Kept here as one-liners so the rules read as earned rather
than theoretical: an urgent platform-credential item missed by a first-match aggregator; a taxes
entry attributed to the financials box by a first-`from` regex; a guest seat reading every sibling
log because the host checklist said to; a wall breached by a box that needed what it walled off; an
operator carrying a message that never arrived; a keeper-relay board design rejected by the operator
as friction before it shipped; and a platform name invented in relay and repeated into the record —
which is why relays carry verdicts with evidence, and why the record cites sources.
