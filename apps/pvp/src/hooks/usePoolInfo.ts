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
import { useMemo, useState } from 'react';

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

  const isEnd = isOpend && isAfter(now, new Date(+data?.poolInfo?.deadline!));

  // 结束时的价格
  const { data: closePrice } = useContractRead({
    address: poolAddress as Address,
    abi: Pool.abi,
    functionName: 'endPrice',
    enabled: !!poolAddress && isEnd,
  });

  const formattedClosePrice = useMemo(() => {
    if (!closePrice) return 0;
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;
    return +ethers.utils.formatUnits(
      closePrice as BigNumber,
      marginTokenDecimal
    );
  }, [closePrice, data?.poolInfo.pay_token_decimal]);

  // 未开仓前 使用这里的数据获取 mergePositions 和 positions
  const waitPositions = useWaitPositions({
    poolAddress: poolAddress as Address,
    playerNFTId,
  });

  const isSubmited = waitPositions?.some(
    (position: any) => position.user === address
  );

  const mergePositions = useMemo(() => {
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;

    if (!isOpend) {
      return waitPositions?.reduce(
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
    } else {
      return data?.mergePositions?.reduce(
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

  const positions = useMemo(() => {
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;
    if (isOpend) {
      return data?.positions?.map(position => {
        const direction = position.level > 0 ? 'long' : 'short';
        const fomattedMargin = +ethers.utils.formatUnits(
          position.margin,
          +marginTokenDecimal
        );

        const formattedLp = ethers.utils.formatUnits(
          position.lp,
          +marginTokenDecimal
        );
        // 初始仓位 Value = margin * leverage = stake amount * stake price(初始未开盘前stake price都为1)
        const fotmattedStakeAmount = Math.abs(+fomattedMargin * position.level);
        // 仓位价值：current Value = stake amount * stake price
        const currentValue = fotmattedStakeAmount * stakePrice;
        // 仓位收益：profit = current Value - Value
        const estPnl = currentValue - fotmattedStakeAmount;
        // ROE = Est.pnl / Margin
        const ROE = (estPnl / fomattedMargin) * 100;

        const isMe = BigNumber.from(position.user).eq(BigNumber.from(address));

        return {
          ...position,
          direction,
          formattedLp,
          fomattedMargin,
          fotmattedStakeAmount,
          currentValue,
          estPnl,
          ROE,
          isMe,
          marginSymbol: data?.poolInfo.pay_token_symbol,
          tradePair: data?.poolInfo.trade_pair,
          closePrice: formattedClosePrice,
        };
      });
    } else {
      return waitPositions?.map(position => {
        const direction = position.level > 0 ? 'long' : 'short';
        const fomattedMargin = +ethers.utils.formatUnits(
          position.asset.div(BigNumber.from(position.level).abs()),
          marginTokenDecimal
        );
        const formattedLp = ethers.utils.formatUnits(
          position.asset,
          marginTokenDecimal
        );
        // 初始仓位 Value = margin * leverage = stake amount * stake price(初始未开盘前stake price都为1)
        const fotmattedStakeAmount = Math.abs(+fomattedMargin * position.level);
        // 仓位价值：current Value = stake amount * stake price
        const currentValue = fotmattedStakeAmount * stakePrice;
        // 仓位收益：profit = current Value - Value
        const estPnl = currentValue - fotmattedStakeAmount;
        // ROE = Est.pnl / Margin
        const ROE = (estPnl / fomattedMargin) * 100;

        const isMe = BigNumber.from(position.user).eq(BigNumber.from(address));
        return {
          ...position,
          direction,
          fomattedMargin,
          formattedLp,
          fotmattedStakeAmount,
          currentValue,
          estPnl,
          ROE,
          isMe,
          open_price: undefined,
          closePrice: undefined,
          marginSymbol: data?.poolInfo.pay_token_symbol,
          tradePair: data?.poolInfo.trade_pair,
        };
      });
    }
  }, [
    data?.poolInfo,
    data?.positions,
    isOpend,
    waitPositions,
    stakePrice,
    formattedClosePrice,
  ]);

  const myROE = useMemo(() => {
    const myPosition = (positions as any[])?.find(position => position.isMe);
    return myPosition?.ROE;
  }, [positions]);

  const status = useMemo(() => {
    if (!isOpend) {
      return 'wait';
    } else if (!isEnd) {
      return 'open';
    } else {
      return 'end';
    }
    return 'wait';
  }, [isOpend, isEnd]);

  return {
    createDealerId: createDealerId as BigNumber,
    poolAddress: poolAddress as Address,
    poolInfo: data?.poolInfo,
    closePrice: formattedClosePrice,
    stakePrice,
    isSubmited,
    positions,
    mergePositions,
    isLoading,
    mutate,
    status,
    myROE,
  };
};