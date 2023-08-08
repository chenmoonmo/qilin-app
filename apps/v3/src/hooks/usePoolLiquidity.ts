import dayjs from 'dayjs';
import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import { useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { liquidityItem } from '@/type';

export const usePoolLiquidity = () => {
  const chainId = useChainId();

  return useSWR(
    chainId
      ? `/poolLiquidity?chain_id=${chainId}&page_index=0&page_size=1000`
      : null,
    async url => {
      const result = await fetcher<{
        liquidity_list: liquidityItem[];
      }>(url, {
        method: 'GET',
      });

      const { liquidity_list } = result;

      return liquidity_list.map(item => {
        const decimal = 18;

        const {
          asset_address: assetAddress,
          oracle_address: oracleAddress,
          pool_address: poolAddress,
          token: marginTokenAddress,
          name: pairName,
          epoch_end_time: epochEndTime,
          epoch_index: epochIndex,
          epoch_start_time: epochStartTime,
          lp_amount,
          liquidity_value,
          liquidity,
          apy,
          token_name,
        } = item;

        const LPPrice =
          +formatUnits(liquidity, decimal) / +formatUnits(lp_amount, decimal);

        const [token0Symbol, token1Symbol] = pairName
          .split('/')
          .map(name => name.trim());

        return {
          assetAddress,
          oracleAddress,
          poolAddress,
          marginTokenAddress,
          pairName,
          LPPrice,
          token0Symbol,
          token1Symbol,
          marginTokenSymbol: token_name,
          epochStartTime:
            epochIndex > 0
              ? dayjs
                  .unix(epochStartTime)
                  .utc()
                  .format('YYYY.MM.DD HH:mm:ss UTC')
              : '-',
          epochEndTime:
            epochIndex > 0
              ? dayjs.unix(epochEndTime).utc().format('YYYY.MM.DD HH:mm:ss UTC')
              : '-',
          epochIndex: epochIndex > 0 ? epochIndex : '-',
          apy: +apy ? +formatUnits(apy, 4) * 100 : apy,
          liquidityValue: +formatUnits(liquidity_value, decimal),
          liquidity: +formatUnits(liquidity, decimal),
        };
      });
    }
  );
};
