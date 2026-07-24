/**
 * Mutation registry: pairs each mutation function with its invalidation keys.
 *
 * useClientMutation enforces this pairing: you pick a name from this registry
 * and the hook calls the right fn + invalidates the right queries on success.
 * `invalidates` is a function so it can compute keys dynamically if needed.
 *
 * Use /new-mutation to scaffold new entries automatically.
 */
import { queryKeys } from "@/lib/query-keys";

export const mutations = {
  // Example:
  // createItem: {
  //   fn: createItem,
  //   invalidates: () => [queryKeys.items()],
  // },
} as const;

export type MutationName = keyof typeof mutations;
