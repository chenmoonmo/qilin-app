import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import type { Address } from 'wagmi';
import { useContractReads } from 'wagmi';

import Pool from '@/constant/abis/Pool.json';

type WaitPositionsPropsType = {
  poolAddress: Address;
  playerAmount: number;
};

type WaitPositionItem = {
  asset: BigNumber;
  level: number;
  user: Address;
  router: Address;
};

export const useWaitPositions = ({
  poolAddress,
  playerAmount,
}: WaitPositionsPropsType) => {
  const positonQuerys = new Array(playerAmount).fill(0).map((_, index) => {
    return {
      address: poolAddress,
      abi: Pool.abi,
      functionName: 'waitPositions',
      args: [BigNumber.from(index + 1)],
    };
  });

  const { data: waitPositions } = useContractReads({
    contracts: positonQuerys,
  });

  return useMemo(() => {
    return (
      (waitPositions as WaitPositionItem[])?.filter((position: any) => {
        return position?.user && !BigNumber.from(position?.user).eq(0);
      }) ?? []
    );
  }, [waitPositions]);
};
