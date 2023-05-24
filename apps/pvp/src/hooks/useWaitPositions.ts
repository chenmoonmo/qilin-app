import { BigNumber } from 'ethers';
import type { Address} from 'wagmi';
import { useContractRead, useContractReads } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Player from '@/constant/abis/Player.json';
import Pool from '@/constant/abis/Pool.json';

type WaitPositionsPropsType = {
  playerNFTId: number;
  poolAddress: Address;
  marginTokenDecimal?: string;
};

type WaitPositionItem = {
  asset: BigNumber;
  level: number;
  user: Address;
  router: Address;
};

export const useWaitPositions = ({
  playerNFTId,
  poolAddress,
}: WaitPositionsPropsType) => {
  // 已经添加的席位数量
  const { data: seatAmount } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'idToAmount',
    args: [playerNFTId],
  });

  const positonQuerys = new Array((seatAmount as BigNumber)?.toNumber())
    .fill(0)
    .map((_, index) => {
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

  return (waitPositions as WaitPositionItem[])?.filter((position: any) => {
    return position?.user && !BigNumber.from(position?.user).eq(0);
  });
};
