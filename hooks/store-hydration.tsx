"use client";

import { useEffect, useState } from "react";

interface UseStoreHydrationProps {
  hydrate: () => Promise<void> | void;
  alreadyHydrated?: boolean;
}

/**
 * This hook should be used on the page load of all pages that use data from
 * a client-side persisted store. Otherwise, a hydration error will occur.
 *
 * Ref.: https://github.com/pmndrs/zustand/issues/938
 */
export const useStoreHydration = ({ hydrate, alreadyHydrated = false }: UseStoreHydrationProps) => {
  const [hasHydrated, setHasHydrated] = useState(alreadyHydrated);

  useEffect(() => {
    const hydrateOnLoad = async () => {
      if (!hasHydrated) {
        await hydrate();
        setHasHydrated(true);
      }
    };

    hydrateOnLoad();
  }, [hydrate]);

  return { hasHydrated };
};
