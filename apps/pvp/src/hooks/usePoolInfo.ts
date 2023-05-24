import { CONTRACTS } from '@/constant';
import { Address, useAccount, useContractRead } from 'wagmi';
import Player from '@/constant/abis/Player.json';
import Dealer from '@/constant/abis/Dealer.json';
import Pool from '@/constant/abis/Pool.json';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphFetcher } from '@/hleper';
import { BigNumber, ethers } from 'ethers';
import { useWaitPositions } from './useWaitPositions';
import { useNow } from './useNow';
import { isAfter } from 'date-fns';
import { useMemo } from 'react';

export type PoolInfoType = Record<'token0' | 'token1' | 'pay_token', Address> &
  Record<
    | 'id'
    | 'token0Decimal'
    | 'token1Decimal'
    | 'pay_token_decimal'
    | 'pay_token_symbol'
    | 'token_price'
    | 'trade_pair'
    | 'margin'
    | 'margin_ratio'
    | 'lp'
    | 'lp_price'
    | 'deadline',
    string
  >;

type MergePositionsType = {
  id: `${string}-${'long' | 'short'}`;
  lp: string;
  fake_lp: string;
  asset: string;
  open_lp: string;
  open_price: string;
};

type PoolGraph = {
  pools: [PoolInfoType];
  mergePositions: [MergePositionsType, MergePositionsType];
  positions: {
    index: string;
    pool_address: Address;
    user: Address;
    open_price: string;
    margin: string;
    asset: string;
    level: number;
    lp: string;
  }[];
};

export const usePoolInfo = (playerNFTId: number) => {
  const { address } = useAccount();
  const now = useNow();

  const { data: createDealerId } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'playerToDealer',
    args: [playerNFTId],
  });

  const { data: poolAddress } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToPool',
    args: [createDealerId],
    enabled: !!createDealerId,
  });

  const { data: price } = useContractRead({
    address: poolAddress as Address,
    abi: Pool.abi,
    functionName: 'getPrice',
  });

  const { data: deadline } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToDeadline',
    args: [createDealerId],
    enabled: !!createDealerId,
  });

  const { data, isLoading, mutate } = useSWR(
    poolAddress
      ? ['getPoolInfo', (poolAddress as Address).toLowerCase()]
      : null,
    async ([_, poolAddress]) => {
      const res = await graphFetcher<PoolGraph>(
        // TODO: 抽离 querystring
        gql`{
          pools(where:{id:"${poolAddress}"}) {id,token0,token1, margin,margin_ratio ,trade_pair, pay_token, pay_token_decimal, pay_token_symbol, token_price, asset, lp, lp_price, level, token0Decimal, token1Decimal,deadline}
          positions(first:1000, where:{pool_address:"${poolAddress}"}){index, pool_address, open_price, margin, asset, level, lp,user,type}
          mergePositions(where:{id_in:["${poolAddress}-long", "${poolAddress}-short"]}){id, lp, fake_lp, asset,open_lp,open_price}
          }
          `
      );
      const { pools, mergePositions, positions } = res;

      const fomattedMargin = ethers.utils.formatUnits(
        pools[0]?.margin,
        +pools[0]?.pay_token_decimal
      );

      //FIXME: remove mock data
      return {
        poolInfo: {
          ...pools[0],
          token0: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' as Address,
          token1: '0x07865c6e87b9f70255377e024ace6630c1eaa37f' as Address,
          trade_pair: 'ETH/USD',
          token_price: +ethers.utils.formatEther(pools[0]?.token_price),
          lp_price: +ethers.utils.formatEther(pools[0]?.lp_price),
          deadline: deadline?.toString(),
          fomattedMargin,
        },
        positions,
        mergePositions,
      };
    }
  );

  const isOpend = +(data?.poolInfo?.deadline ?? 0) > 0;

  const isClosed =
    isOpend && isAfter(now, new Date(+data?.poolInfo?.deadline!));

  // 未开仓前 使用这里的数据获取 mergePositions 和 positions
  const waitPositions = useWaitPositions({
    poolAddress: poolAddress as Address,
    playerNFTId,
  });

  const isSubmited = waitPositions?.some(
    (position: any) => position.user === address
  );

  //  TODO: positions 排序
  const [positions, mergePositions] = useMemo(() => {
    1;
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;
    if (isOpend) {
      const positions = data?.positions?.map(position => {
        const direction = position.level > 0 ? 'long' : 'short';
        const fomattedMargin = ethers.utils.formatUnits(
          position.margin,
          +marginTokenDecimal
        );
        const formattedLp = ethers.utils.formatUnits(
          position.lp,
          +marginTokenDecimal
        );
        const isMe = BigNumber.from(position.user).eq(BigNumber.from(address));

        return {
          ...position,
          direction,
          formattedLp,
          fomattedMargin,
          isMe,
        };
      });

      const mergePositions = data?.mergePositions?.reduce(
        (pre, cur) => {
          const direction = cur.id.split('-')[1];
          const formattedLp = ethers.utils.formatUnits(
            cur.lp,
            +marginTokenDecimal
          );
          return {
            ...pre,
            [direction]: {
              ...cur,
              direction,
              formattedLp,
            },
          };
        },
        {
          long: {},
          short: {},
        }
      );
      return [positions, mergePositions];
    } else {
      const positions = waitPositions?.map(position => {
        const direction = position.level > 0 ? 'long' : 'short';
        const fomattedMargin = ethers.utils.formatUnits(
          position.asset.div(BigNumber.from(position.level).abs()),
          marginTokenDecimal
        );
        const formattedLp = ethers.utils.formatUnits(
          position.asset,
          marginTokenDecimal
        );
        const isMe = BigNumber.from(position.user).eq(BigNumber.from(address));

        return {
          ...position,
          direction,
          fomattedMargin,
          formattedLp,
          isMe,
          open_price: undefined,
        };
      });

      const mergePositions = waitPositions?.reduce(
        (pre, cur) => {
          const direction = cur.level > 0 ? 'long' : 'short';
          const formattedLp = ethers.utils.formatUnits(
            cur.asset,
            marginTokenDecimal
          );
          return {
            ...pre,
            [direction]: {
              ...cur,
              direction,
              formattedLp,
            },
          };
        },
        {
          long: {},
          short: {},
        }
      );

      return [positions, mergePositions];
    }
  }, [data, isOpend, waitPositions]);

  const stakePrice = useMemo(() => {
    const stratPrice = 1;
    if (!isOpend) {
      return stratPrice;
    } else {
      // const openPrice = +ethers.utils.formatUnits(
      //   mergePositions?.long?.open_price
      // );
      // TODO: remove mock
      const openPrice = 1827;
      const nowPrice = +ethers.utils.formatUnits(price as BigNumber);
      const longLp = (nowPrice / openPrice) * mergePositions?.long?.open_lp;

      const shortLp = mergePositions?.short.open_lp;

      const fakeLp = (nowPrice / openPrice) * mergePositions?.short?.open_lp;

      const totalLp = longLp + 2 * shortLp - fakeLp;
      const totalMargin = data?.poolInfo.margin;

      return totalMargin / totalLp;
    }
  }, [mergePositions, isOpend, price, data?.poolInfo]);

  return {
    createDealerId: createDealerId as BigNumber,
    poolAddress: poolAddress as Address,
    poolInfo: data?.poolInfo,
    stakePrice,
    isSubmited,
    positions,
    mergePositions,
    isLoading,
    mutate,
  };
};
