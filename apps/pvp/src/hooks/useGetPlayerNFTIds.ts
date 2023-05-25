import type { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Player from '@/constant/abis/Player.json';

export const useGetPlayerNFTIds = () => {
  const { address } = useAccount();

  const playerContract = {
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
  };

  const {
    data: index,
    isLoading: isIndexLoading,
    refetch,
  } = useContractRead({
    ...playerContract,
    functionName: 'index',
  });

  const contracts: any = useMemo(() => {
    if (isIndexLoading || !index) return [];
    const arr = [];
    for (let i = 0; i <= (index as BigNumber).toNumber(); i++) {
      arr.push({
        ...playerContract,
        functionName: 'balanceOf',
        args: [address, i],
      });
    }
    return arr;
  }, [isIndexLoading, index, address]);

  const { data } = useContractReads({
    contracts,
    enabled: contracts.length > 0,
  });

  const playerNFTIds = useMemo<number[]>(() => {
    if (!data) return [];
    const ids = contracts.map((item: any) => item.args[1]);
    return ids.filter((item: any, index: number) => {
      return data[index] && (data[index] as BigNumber).gt(0);
    });
  }, [contracts, data, address]);

  return { playerNFTIds, refetch };
};
