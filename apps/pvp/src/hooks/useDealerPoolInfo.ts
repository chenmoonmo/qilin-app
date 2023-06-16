import { useMemo } from 'react';
import { useContractRead } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';

import { usePoolInfo } from './usePoolInfo';

export const useDealerPoolInfo = (dealerId: number) => {
  const { data: playerId, refetch } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToPlayer',
    args: [dealerId],
  });

  const info = usePoolInfo(playerId as number);

  return useMemo(() => {
    return {
      ...info,
      refetch: () => {
        info?.refetch();
        refetch();
      },
    };
  }, [info, refetch]);
};
