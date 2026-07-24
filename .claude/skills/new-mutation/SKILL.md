---
name: new-mutation
description: Scaffold a new Supabase mutation. Creates the Zod schema and mutation function, registers it in the mutation registry, and runs tests.
user-invocable: true
disable-model-invocation: true
argument-hint: <action>-<table> [field:type ...] [--invalidates key1,key2]
allowed-tools: Read, Write, Edit, Bash(./ops.sh test), Glob, Grep
---

# /new-mutation: Scaffold a New Mutation

Create a complete, wired mutation from an action + table name. The user invokes this as:

```
/new-mutation create-item
/new-mutation create-item name:string status:string price:number
/new-mutation update-item name:string --invalidates items
/new-mutation delete-item
```

Parse `$ARGUMENTS` to extract:
- `$0`: action-table in kebab-case (required)
- Remaining positional args: `field:type` pairs for Zod schema (optional)
- `--invalidates key1,key2`: query key names to invalidate (optional, defaults to table's plural key)

## Steps

### 1. Determine naming

- **Action:** `create`, `update`, or `delete`
- **Table:** the rest after action
- **Function name:** camelCase(action + table)
- **Files:** `lib/mutations/{action}-{table}.ts`, `lib/schemas/{action}-{table}.ts`

### 2. Create Zod schema in `lib/schemas/{action}-{table}.ts`

Map field types: `string` → `z.string().min(1)`, `number` → `z.coerce.number()`, `uuid` → `z.string().uuid()`, `boolean` → `z.boolean()`, `enum:a,b,c` → `z.enum(["a","b","c"])`. Add `?` suffix for optional.

For `update-*`, add `id: z.string().uuid()` automatically.
For `delete-*`, skip the schema and validate the id inline.

### 3. Create mutation function in `lib/mutations/{action}-{table}.ts`

**Create:** Zod parse → insert → return `{ success, data }` or `{ success: false, error }`
**Update:** Zod parse → build updates → update by id → return result
**Delete:** Validate UUID → delete → return result

### 4. Ensure query key exists in `lib/query-keys.ts`

Add table's key if missing.

### 5. Register in the mutation registry at `lib/mutations/index.ts`

Add import + entry with `fn` and `invalidates`.

### 6. Verify

Run `./ops.sh test`.

### 7. Report

Files created/modified + usage: `useClientMutation("registryName")`

## Rules

- Always read target files before editing
- Match existing mutation patterns
- Return `{ success: true/false }`, never throw from mutation functions
- Handle error codes: 23505 (unique), PGRST116 (not found)
- For `delete`, skip the schema file and validate the id inline
- Do NOT create form components, just data layer files
