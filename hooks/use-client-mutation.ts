import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutations, type MutationName } from "@/lib/mutations";

type MutationFn<K extends MutationName> = (typeof mutations)[K]["fn"];

/**
 * Type-safe mutation hook. Pick a registered mutation name and the hook
 * calls the paired fn + invalidates the right queries on success.
 *
 * const mutation = useClientMutation("createItem", {
 *   onSuccess: (result) => { if (result.success) toast.success("Created!"); },
 * });
 * mutation.mutate(formData);
 */
export default function useClientMutation<K extends MutationName>(
  name: K,
  options?: {
    onSuccess?: (data: Awaited<ReturnType<MutationFn<K>>>) => void;
    onError?: (error: Error) => void;
  },
) {
  const queryClient = useQueryClient();
  const { fn, invalidates } = mutations[name];

  return useMutation({
    mutationFn: fn as MutationFn<K>,
    onSuccess: (data) => {
      // Cast keeps this compiling while the registry is empty (MutationName = never)
      for (const key of (invalidates as () => readonly (readonly unknown[])[])()) {
        queryClient.invalidateQueries({ queryKey: [...key] });
      }
      options?.onSuccess?.(data as Awaited<ReturnType<MutationFn<K>>>);
    },
    onError: options?.onError,
  });
}
