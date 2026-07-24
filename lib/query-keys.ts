/**
 * Centralized query key factories.
 *
 * Used by lib/queries (pairing) and lib/mutations (invalidation).
 * Keys are functions so they can accept params for cache granularity.
 *
 * Add new keys here. Both hooks enforce these at the type level,
 * so typos and mismatches are caught at compile time.
 */
export const queryKeys = {
  // Example: uncomment and add your own
  // items: () => ["items"] as const,
  // item: (id: string) => ["item", id] as const,
} as const;
