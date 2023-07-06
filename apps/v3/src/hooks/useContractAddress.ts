import { useMemo } from 'react';
import { useChainId } from 'wagmi';

import { contacts } from '@/constant';

export const useContractAddress = () => {
  const chainId = useChainId();

  return useMemo(() => {
    return contacts[chainId];
  }, [chainId]);
};
