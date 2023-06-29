import qs from 'querystring';
import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';

import { usePoolAddress } from './usePoolAddress';

const PAGE_SIZE = 10;

export const usePositions = (isFilter?: boolean) => {
  const chainId = useChainId();
  const { address } = useAccount();

  const [assetAddress, poolAddress] = usePoolAddress();

  const queryString = useMemo(() => {
    return qs.stringify({
      chain_id: chainId,
      user_address: address,
      ...(isFilter
        ? {
            asset_address: assetAddress,
            pool_address: poolAddress,
          }
        : {}),
    });
  }, [address, assetAddress, chainId, isFilter, poolAddress]);

  const { data, isLoading, setSize, mutate } = useSWRInfinite(
    index =>
      chainId && address
        ? `/positions?${queryString}&page_size=${PAGE_SIZE}&page_index=${index}`
        : null,
    async url => {
      const result = await fetcher(url, {
        method: 'GET',
      });
      return result.position_list;
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
