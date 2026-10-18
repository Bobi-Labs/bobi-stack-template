# bobi-stack FAQ

Short answers to the questions people ask in their first weeks. Keep this; your Claude can answer the same questions any time, but this is the version to scan.

## The basics

**What is bobi-stack?**
Two things. A ready-made web project (Next.js, Supabase and TypeScript, already wired together), so you start on your idea instead of the plumbing. And a way of working with Claude that lasts: a briefing file, memory and checklists, so Claude picks up where you left off instead of starting over.

**What is a box?**
A Claude chat that owns one job: one project, or one kind of work. It has a folder and a log, so it outlives any single conversation. Close the chat, open a new one in the same folder, and the work carries on.

**What is `CLAUDE.md`?**
The briefing every Claude session in your project reads first: what the project is, its rules, and how you like to work. Change it when the project changes.

**What is Claude's memory here?**
Private notes Claude keeps for each project, in a folder on your computer (not in the project). Decisions, preferences, what's next. It's why the next chat doesn't start from zero.

## Organising your work

**What is the keeper?**
One chat that sits above your boxes. Some people call theirs the master keeper, or MK. It remembers decisions that cross projects, passes messages between boxes so you don't have to, settles it when two boxes disagree, and owns the structure: which boxes exist and who does what.

**Do I need a keeper?**
Only once you run two or more projects that need to share decisions. One project is its own box; add a keeper the day a second project needs to agree with the first. It takes about ten minutes.

**What is a sub-keeper?**
A manager for one area, when that area runs several chats at the same time: a team lead under the keeper. It owns the area's shared tools and platform. It does **not** re-make its boxes' decisions.

**When should I not open a sub-keeper?**
When the area has only one or two boxes; when it would only pass messages along; or when it would re-check decisions its boxes already made. Each of those adds back-and-forth without adding safety. Start with boxes directly under the keeper.

**What lives under the keeper?**
Each project as its own box. Boxes for jobs that cut across projects, such as security or marketing. And, only when earned, a sub-keeper with its own boxes.

**How do boxes talk to each other?**
Through log files in the keeper's folder, not by chatting directly. A log is the conversation, written down, so nothing depends on you carrying messages.

**Who decides what?**
- The box that holds the context decides and does its own job.
- The keeper decides structure.
- You decide plans, and anything involving money.
- **One box brings you each decision, never two.**
- A box never passes on your "yes" for another box to act on. You give it to the box that will act.

## Day to day

**How do I pick up next time?**
Open Claude in the project's folder and say: "let's pick up where we left off."

**Why does Claude disagree with me?**
On purpose. If Claude thinks something is a bad idea, it says so with its reasons and doesn't fold just because you push back. You still decide. It will also tell you what changed its mind when it does change it.

**What is a pre-mortem?**
Before a big build, imagine it's three months later and the project failed, and ask why. Fix the causes that are cheap to fix now. Claude will suggest one before any big build.

**Where do passwords and keys go?**
In a file called `.env.local` in your project, which you fill in yourself and which is never uploaded. Never paste a password or key into a chat. If you do by accident, change it.

**Something looks broken. What do I do?**
Tell Claude what you saw, in your own words. It checks before it tells you something is fixed, and it says so plainly when it isn't sure.

**How do I change how all this works?**
Ask. The whole setup is plain files you can read: `CLAUDE.md`, the docs folder, and your keeper's logs. Your Claude can change them with you.
