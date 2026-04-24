---
name: supabase-mutations
description: Convention for writing data to Supabase/PostgreSQL safely using Zod validation, the Supabase browser client, a mutation registry, and React Hook Form. Auto-loads when working with forms, mutations, data writes, inserts, updates, or deletes.
user-invocable: false
---

# Supabase Mutations — Write Path

A type-safe, validated data writing pattern for Next.js + Supabase. Mutation functions are registered in `lib/mutations/index.ts` with their invalidation keys from the shared `lib/query-keys.ts` factory. The hook enforces this pairing. Zod validates on the client before submitting. RLS enforces authorization.

## Architecture

```
React Component (form)
    ↓ React Hook Form + zodResolver        ← client-side Zod validation
    ↓ useClientMutation("createItem")      ← hooks/use-client-mutation.ts
    ↓ looks up registry → fn + invalidates ← lib/mutations/index.ts
    ↓ fn creates browser Supabase          ← lib/supabase/client.ts
    ↓ Supabase SDK .from().insert/update   ← RLS auto-applies
    ↓ onSuccess: invalidates query keys    ← from lib/query-keys.ts
    ↓ toast / redirect / UI update
```

## Adding a new mutation

Use `/new-mutation` to scaffold all files automatically:

```
/new-mutation create-item name:string status:string
/new-mutation update-item name:string --invalidates items
/new-mutation delete-item
```

### Manual steps (3 steps)

1. Create Zod schema in `lib/schemas/{action}-{table}.ts`
2. Create mutation function in `lib/mutations/{action}-{table}.ts` + register in `lib/mutations/index.ts`
3. Use in component: `useClientMutation("createItem")`

## Patterns

**Create:** Zod parse → insert → return `{ success, data }`
**Update:** Zod parse → build updates object → update by id → return `{ success, data }`
**Delete:** Validate UUID → delete by id → return `{ success }`

## Key rules

- **Registry pairs mutations with invalidation keys** — `useClientMutation` only accepts registered names
- **Query keys come from `lib/query-keys.ts`** — shared with the query system
- **Validate with Zod** before calling Supabase
- **Return structured results**: `{ success: true, data }` or `{ success: false, error }` — don't throw
- **Handle Supabase errors**: 23505 (unique violation), PGRST116 (not found)
- Run `./ops.sh test` after changes to validate registry wiring
