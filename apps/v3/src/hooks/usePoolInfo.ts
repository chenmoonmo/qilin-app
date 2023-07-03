import { formatUnits } from 'ethers/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/helper';
import type { Pool } from '@/type';

import { usePoolAddress } from './usePoolAddress';
import { usePoolList } from './usePoolList';

export const usePoolInfo = () => {
  const router = useRouter();

  const [assetAddress, poolAddress] = usePoolAddress();

  const enabled = useMemo(
    () => assetAddress && poolAddress,
    [assetAddress, poolAddress]
  );

  const { data: poolList } = usePoolList();

  const {
    data: poolInfo,
    isLoading,
    mutate,
  } = useSWR(
    enabled
      ? `/poolInfo?asset_address=${assetAddress}&pool_address=${poolAddress}`
      : '',
    async (url: string) => {
      const result = await fetcher<{
        pool: Pool;
      }>(url, {
        method: 'GET',
      });

      const poolInfo = result.pool;
      const decimal = poolInfo.pair_info.asset_info.pool_decimal;
      const futurePrice = poolInfo.pair_info.future_price;
      const spotPrice = poolInfo.spot_price;
      const nakePosition = poolInfo.nake_position;
      const funding = poolInfo.funding_8;
      const change = poolInfo.pair_info.future_chang_24;
      const volume = poolInfo.pair_info.volumn_24;
      const pairName = poolInfo.pair_info.pool_info.name;
      const levels = poolInfo.setting.legal_level.map(item => item.toString());

      const liquidity = poolInfo.pair_info.asset_info.liquidity;
      const positionLong = poolInfo.size_info.position_long;
      const positionShort = poolInfo.size_info.position_short;

      const [token0Name, token1Name] = poolInfo.pair_info.pool_info.name
        .split('/')
        .map(item => item.trim());

      const marginTokenAddress = poolInfo.pair_info.asset_info.pool_token;

      return {
        pairName,
        levels,
        token0Name,
        token1Name,
        marginTokenAddress,
        origin: poolInfo,
        ID: poolInfo.pair_info.ID,
        positionLong: +formatUnits(positionLong, decimal),
        positionShort: +formatUnits(positionShort, decimal),
        liquidity: +formatUnits(liquidity, decimal),
        futurePrice: +formatUnits(futurePrice, decimal),
        spotPrice: +formatUnits(spotPrice, decimal),
        nakePosition: formatUnits(nakePosition, decimal),
        funding: formatUnits(funding, decimal),
        volume: formatUnits(volume, decimal),
        change: +formatUnits(change, 4) * 100,
      };
    }
  );

  useEffect(() => {
    const pool = poolList?.[0];
    if (!enabled && pool) {
      router.replace(
        `/?assetAddress=${pool.assetAddress}&poolAddress=${pool.poolAddress}`
      );
    }
  }, [assetAddress, enabled, poolAddress, poolList, router]);

  return {
    data: poolInfo,
    isLoading,
    mutate,
  };
};
