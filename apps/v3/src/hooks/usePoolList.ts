import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useCallback, useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PoolItem } from '@/type';

const PAGE_SIZE = 10;

export const usePoolList = () => {
  const chainId = useChainId();
  const [searchInfo, setSearchInfo] = useState<undefined | string>();

  const { data, setSize, isLoading, mutate } = useSWRInfinite(
    index => (chainId ? ['/poolList', index, searchInfo] : null),
    async ([url, page_index, search_info]) => {
      const result = await fetcher<{
        pool_list: PoolItem[];
      }>(
        `${url}?${qs.stringify({
          chain_id: chainId,
          page_size: PAGE_SIZE,
          search_info,
          page_index,
        })}`,
        {
          method: 'GET',
        }
      );
      return (
        result.pool_list?.map(pool => {
          const change = pool.future_chang_24;
          const futurePrice = pool.future_price;
          const volumn = pool.volumn_24;
          const decimal = pool.asset_info.pool_decimal;
          const assetAddress = pool.asset_info.asset;
          const poolAddress = pool.pool_info.pool;

          const marginTokenAddress = pool.asset_info.pool_token;
          const marginTokenSymbol = pool.asset_info.pool_name;

          const liquidity = pool.asset_info.liquidity;
          const LPAmount = pool.asset_info.lp_amount;
          const poolDecimal = pool.asset_info.pool_decimal;

          const LPPrice = BigNumber.from(liquidity).div(LPAmount).toString();

          const pairName = pool.pool_info.name;

          const [token0Name, token1Name] = pairName
            .split('/')
            .map(name => name.trim());

          return {
            origin: pool,
            ID: pool.ID,
            pairName,
            assetAddress,
            poolAddress,
            marginTokenAddress,
            marginTokenSymbol,
            token0Name,
            token1Name,
            LPPrice,
            volumn: formatUnits(volumn, decimal),
            change: +formatUnits(change, 4) * 100,
            futurePrice: formatUnits(futurePrice, decimal),
            liquidity: formatUnits(liquidity, poolDecimal),
          };
        }) ?? []
      );
    }
  );

  const getNextPage = useCallback(() => {
    setSize((prevSize: number) => prevSize + 1);
  }, [setSize]);

  const allData = useMemo(() => {
    return data?.flat() ?? [];
  }, [data]);

  return useMemo(() => {
    return {
      data: allData,
      searchInfo,
      setSearchInfo,
      getNextPage,
      isLoading,
      mutate,
    };
  }, [allData, getNextPage, isLoading, mutate, searchInfo]);
};
