import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const usePoolAddress = () => {
  const search = useSearchParams();

  return useMemo(() => {
    return [search.get('assetAddress'), search.get('poolAddress')];
  }, [search]);
};
