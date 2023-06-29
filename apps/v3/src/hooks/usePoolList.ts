import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PoolItem } from '@/type';

const PAGE_SIZE = 10;

export const usePoolList = (searchInfo?: string) => {
  const chainId = useChainId();

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
      return result.pool_list?.map(pool => {
        const change = pool.future_chang_24;
        const futurePrice = pool.future_price;
        const volumn = pool.volumn_24;
        const decimal = pool.asset_info.pool_decimal;
        const assetAddress = pool.asset_info.asset;
        const poolAddress = pool.pool_info.pool;

        const liquidity = pool.asset_info.liquidity;

        const pairName = pool.pool_info.name;

        return {
          origin: pool,
          ID: pool.ID,
          pairName,
          assetAddress,
          poolAddress,
          volumn: formatUnits(volumn, decimal),
          change: +formatUnits(change, 6) * 100,
          futurePrice: formatUnits(futurePrice, decimal),
          liquidity: formatUnits(liquidity, decimal),
        };
      });
    }
  );

  const getNextPage = () => {
    setSize((prevSize: number) => prevSize + 1);
  };

  const allData = useMemo(() => {
    return data?.flat() ?? [];
  }, [data]);

  return {
    data: allData,
    getNextPage,
    isLoading,
    mutate,
  };
};
