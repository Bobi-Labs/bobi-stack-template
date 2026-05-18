---
name: bobi-stack
description: Set up bobi-stack conventions for an existing project. Fills out CLAUDE.md, ops.sh, docs, and TODO.md based on the actual codebase.
user-invocable: true
---

# /bobi-stack: Project Setup

Analyze the codebase and auto-fill project documentation files based on what actually exists.

## Steps

### 1. Analyze the codebase

Examine:
- Build files (`package.json`, `Cargo.toml`, etc.) for tech stack
- Directory structure for project organization
- Existing scripts and commands
- Documentation that already exists
- External service dependencies (`.env*` files)

### 2. Fill CLAUDE.md

Complete the template sections with real project data:
- Project Overview
- Tech Stack (from package.json/etc.)
- Database State (from Supabase/env vars)
- Project Structure (from directory listing)
- Architecture (from code patterns)
- Conventions (from existing code style)

Preserve standard bobi-stack sections (Commands, Key Workflows, Skills).

### 3. Configure ops.sh

Replace placeholder commands with real ones based on detected package manager and framework. Keep complex logic in `scripts/` if needed.

### 4. Create docs

Only create genuinely useful docs:
- Architecture overview (if multi-service)
- Topical docs for non-obvious patterns

### 5. Populate TODO.md

If starting fresh, rank tasks by impact:
1. Security (auth, validation, secrets)
2. Reliability (error handling, transactions)
3. Testing coverage
4. CI/CD & deployment
5. Observability
6. Performance
7. UX polish
8. Developer experience

10-20 specific, actionable items. Not "improve security" but "add rate limiting to public API endpoints".

### 6. Summary

Report what was configured vs what remains as TODOs.
