---
name: lsp
description: Convention for using Language Server Protocol tools for precise code intelligence (references, definitions, type checking) instead of guessing from grep results.
user-invocable: false
---

# LSP-Assisted Code Intelligence

Use LSP tools instead of guessing from grep results when:
- Finding all references to a symbol across the codebase
- Navigating to definitions
- Validating types before completing refactors
- Understanding inferred types
- Analyzing call hierarchies

## Language-Specific Tools

**TypeScript/JavaScript:** `npx tsc --noEmit` for type checking
**Python:** `pyright` for type checking
**Rust:** `cargo check`
**Go:** `go vet` + `go build`

## Workflow

1. **Before refactoring:** Map all references and definitions
2. **During implementation:** Query types when uncertain
3. **After changes:** Run type checker to verify correctness

## Key Principle

Prefer semantic queries over text search. Don't speculate about types. Verify with tools.
