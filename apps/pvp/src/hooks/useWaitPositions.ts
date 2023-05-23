import Pool from '@/constant/abis/Pool.json';
import Player from '@/constant/abis/Player.json';
import { CONTRACTS } from '@/constant';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';

type WaitPositionsPropsType = {
  id: number;
  poolAddress: Address;
  marginTokenDecimal?: string;
};

export const useWaitPositions = ({
  id,
  poolAddress,
  marginTokenDecimal,
}: WaitPositionsPropsType) => {
  const { address } = useAccount();

  // 已经添加的席位数量
  const { data: seatAmount, refetch } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'idToAmount',
    args: [id],
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

  return useMemo(() => {
    return {
      waitPositions: waitPositions
        ?.filter((position: any) => {
          return position?.user && !BigNumber.from(position?.user).eq(0);
        })
        .map((position: any) => {
          return {
            isMe: position?.user === address,
            user: position.user,
            marginAmount: ethers.utils.formatUnits(
              position.asset,
              marginTokenDecimal
            ),
            leverage: position.level,
          };
        }),
      // 多空双方统计
      mergePosition: waitPositions
        ?.filter((position: any) => {
          return position?.user && !BigNumber.from(position?.user).eq(0);
        })
        .reduce(
          (pre, cur: any) => {
            const stakeAmount = +ethers.utils.formatUnits(
              cur.asset.mul(Math.abs(cur.level)),
              marginTokenDecimal
            );
            if (cur.level > 0) {
              pre.long += stakeAmount;
            } else {
              pre.short += stakeAmount;
            }
            return pre;
          },
          {
            long: 0,
            short: 0,
          }
        ),
      isSubmited: waitPositions?.some(
        (position: any) => position.user === address
      ),
    };
  }, [waitPositions, marginTokenDecimal, address]);
};
