import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import useSWR from 'swr';
import { type Address, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { Pool } from '@/type';

// import { usePoolAddress } from './usePoolAddress';

export const usePoolInfo = (
  assetAddress?: Address,
  poolAddress?: Address,
  enabled = true
) => {
  const chainId = useChainId();

  const {
    data: poolInfo,
    isLoading,
    mutate,
  } = useSWR(
    enabled
      ? `/poolInfo?chain_id=${chainId}&asset_address=${assetAddress}&pool_address=${poolAddress}`
      : '',
    async (url: string) => {
      const result = await fetcher<{
        pool: Pool;
      }>(url, {
        method: 'GET',
      });

      const poolInfo = result.pool;

      const poolDecimal = poolInfo.pair_info.asset_info.pool_decimal;
      const liquidity = poolInfo.pair_info.asset_info.liquidity;
      const LPAmount = poolInfo.pair_info.asset_info.lp_amount;

      const LPPrice = BigNumber.from(liquidity)
        .div(BigNumber.from(LPAmount))
        .toNumber();

      const decimal = poolInfo.pair_info.asset_info.pool_decimal;
      const futurePrice = poolInfo.pair_info.future_price;
      const spotPrice = poolInfo.spot_price;
      const nakePosition = poolInfo.nake_position;
      const volume = poolInfo.pair_info.volumn_24;
      const pairName = poolInfo.pair_info.pool_info.name;
      const levels = poolInfo.setting.legal_level.map(item => item.toString());
      const positionLong = poolInfo.size_info.position_long;
      const positionShort = poolInfo.size_info.position_short;

      const oracleAddress = poolInfo.pair_info.pool_info.oracle;
      const marginTokenAddress = poolInfo.pair_info.asset_info.pool_token;
      const LPAddress = poolInfo.pair_info.asset_info.lp_token;

      const funding = poolInfo.funding_8;
      const change = poolInfo.pair_info.future_chang_24;
      const marginRatio = poolInfo.setting.margin_ratio;

      const marginTokenSymbol = poolInfo.pair_info.asset_info.pool_name;
      const [token0Symbol, token1Symbol] = poolInfo.pair_info.pool_info.name
        .split('/')
        .map(item => item.trim());

      return {
        pairName,
        levels,
        token0Symbol,
        token1Symbol,
        marginTokenAddress,
        origin: poolInfo,
        ID: poolInfo.pair_info.ID,
        assetAddress,
        poolAddress,
        oracleAddress,
        LPAddress,
        LPPrice,
        marginTokenSymbol,
        positionLong: +formatUnits(positionLong, decimal),
        positionShort: +formatUnits(positionShort, decimal),
        liquidity: +formatUnits(liquidity, poolDecimal),
        futurePrice: +formatUnits(futurePrice, decimal),
        spotPrice: +formatUnits(spotPrice, decimal),
        nakePosition: formatUnits(nakePosition, decimal),
        volume: formatUnits(volume, decimal),
        funding: +formatUnits(funding, 4) * 100,
        change: +formatUnits(change, 4) * 100,
        marginRatio: +formatUnits(marginRatio, 4),
      };
    }
  );

  return useMemo(() => {
    console.log({
      poolInfo,
    });
    return {
      data: poolInfo,
      isLoading,
      mutate,
    };
  }, [isLoading, mutate, poolInfo]);
};
