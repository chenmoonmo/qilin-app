import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useCallback, useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PoolItem } from '@/type';

const PAGE_SIZE = 10;

export const usePoolList = (withoutZero = true) => {
  const chainId = useChainId();

  const [searchInfo, setSearchInfo] = useState<undefined | string>();

  const getQueryString = useCallback(
    (index: number) => {
      return chainId
        ? `/poolList?${qs.stringify({
            chain_id: chainId,
            page_size: withoutZero ? PAGE_SIZE : 1000,
            without_zero: withoutZero,
            page_index: index,
            search_info: searchInfo,
          })}`
        : null;
    },
    [chainId, withoutZero, searchInfo]
  );

  const { data, setSize, isLoading, mutate } = useSWRInfinite(
    getQueryString,
    async url => {
      const result = await fetcher<{
        pool_list: PoolItem[];
      }>(url, {
        method: 'GET',
      });
      return (
        result.pool_list?.map(pool => {
          const decimal = 18;
          const change = pool.future_chang_24;
          const futurePrice = pool.future_price;
          const volumn = pool.volumn_24;
          const assetAddress = pool.asset_info.asset;
          const poolAddress = pool.pool_info.pool;
          const oracleAddress = pool.pool_info.oracle;

          const token0Icon = pool.pool_info.token0_image_url;
          const token1Icon = pool.pool_info.token1_image_url;

          const marginTokenAddress = pool.asset_info.pool_token;
          const marginTokenSymbol = pool.asset_info.pool_name;

          const liquidity = pool.asset_info.liquidity;
          const liquidity_value = pool.asset_info.liquidity_value;
          const LPAmount = pool.asset_info.lp_amount;
          const poolDecimal = pool.asset_info.pool_decimal;
          const marginTokenIcon = pool.asset_info.token_image_url;

          const apy = pool.apy;

          const LPPrice =
            +formatUnits(liquidity, decimal) / +formatUnits(LPAmount, decimal);

          const pairName = pool.pool_info.name;

          const [token0Symbol, token1Symbol] = pairName
            .split('/')
            .map(name => name.trim());

          return {
            pairName,
            assetAddress,
            poolAddress,
            oracleAddress,
            marginTokenAddress,
            marginTokenSymbol,
            token0Symbol,
            token1Symbol,
            LPPrice,
            token0Icon,
            token1Icon,
            marginTokenIcon,
            apy: apy ? +formatUnits(apy, 4) * 100 : apy,
            ID: pool.ID,
            volumn: pool.volumn_24
              ? formatUnits(volumn, decimal)
              : pool.volumn_24,
            change: +formatUnits(change, 4) * 100,
            futurePrice: formatUnits(futurePrice, decimal),
            liquidity: formatUnits(liquidity, poolDecimal),
            liquidityValue: +formatUnits(liquidity_value, decimal),
          };
        }) ?? []
      );
    }
  );

  const getNextPage = useCallback(() => {
    setSize((prevSize: number) => prevSize + 1);
  }, [setSize]);

  const canLoadMore = useMemo(() => {
    return data?.[data.length - 1]?.length === PAGE_SIZE;
  }, [data]);

  const allData = useMemo(() => {
    return data?.flat() ?? [];
  }, [data]);

  return useMemo(() => {
    return {
      data: allData,
      searchInfo,
      setSearchInfo,
      getNextPage,
      canLoadMore,
      isLoading,
      mutate,
    };
  }, [allData, canLoadMore, getNextPage, isLoading, mutate, searchInfo]);
};
