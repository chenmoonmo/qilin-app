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

      const { pool: poolInfo } = result;

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
      const leverages = poolInfo.setting.legal_level.map(item =>
        item.toString()
      );
      const positionLong = poolInfo.size_info.position_long;
      const positionShort = poolInfo.size_info.position_short;

      const oracleAddress = poolInfo.pair_info.pool_info.oracle;
      const marginTokenAddress = poolInfo.pair_info.asset_info.pool_token;
      const LPAddress = poolInfo.pair_info.asset_info.lp_token;

      const funding = poolInfo.funding_8;
      const change = poolInfo.pair_info.future_chang_24;
      const marginRatio = poolInfo.setting.margin_ratio;

      const rebaseLong = poolInfo.size_info.rebase_long;
      const rebaseShort = poolInfo.size_info.rebase_short;
      const fee_ratio = poolInfo.setting.fee_ratio;

      const marginTokenSymbol = poolInfo.pair_info.asset_info.pool_name;
      const [token0Symbol, token1Symbol] = pairName
        .split('/')
        .map(item => item.trim());

      return {
        pairName,
        leverages,
        token0Symbol,
        token1Symbol,
        marginTokenAddress,
        assetAddress,
        poolAddress,
        oracleAddress,
        LPAddress,
        LPPrice,
        marginTokenSymbol,
        ID: poolInfo.pair_info.ID,
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
        closeRatio: +formatUnits(fee_ratio, 4),
        // origin: poolInfo,
      };
    }
  );
};
