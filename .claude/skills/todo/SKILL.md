---
name: todo
description: Run tasks from TODO.md or populate it with high-impact engineering tasks ranked by priority.
user-invocable: true
argument-hint: [populate]
---

# /todo: Task Runner

## Two Modes

**Populate mode** (`/todo populate`): Analyze the codebase to identify and rank the next highest-impact engineering tasks:

1. Security & data integrity (auth, validation, secrets)
2. Core reliability (error handling, migrations, transactions)
3. Testing coverage
4. CI/CD & deployment
5. Observability (logging, error tracking)
6. Performance & scalability
7. UX polish
8. Developer experience

Each task must be specific and actionable: not "improve security" but "add rate limiting to public API endpoints".

**Run tasks mode** (default `/todo`): Execute uncompleted items from `TODO.md`:

1. Mark task as pending `[~]` before starting
2. Read and understand the task
3. Execute the work
4. Verify completion
5. Mark task done `[x]`

## Rules

- Work top-to-bottom unless specified
- Complete one task fully before moving to next
- Only do what the task explicitly states
- The `[~]` pending state prevents collisions between agents
- Preserve completed tasks in history
