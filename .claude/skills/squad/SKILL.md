---
name: squad
description: Analyze a codebase and create domain-specific rules and optional specialist subagents for Claude Code.
user-invocable: true
---

# /squad: Domain-Based Code Organization

Analyze the codebase to create specialist subagents and domain-specific rules. Segments projects into 3-8 logical domains.

## Steps

### 1. Scan the codebase

Map directory structure, entry points, dependencies, import graphs, and type definitions.

### 2. Identify domains

Group code into logical clusters based on feature boundaries, layer separation, and infrastructure concerns. Effective domains have distinct conventions, sufficient file count, and clear identity.

### 3. Check existing config

Review `.claude/squad.json` if it exists. Preserve manual edits during refresh.

### 4. Generate rules

Create `.claude/rules/<domain>.md` files with glob patterns, domain-specific conventions, and interface connections. Keep rules actionable and concrete.

### 5. Create subagents (if needed)

Only for domains with: complex specialized knowledge, high consequence for errors, and benefit from restricted tool access. Most domains use rules only.

### 6. Write manifest

Generate `.claude/squad.json` documenting domains, file patterns, rules, and unmapped files.

### 7. Summary

Report domain count, generated artifacts, unmapped files, and recommendations.

## Principles

- Minimize domains: 4-5 well-defined beats 8 thin ones
- Domain-specific only. Don't duplicate existing project guidelines
- Pattern-based matching via glob syntax
- Honest scoping: `unmapped` is better than forced assignment
