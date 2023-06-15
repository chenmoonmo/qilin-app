import { isAfter } from 'date-fns';
import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';
import { useMemo } from 'react';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import { useAccount, useContractRead } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Player from '@/constant/abis/Player.json';
import Pool from '@/constant/abis/Pool.json';
import { graphFetcher } from '@/hleper';

import { useDealerId } from './useCreateRoom';
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
  > & {
    level: number[];
  };

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
    fact_pnl: string;
    type: 0 | 1 | 2 | 3;
  }[];
  players: {
    user: Address[];
  }[];
  settings: [
    {
      liq_protocol_fee: string;
    }
  ];
};

export const usePoolInfo = (playerNFTId: number) => {
  const { address } = useAccount();
  const now = useNow();

  const { dealerId } = useDealerId();

  const { data: createDealerId } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'playerToDealer',
    args: [playerNFTId],
  });

  const { data: poolAddress } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'playerToPool',
    args: [playerNFTId],
  });

  const { data: nowPrice } = useContractRead({
    address: poolAddress as Address,
    abi: Pool.abi,
    functionName: 'getPrice',
  });

  const { data, isLoading, mutate } = useSWR(
    poolAddress
      ? ['getPoolInfo', (poolAddress as Address).toLowerCase(), playerNFTId]
      : null,
    async ([_, poolAddress, playerNFTId]) => {
      const res = await graphFetcher<PoolGraph>(
        // TODO: 抽离 querystring
        gql`{
          pools(where:{id:"${poolAddress}"}) {id,token0,token1, margin,margin_ratio ,trade_pair, pay_token, pay_token_decimal, pay_token_symbol, token_price, asset, lp, lp_price, level, token0Decimal, token1Decimal,deadline}
          positions(first:1000, where:{pool_address:"${poolAddress}"}){index, pool_address, open_price, margin, asset, level, lp,user,type,fact_pnl}
          mergePositions(where:{id_in:["${poolAddress}-long", "${poolAddress}-short"]}){id, lp, fake_lp, asset,open_lp,open_price}
          players(where:{id:"${playerNFTId}"}){user}
          settings(where:{id:"${CONTRACTS.DealerAddress.toLocaleLowerCase()}"}){liq_protocol_fee}
          }
          `
      );

      // TODO: 处理 players
      const { pools, mergePositions, positions, players } = res;

      const poolInfo = pools[0];

      const fomattedMargin = ethers.utils.formatUnits(
        +poolInfo?.margin,
        +poolInfo?.pay_token_decimal
      );

      //FIXME: remove mock data
      return {
        poolInfo: {
          ...poolInfo,
          shortId: poolInfo.id.slice(-4),
          token0: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' as Address,
          token1: '0x07865c6e87b9f70255377e024ace6630c1eaa37f' as Address,
          token1Decimal: 18,
          token1Symbol: 'USD',
          trade_pair: 'ETH/USD',
          token_price: +ethers.utils.formatEther(poolInfo?.token_price),
          lp_price: +ethers.utils.formatEther(poolInfo?.lp_price),
          // deadline: deadline?.toString(),
          fomattedMargin,
          level: poolInfo?.level.map(item => item.toString()),
        },
        positions,
        mergePositions,
        players: players[0].user,
        fee: +ethers.utils.formatEther(res.settings[0]?.liq_protocol_fee),
      };
    }
  );

  const isOpend = +(data?.poolInfo?.deadline ?? 0) > 0;

  const isEnd = useMemo(() => {
    if (!data?.poolInfo?.deadline || data?.poolInfo?.deadline === '0')
      return false;
    return isAfter(now, new Date(+data?.poolInfo?.deadline * 1000));
  }, [data?.poolInfo?.deadline, now]);

  // 结束时的价格
  // TODO: 还取不到
  const { data: closePrice } = useContractRead({
    address: poolAddress as Address,
    abi: Pool.abi,
    functionName: 'endPrice',
  });

  console.log({ closePrice });

  // TODO: closePrice 和 open price 的精度是否固定
  const formattedClosePrice = useMemo(() => {
    if (!closePrice) return 0;
    return +ethers.utils.formatUnits(closePrice as BigNumber);
  }, [closePrice]);

  const formattedNowPrice = useMemo(() => {
    if (!nowPrice) return 0;
    return +ethers.utils.formatUnits(nowPrice as BigNumber);
  }, [nowPrice]);

  // 未开仓前 使用这里的数据获取 mergePositions 和 positions
  const waitPositions = useWaitPositions({
    poolAddress: poolAddress as Address,
    playerAmount: data?.players.length ?? 0,
  });

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
            cur.asset.mul(cur.level).abs(),
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
    } else if (isEnd) {
      return data?.positions?.reduce(
        (pre, cur) => {
          const direction = cur.level > 0 ? 'long' : 'short';
          const formattedLp = ethers.utils.formatUnits(
            Math.abs(+cur.asset * cur.level),
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
    data?.positions,
    isEnd,
    isOpend,
    waitPositions,
  ]);

  const openPrice = useMemo(
    () =>
      isOpend
        ? +ethers.utils.formatUnits(
            BigNumber.from(mergePositions?.long?.open_price ?? 0)
          )
        : null,
    [isOpend, mergePositions?.long?.open_price]
  );

  const stakePrice = useMemo(() => {
    const stratPrice = 1;
    if (!isOpend) {
      return stratPrice;
    } else {
      const currentPrice = isEnd ? formattedClosePrice : formattedNowPrice;

      const longLp =
        (currentPrice! / openPrice!) * +(mergePositions?.long?.open_lp ?? 0);

      const shortLp = +(mergePositions?.short.open_lp ?? 0);

      const fakeLp =
        (currentPrice! / openPrice!) * +(mergePositions?.short?.open_lp ?? 0);

      const totalLp = longLp + 2 * shortLp - fakeLp;

      const totalMargin = +(data?.poolInfo?.margin ?? 0);

      // console.log({
      //   isEnd,
      //   nowPrice: ethers.utils.formatUnits(nowPrice as BigNumber),
      //   currentPrice,
      //   formattedClosePrice,
      //   openPrice,
      //   mergePositions,
      //   longLp,
      //   shortLp,
      //   fakeLp,
      //   totalMargin,
      //   totalLp,
      // });

      return totalMargin / totalLp;
    }
  }, [
    isOpend,
    isEnd,
    formattedClosePrice,
    formattedNowPrice,
    openPrice,
    mergePositions?.long?.open_lp,
    mergePositions?.short.open_lp,
    data?.poolInfo?.margin,
  ]);

  const positions = useMemo(() => {
    const marginTokenDecimal = data?.poolInfo.pay_token_decimal ?? 6;
    if (isOpend) {
      const unSubmitedPlayer =
        data?.players
          ?.filter(
            playerAddress =>
              !data?.positions?.some(position =>
                BigNumber.from(position.user).eq(playerAddress)
              )
          )
          ?.map(playerAddress => {
            const isMe = BigNumber.from(playerAddress).eq(
              BigNumber.from(address)
            );

            return {
              isMe,
              user: playerAddress,
              openPrice: undefined,
              closePrice: undefined,
              fomattedMargin: undefined,
              formattedLp: undefined,
              type: 0,
            };
          }) ?? [];

      return data?.positions
        ?.map(position => {
          const currentPrice = isEnd ? formattedClosePrice : formattedNowPrice;

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
          let currentValue = fotmattedStakeAmount * stakePrice;

          // 仓位收益：profit = current Value - Value
          const estPnl =
            position.type === 1
              ? currentValue - fomattedMargin
              : +ethers.utils.formatUnits(
                  position.fact_pnl,
                  +marginTokenDecimal
                );

          if (position.type !== 1) {
            currentValue = estPnl + fomattedMargin;
          }

          const realizedPnl = estPnl - data?.fee;

          // ROE = Est.pnl / Margin
          const ROE = (estPnl / fomattedMargin) * 100;

          const isMe = BigNumber.from(position.user).eq(
            BigNumber.from(address)
          );

          return {
            ...position,
            direction,
            formattedLp,
            fomattedMargin,
            fotmattedStakeAmount,
            currentValue,
            estPnl,
            realizedPnl,
            ROE,
            isMe,
            openPrice,
            marginSymbol: data?.poolInfo.pay_token_symbol,
            tradePair: data?.poolInfo.trade_pair,
            closePrice: formattedClosePrice,
          };
        })
        .concat(unSubmitedPlayer as any);
    } else {
      const unSubmitedPlayer =
        data?.players
          ?.filter(
            playerAddress =>
              !waitPositions.some(position =>
                BigNumber.from(position.user).eq(playerAddress)
              )
          )
          ?.map(playerAddress => {
            const isMe = BigNumber.from(playerAddress).eq(
              BigNumber.from(address)
            );

            return {
              isMe,
              user: playerAddress,
              openPrice: undefined,
              closePrice: undefined,
              fomattedMargin: undefined,
              formattedLp: undefined,
              type: 0,
            };
          }) ?? [];

      return waitPositions
        ?.map(position => {
          const direction = position.level > 0 ? 'long' : 'short';
          const fomattedMargin = +ethers.utils.formatUnits(
            position.asset,
            marginTokenDecimal
          );
          const formattedLp = +ethers.utils.formatUnits(
            position.asset.mul(position.level).abs(),
            marginTokenDecimal
          );
          // 初始仓位 Value = margin * leverage = stake amount * stake price(初始未开盘前stake price都为1)
          const fotmattedStakeAmount = Math.abs(
            +fomattedMargin * position.level
          );
          // 仓位价值：current Value = stake amount * stake price
          const currentValue = fotmattedStakeAmount * stakePrice;
          // 仓位收益：profit = current Value - Value
          const estPnl = undefined;
          // ROE = Est.pnl / Margin
          const ROE = undefined;

          const realizedPnl = undefined;

          const isMe = BigNumber.from(position.user).eq(
            BigNumber.from(address)
          );
          return {
            ...position,
            direction,
            fomattedMargin,
            formattedLp,
            fotmattedStakeAmount,
            currentValue,
            estPnl,
            realizedPnl,
            ROE,
            isMe,
            openPrice: undefined,
            closePrice: undefined,
            marginSymbol: data?.poolInfo.pay_token_symbol,
            tradePair: data?.poolInfo.trade_pair,
            type: 0,
          };
        })
        .concat(unSubmitedPlayer as any);
    }
  }, [
    data?.poolInfo.pay_token_decimal,
    data?.poolInfo.pay_token_symbol,
    data?.poolInfo.trade_pair,
    data?.players,
    data?.positions,
    data?.fee,
    isOpend,
    address,
    isEnd,
    formattedClosePrice,
    formattedNowPrice,
    stakePrice,
    waitPositions,
  ]);

  const isSubmited = useMemo(() => {
    return [...waitPositions, ...(positions ?? [])]?.some(
      (position: any) => position.user === address
    );
  }, [waitPositions, positions, address]);

  const myPosition = useMemo(() => {
    return (positions as any[])?.find(position => position?.isMe);
  }, [positions]);

  const status = useMemo<'wait' | 'submit' | 'open' | 'end'>(() => {
    if (!isOpend) {
      return isSubmited ? 'submit' : 'wait';
    } else if (!isEnd) {
      return 'open';
    } else {
      return 'end';
    }
  }, [isOpend, isEnd, isSubmited]);

  const isOwner = useMemo(() => {
    if (!dealerId || !createDealerId) return false;
    return (createDealerId as BigNumber).eq(BigNumber.from(dealerId));
  }, [dealerId, createDealerId]);

  return {
    poolInfo: {
      ...data?.poolInfo,
      openPrice,
      nowPrice: formattedNowPrice,
      closePrice: formattedClosePrice,
      stakePrice,
      poolAddress: poolAddress as Address,
      createDealerId: createDealerId as BigNumber,
      isOwner,
      status,
      isOpend,
      isEnd,
      isSubmited,
    },
    players: data?.players ?? [],
    mergePositions,
    positions,
    myPosition,
    isLoading,
    refetch: mutate,
  };
};
