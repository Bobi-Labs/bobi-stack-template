---
name: new-query
description: Scaffold a new Supabase query. Creates the query function, adds the key factory, registers it in the query registry, and runs tests.
user-invocable: true
disable-model-invocation: true
argument-hint: <table-name> [columns] [--param paramName:paramType]
allowed-tools: Read, Write, Edit, Bash(./ops.sh test), Glob, Grep
---

# /new-query: Scaffold a New Query

Create a complete, wired query from a table name. The user invokes this as:

```
/new-query items
/new-query items id,name,status
/new-query items id,name --param categoryId:string
```

Parse `$ARGUMENTS` to extract:
- `$0` is the table name (required)
- `$1` is a comma-separated column list (optional, defaults to `*`)
- `--param name:type` sets an optional parameter for filtering

## Steps

### 1. Determine naming

From the table name, derive:
- **Query function name:** `get` + PascalCase(tableName)
- **Query file:** `lib/queries/get-{kebab-case}.ts`
- **Registry key:** camelCase(tableName)
- **Query key factory name:** camelCase(tableName)

### 2. Add query key factory: `lib/query-keys.ts`

Read the current file. Add a new entry to `queryKeys`. If no params:
```ts
tableName: () => ["tableName"] as const,
```

If params:
```ts
items: (categoryId?: string) =>
  categoryId ? ["items", categoryId] as const : ["items"] as const,
```

### 3. Create query function: `lib/queries/get-{name}.ts`

```ts
import { createClient } from "@/lib/supabase/client";

export async function getItems(param?: string) {
  const supabase = createClient();
  let query = supabase
    .from("items")
    .select("columns")
    .order("created_at", { ascending: false });

  if (param) {
    query = query.eq("param_column", param);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

### 4. Register in query registry: `lib/queries/index.ts`

Add import + entry in `queries` object pairing key factory with function.

### 5. Verify

Run `./ops.sh test` to validate wiring.

### 6. Report

Tell the user files created/modified and usage: `useClientQuery("registryName")`

## Rules

- Always read target files before editing
- Match existing query patterns
- Key factory params and query function params MUST match
- Throw on Supabase errors
- Do NOT create components or hooks, just data layer files
