import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import useSWR from 'swr';
import { type Address, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { Pool } from '@/type';

// import { usePoolAddress } from './usePoolAddress';

export const usePoolInfo = ({
  assetAddress,
  poolAddress,
  enabled = true,
}: {
  assetAddress?: Address;
  poolAddress?: Address;
  enabled?: boolean;
}) => {
  const chainId = useChainId();

  return useSWR(
    enabled
      ? `/poolInfo?chain_id=${chainId}&asset_address=${assetAddress}&pool_address=${poolAddress}`
      : '',
    async (url: string) => {
      const result = await fetcher<{
        pool: Pool;
      }>(url, {
        method: 'GET',
      });

      const {
        pool: {
          spot_price: spotPrice,
          nake_position: nakePosition,
          funding_8: funding,
          pair_info: {
            ID,
            asset_info,
            pool_info,
            future_price: futurePrice,
            volumn_24: volume,
            future_chang_24: change,
          },
          size_info: {
            position_long: positionLong,
            position_short: positionShort,
            rebase_long: rebaseLong,
            rebase_short: rebaseShort,
          },
          setting: {
            margin_ratio: marginRatio,
            fee_ratio: closeRatio,
            legal_level: leverages,
          },
        },
      } = result;

      const {
        liquidity,
        pool_decimal: poolDecimal,
        lp_amount: LPAmount,
        pool_decimal: decimal,
        pool_token: marginTokenAddress,
        lp_token: LPAddress,
        pool_name: marginTokenSymbol,
      } = asset_info;

      const { name: pairName, oracle: oracleAddress } = pool_info;

      const LPPrice = BigNumber.from(liquidity)
        .div(BigNumber.from(LPAmount))
        .toNumber();

      const [token0Symbol, token1Symbol] = pairName
        .split('/')
        .map(item => item.trim());

      return {
        ID,
        pairName,
        token0Symbol,
        token1Symbol,
        marginTokenAddress,
        assetAddress,
        poolAddress,
        oracleAddress,
        LPAddress,
        LPPrice,
        marginTokenSymbol,
        leverages: leverages.map(item => item.toString()),
        positionLong: +formatUnits(positionLong, decimal),
        positionShort: +formatUnits(positionShort, decimal),
        rebaseLong: +formatUnits(rebaseLong, decimal),
        rebaseShort: +formatUnits(rebaseShort, decimal),
        liquidity: +formatUnits(liquidity, poolDecimal),
        futurePrice: +formatUnits(futurePrice, decimal),
        spotPrice: +formatUnits(spotPrice, decimal),
        nakePosition: formatUnits(nakePosition, decimal),
        volume: formatUnits(volume, decimal),
        funding: +formatUnits(funding, 4) * 100,
        change: +formatUnits(change, 4) * 100,
        marginRatio: +formatUnits(marginRatio, 4),
        closeRatio: +formatUnits(closeRatio, 4),
      };
    }
  );
};
