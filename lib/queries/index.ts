/**
 * Query registry: pairs each key factory with its query function.
 *
 * useClientQuery enforces this pairing: you pick a name from this registry
 * and the hook calls the right key + fn together. Params must match between
 * the key factory and the query function.
 *
 * Use /new-query to scaffold new entries automatically.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- referenced by scaffolded entries (see example below)
import { queryKeys } from "@/lib/query-keys";

export const queries = {
  // Example:
  // items: {
  //   key: queryKeys.items,
  //   fn: getItems,
  // },
} as const;

export type QueryName = keyof typeof queries;
