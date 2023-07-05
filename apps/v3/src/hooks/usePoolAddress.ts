import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Address } from 'wagmi';

export const usePoolAddress = () => {
  const search = useSearchParams();

  return useMemo(() => {
    return [search.get('assetAddress'), search.get('poolAddress')] as [
      Address | undefined,
      Address | undefined
    ];
  }, [search]);
};
