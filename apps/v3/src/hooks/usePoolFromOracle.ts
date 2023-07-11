import { formatUnits } from 'ethers/lib/utils.js';
import { useMemo } from 'react';
import useSWR from 'swr';
import { type Address, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PoolParam } from '@/type';

const formatUnitsAmount = (amount: string | number, decimal: number) => {
  return amount === '-' || !amount ? '-' : formatUnits(amount, decimal);
};

export const usePoolFromOracle = ({
  oracleAddress,
  tokenAddress,
  assetAddress,
  poolAddress,
  enabled,
}: {
  oracleAddress?: Address;
  tokenAddress?: Address;
  assetAddress?: Address;
  poolAddress?: Address;
  enabled?: boolean;
}) => {
  const chainId = useChainId();

  const url = useMemo(() => {
    if (!enabled) return null;
    if (oracleAddress && tokenAddress) {
      return `/poolFromOracle?chain_id=${chainId}&oracle=${oracleAddress}&token=${tokenAddress}`;
    }
    if (assetAddress && poolAddress) {
      return `/poolParam?chain_id=${chainId}&asset_address=${assetAddress}&pool_address=${poolAddress}`;
    }
    return null;
  }, [
    assetAddress,
    chainId,
    enabled,
    oracleAddress,
    poolAddress,
    tokenAddress,
  ]);

  const { data, error } = useSWR(
    url,
    async url => {
      const result = await fetcher<{ pool_param: PoolParam }>(url, {
        method: 'GET',
      });
      const parma = result.pool_param;

      const {
        fee_ratio,
        // leverage_rate,
        margin_ratio,
        liquidity,
        lp_price,
        asset_address,
        pool_address,
        apy,
        lp_amount,
        asset_level,
        liquidity_value,
      } = parma;

      return {
        ...parma,
        assetAddress: asset_address,
        poolAddress: pool_address,
        feeRatio: +formatUnitsAmount(fee_ratio, 4) * 100,
        apy: +formatUnitsAmount(apy, 4) * 100,
        marginRatio: +formatUnitsAmount(margin_ratio, 4) * 100,
        // //TODO: 和代币一样的精度
        liquidity: +formatUnitsAmount(liquidity, 18),
        LPPrice: +formatUnitsAmount(lp_price, 18),
        LPAmount: +formatUnitsAmount(lp_amount, 18),
        assetLevel: +formatUnitsAmount(asset_level, 4) * 100,
        liquidityValue: +formatUnitsAmount(liquidity_value, 18),
      };
    },
    {
      shouldRetryOnError: false,
    }
  );
  return {
    data: error ? null : data,
  };
};
