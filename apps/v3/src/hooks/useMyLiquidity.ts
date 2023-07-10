import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { MyLiquidityItem } from '@/type';

export const useMyLiquidity = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  return useSWR(
    `/myLiquidity?chain_id=${chainId}&user_address=${address}&page_size=1000`,
    async (url: string) => {
      const result = await fetcher<{
        my_liquidity_list: MyLiquidityItem[];
      }>(url, {
        method: 'GET',
      });
      return (
        result?.my_liquidity_list?.map(item => {
          const decimal = 18;
          const { liquidity, lp_amount, user_lp_amount, roi, name } = item;

          const share =
            (+formatUnits(user_lp_amount, decimal) * 100) /
            +formatUnits(lp_amount, decimal);

          const [token0Symbol, token1Symbol] = name
            .split('/')
            .map(name => name.trim());

          return {
            ...item,
            token0Symbol,
            token1Symbol,
            share,
            // TODO: 和代币精度一样
            liquidity: formatUnits(liquidity, decimal),
            lp_amount: formatUnits(lp_amount, decimal),
            user_lp_amount: formatUnits(user_lp_amount, decimal),
            roi: formatUnits(roi, 4),
          };
        }) ?? []
      );
    },
    {
      fallbackData: [],
    }
  );
};
