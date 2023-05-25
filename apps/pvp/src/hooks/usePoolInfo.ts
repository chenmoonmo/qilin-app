import { isAfter } from 'date-fns';
import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';
import { useMemo } from 'react';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import { useAccount, useContractRead } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';
import Player from '@/constant/abis/Player.json';
import Pool from '@/constant/abis/Pool.json';
import { graphFetcher } from '@/hleper';

import { useNow } from './useNow';
import { useWaitPositions } from './useWaitPositions';

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
    type: 0 | 1 | 2 | 3;
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

  const { data: nowPrice } = useContractRead({
    address: poolAddress as Address,
    abi: Pool.abi,
    functionName: 'getPrice',
  });

  // const { data: deadline } = useContractRead({
  //   address: CONTRACTS.DealerAddress,
  //   abi: Dealer.abi,
  //   functionName: 'dealerToDeadline',
  //   args: [createDealerId],
  //   enabled: !!createDealerId,
  // });

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
          // deadline: deadline?.toString(),
          fomattedMargin,
        },
        positions,
        mergePositions,
      };
    }
  );

  const isOpend = +(data?.poolInfo?.deadline ?? 0) > 0;

  const isEnd =
    isOpend &&
    !!data?.poolInfo?.deadline &&
    isAfter(now, new Date(+data?.poolInfo?.deadline * 1000));

  // 结束时的价格
  // TODO: 还取不到
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

  type MergePositionItem = {
    id: `${string}-${'long' | 'short'}`;
    lp: string;
    fake_lp: string;
    asset: string;
    open_lp: string;
    open_price: string;
    direction: 'long' | 'short';
    formattedLp: string;
  };

  const mergePositions:
    | { long: MergePositionItem; short: MergePositionItem }
    | undefined = useMemo(() => {
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
          long: {} as MergePositionItem,
          short: {} as MergePositionItem,
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
          long: {} as MergePositionItem,
          short: {} as MergePositionItem,
        }
      );
    }
  }, [
    data?.mergePositions,
    data?.poolInfo.pay_token_decimal,
    isOpend,
    waitPositions,
  ]);

  const stakePrice = useMemo(() => {
    const stratPrice = 1;
    if (!isOpend) {
      return stratPrice;
    } else {
      const currentPrice = isEnd
        ? formattedClosePrice
        : +ethers.utils.formatUnits(nowPrice as BigNumber);

      const openPrice = +ethers.utils.formatUnits(
        BigNumber.from(mergePositions?.long?.open_price ?? 0)
      );

      const longLp =
        (currentPrice / openPrice) * +(mergePositions?.long?.open_lp ?? 0);

      const shortLp = +(mergePositions?.short.open_lp ?? 0);

      const fakeLp =
        (currentPrice / openPrice) * +(mergePositions?.short?.open_lp ?? 0);

      const totalLp = longLp + 2 * shortLp - fakeLp;

      const totalMargin = +(data?.poolInfo?.margin ?? 0);

      return totalMargin / totalLp;
    }
  }, [
    data?.poolInfo,
    mergePositions,
    isOpend,
    nowPrice,
    formattedClosePrice,
    isEnd,
  ]);

  const positions = useMemo(() => {
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;
    if (isOpend) {
      return data?.positions?.map(position => {
        const currentPrice = isEnd
          ? formattedClosePrice
          : +ethers.utils.formatUnits(nowPrice as BigNumber);
        const openPrice = +ethers.utils.formatUnits(position?.open_price);
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
        let fotmattedStakeAmount = Math.abs(+fomattedMargin * position.level);
        if (direction === 'short') {
          const fakeLp = (currentPrice / openPrice) * fotmattedStakeAmount;
          fotmattedStakeAmount = 2 * fotmattedStakeAmount - fakeLp;
        } else {
          fotmattedStakeAmount =
            (currentPrice / openPrice) * fotmattedStakeAmount;
        }
        // 仓位价值：current Value = stake amount * stake price
        const currentValue = fotmattedStakeAmount * stakePrice;
        // 仓位收益：profit = current Value - Value
        const estPnl = currentValue - fomattedMargin;

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
          openPrice,
          marginSymbol: data?.poolInfo.pay_token_symbol,
          tradePair: data?.poolInfo.trade_pair,
          closePrice: formattedClosePrice,
        };
      });
    } else {
      return waitPositions?.map(position => {
        const direction = position.level > 0 ? 'long' : 'short';
        const fomattedMargin = +ethers.utils.formatUnits(
          position.asset,
          marginTokenDecimal
        );
        const formattedLp = fomattedMargin;
        // 初始仓位 Value = margin * leverage = stake amount * stake price(初始未开盘前stake price都为1)
        const fotmattedStakeAmount = Math.abs(+fomattedMargin * position.level);
        // 仓位价值：current Value = stake amount * stake price
        const currentValue = fotmattedStakeAmount * stakePrice;
        // 仓位收益：profit = current Value - Value
        const estPnl = undefined;
        // ROE = Est.pnl / Margin
        const ROE = undefined;

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
          openPrice: undefined,
          closePrice: undefined,
          marginSymbol: data?.poolInfo.pay_token_symbol,
          tradePair: data?.poolInfo.trade_pair,
          type: 0,
        };
      });
    }
  }, [
    data?.poolInfo,
    data?.positions,
    isOpend,
    isEnd,
    waitPositions,
    stakePrice,
    formattedClosePrice,
    address,
    nowPrice,
  ]);

  const myPosition = useMemo(() => {
    return (positions as any[])?.find(position => position.isMe);
  }, [positions]);

  const status = useMemo(() => {
    if (!isOpend) {
      return 'wait';
    } else if (!isEnd) {
      return 'open';
    } else {
      return 'end';
    }
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
    isOpend,
    isEnd,
    myPosition,
  };
};
