import type { Database } from "./database.types";

/**
 * Drift check utility — use in Zod schema files to catch mismatches
 * between your Zod schema output and the DB insert type.
 *
 * Usage in a schema file:
 *   type _Check = AssertInsertMatch<CreateItemInput, "items">;
 *
 * This will error at build time if your Zod inferred type doesn't
 * match what Supabase expects for inserts on that table.
 */
type Tables = Database["public"]["Tables"];

type InsertRow<T extends keyof Tables> = Tables[T] extends { Insert: infer I }
  ? I
  : never;

/**
 * Asserts that every key in ZodOutput exists in the DB Insert type
 * and that the types are compatible.
 */
export type AssertInsertMatch<
  ZodOutput extends Record<string, unknown>,
  TableName extends keyof Tables,
> = {
  [K in keyof ZodOutput]: K extends keyof InsertRow<TableName>
    ? ZodOutput[K] extends InsertRow<TableName>[K]
      ? true
      : ["Type mismatch on field", K]
    : ["Field not in DB insert type", K];
};
