import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';

import { fetcher } from '@/helper';
import type { PoolParam } from '@/type';

const formatUnitsAmount = (amount: string | number, decimal: number) => {
  return amount === '-' || !amount ? '-' : formatUnits(amount, decimal);
};
export const usePoolParam = (
  assetAddress: string,
  poolAddress: string,
  enable: boolean
) => {
  return useSWR(
    assetAddress && poolAddress && enable
      ? `/poolParam?asset_address=${assetAddress}&pool_address=${poolAddress}`
      : null,
    async url => {
      const result = await fetcher<{
        pool_param: PoolParam;
      }>(url, {
        method: 'GET',
      });

      const fee_ratio = result.pool_param.fee_ratio;
      const leverage_rate = result.pool_param.leverage_rate;
      const margin_ratio = result.pool_param.margin_ratio;

      //TODO: 和代币一样的精度
      const liquidity = result.pool_param.liquidity;
      const lp_price = result.pool_param.lp_price;

      return {
        ...result.pool_param,
        fee_ratio: formatUnitsAmount(fee_ratio * 100, 4),
        leverage_rate: formatUnitsAmount(leverage_rate, 4),
        margin_ratio: formatUnitsAmount(margin_ratio, 4),
        liquidity: formatUnitsAmount(liquidity, 18),
        lp_price: formatUnitsAmount(lp_price, 18),
      };
    }
  );
};
