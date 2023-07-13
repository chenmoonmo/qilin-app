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
          const {
            oracle_address,
            asset_address,
            pool_address,
            name,
            liquidity,
            lp_amount,
            user_lp_amount,
            roi,
            user_liquidity,
            user_liquidity_value,
            token,
            token_name,
          } = item;

          const share =
            (+formatUnits(user_lp_amount, decimal) * 100) /
            +formatUnits(lp_amount, decimal);

          const [token0Symbol, token1Symbol] = name
            .split('/')
            .map(name => name.trim());

          return {
            // ...item,
            token,
            name,
            token0Symbol,
            token1Symbol,
            share,
            oracleAddress: oracle_address,
            assetAddress: asset_address,
            poolAddress: pool_address,
            liquidity: formatUnits(liquidity, decimal),
            LPAmount: formatUnits(lp_amount, decimal),
            userLPAmount: formatUnits(user_lp_amount, decimal),
            userLiquidity: formatUnits(user_liquidity, decimal),
            userLiquidityValue: formatUnits(user_liquidity_value, decimal),
            marginTokenSymbol: token_name,
            roi: +formatUnits(roi, 4) * 100,
          };
        }) ?? []
      );
    },
    {
      fallbackData: [],
    }
  );
};
