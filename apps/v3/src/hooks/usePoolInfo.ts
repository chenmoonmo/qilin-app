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
          spot_price,
          nake_position: nakePosition,
          funding_8: funding,
          pair_info: {
            ID,
            asset_info,
            pool_info,
            future_price,
            volumn_24: volume,
            future_chang_24: change,
          },
          size_info: {
            position_long: positionLong,
            position_short: positionShort,
            rebase_long: rebaseLong,
            rebase_short: rebaseShort,
            request_time: requestTime,
            last_rebase_time: lastRebaseTime,
            last_price: lastPrice,
          },
          setting: {
            liquidity_move_ratio,
            base_liquidity,
            margin_ratio: marginRatio,
            fee_ratio: closeRatio,
            legal_level: leverages,
            price_threshold_Ratio,
            asset_level: assetLevels,
            price_shock_ratio: priceShockRatio,
            price_effective_time: priceEffectiveTime,
            liquidity_move_time: liquidityMoveTime,
          },
        },
      } = result;

      const {
        pool_decimal: poolDecimal,
        lp_amount: LPAmount,
        pool_decimal: decimal,
        pool_token: marginTokenAddress,
        lp_token: LPAddress,
        pool_name: marginTokenSymbol,
        token_image_url: marginTokenIcon,
      } = asset_info;

      const liquidity = +formatUnits(asset_info.liquidity, poolDecimal);

      const {
        name: pairName,
        oracle: oracleAddress,
        liquidity_time: liquidityTime,
        asset_liquidity,
        token0_image_url: token0Icon,
        token1_image_url: token1Icon,
      } = pool_info;

      const futurePrice = +formatUnits(future_price, decimal);
      const spotPrice = +formatUnits(spot_price, decimal);

      const priceThresholdRatio = +formatUnits(price_threshold_Ratio, 4);

      // 时间差
      // const timeDiff = requestTime - lastRebaseTime;

      const LPPrice = BigNumber.from(asset_info.liquidity)
        .div(BigNumber.from(LPAmount))
        .toNumber();

      const [token0Symbol, token1Symbol] = pairName
        .split('/')
        .map(item => item.trim());

      const priceDiff = (futurePrice - spotPrice) / spotPrice;
      const liquidityMoveRatio = +formatUnits(liquidity_move_ratio, 4);
      const assetLiquidity = +formatUnits(asset_liquidity, poolDecimal);
      const baseLiquidity = +formatUnits(base_liquidity, poolDecimal);

      const currentLiquidty = Math.max(assetLiquidity, baseLiquidity);

      let T2 = liquidity;

      if (priceDiff !== 0) {
        const T =
          (priceThresholdRatio *
            liquidityMoveRatio *
            (requestTime - liquidityTime) *
            currentLiquidty) /
          (Math.abs(priceDiff) * liquidityMoveTime);

        if (assetLiquidity < liquidity) {
          T2 = Math.min(assetLiquidity + T, liquidity);
        } else {
          T2 = Math.max(assetLiquidity - T, liquidity);
        }
      }

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
        spotPrice,
        futurePrice,
        assetLevels,
        priceThresholdRatio,
        requestTime,
        lastRebaseTime,
        priceEffectiveTime,
        token0Icon,
        token1Icon,
        marginTokenIcon,
        liquidity: T2,
        leverages: leverages.map(item => item.toString()),
        lastPrice: +formatUnits(lastPrice, decimal),
        positionLong: +formatUnits(positionLong, decimal),
        positionShort: +formatUnits(positionShort, decimal),
        rebaseLong: +formatUnits(rebaseLong, decimal),
        rebaseShort: +formatUnits(rebaseShort, decimal),
        nakePosition: formatUnits(nakePosition, decimal),
        volume: formatUnits(volume, decimal),
        funding: +formatUnits(funding, 4) * 100,
        change: +formatUnits(change, 4) * 100,
        marginRatio: +formatUnits(marginRatio, 4),
        closeRatio: +formatUnits(closeRatio, 4),
        priceShockRatio: +formatUnits(priceShockRatio, 4),
      };
    },
    {
      refreshInterval: 10_000,
    }
  );
};
