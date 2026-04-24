---
name: supabase-query-system
description: Convention for reading data from Supabase/PostgreSQL using a query registry with centralized key factories, the Supabase browser client, and TanStack React Query caching. Auto-loads when working with data fetching, queries, dashboards, or data display.
user-invocable: false
---

# Supabase Query System — Read Path

A type-safe, cached data fetching pattern for Next.js + Supabase. Query keys live in a centralized factory (`lib/query-keys.ts`) shared by both reads and mutations. A registry pairs each key with its query function — the hook enforces this pairing so you can't mismatch keys and functions or typo a key. RLS auto-filters results.

## Architecture

```
React Component
    ↓ useClientQuery("items")              ← hooks/use-client-query.ts
    ↓ looks up registry → key + fn         ← lib/queries/index.ts
    ↓ key factory builds query key         ← lib/query-keys.ts
    ↓ fn creates browser Supabase          ← lib/supabase/client.ts
    ↓ Supabase SDK .from().select()        ← RLS auto-applies
    ↓ TanStack Query client cache          ← staleTime + gcTime
    ↓ component re-renders with data
```

## Core files

### Query key factories — `lib/query-keys.ts`

Single source of truth for all cache keys. Shared by queries (pairing) and mutations (invalidation). Keys are functions so they can accept params.

```ts
export const queryKeys = {
  items: () => ["items"] as const,
  item: (id: string) => ["item", id] as const,
} as const;
```

### Query registry — `lib/queries/index.ts`

Pairs each key factory with its query function. The hook enforces this — you can only call `useClientQuery` with a registered name.

```ts
import { queryKeys } from "@/lib/query-keys";
import { getItems } from "./get-items";

export const queries = {
  items: {
    key: queryKeys.items,
    fn: getItems,
  },
} as const;

export type QueryName = keyof typeof queries;
```

### Client hook — `hooks/use-client-query.ts`

Type-safe hook that enforces registry pairing. Params are type-checked against the key factory.

```ts
export default function useClientQuery<K extends QueryName>(
  name: K,
  ...args: Parameters<(typeof queries)[K]["key"]>
) {
  const { key, fn } = queries[name];
  return useQuery({
    queryKey: [...(key as (...a: any[]) => readonly unknown[])(...args)],
    queryFn: () => (fn as (...a: any[]) => Promise<any>)(...args),
  });
}
```

## Adding a new query

Use `/new-query` to scaffold all files automatically:

```
/new-query items                                      # all columns, no params
/new-query items id,name,status                       # specific columns
/new-query items id,name --param categoryId:string    # with filter param
```

### Manual steps (3 steps)

1. Add key factory in `lib/query-keys.ts`
2. Create query function in `lib/queries/get-{name}.ts` + register in `lib/queries/index.ts`
3. Use in component: `useClientQuery("items")`

## Key rules

- **All query keys live in `lib/query-keys.ts`** — shared by queries and mutations
- **Registry pairs keys with functions** — `useClientQuery` only accepts registered names
- **Params must match** between the key factory and query function
- **Queries run client-side** — RLS auto-filters results
- **No raw SQL** — use the Supabase SDK fluent API
- Throw on Supabase errors — let TanStack Query handle error state
- Run `./ops.sh gen-types` after schema changes
- Run `./ops.sh test` after adding/changing queries
