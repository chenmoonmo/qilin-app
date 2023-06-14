import { useContractRead } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';

import { usePoolInfo } from './usePoolInfo';

export const useDealerPoolInfo = (dealerId: number) => {
  const { data: playerId } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToPlayer',
    args: [dealerId],
  });

  return usePoolInfo(playerId as number);
};
