import { CONTRACTS } from '@/constant';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import Player from '@/constant/abis/Player.json';
import { useMemo } from 'react';

export const useRoom = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const playerContract = {
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
  };

  const { data: index, isLoading: isIndexLoading } = useContractRead({
    ...playerContract,
    functionName: 'index',
  });

  const contracts: any = useMemo(() => {
    if (isIndexLoading || !index) return [];
    const arr = [];
    // FIXME:
    for (let i = 0; i < (index as number); i++) {
      arr.push({
        ...playerContract,
        args: [address, i],
      });
    }
    return arr;
  }, [isIndexLoading, index]);

  const { data } = useContractReads({
    contracts,
    enabled: isIndexLoading,
  });

  //   TODO: 判断拥有权
  return {};
};
