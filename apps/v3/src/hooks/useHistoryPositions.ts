import qs from 'querystring';
import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';

const PAGE_SIZE = 10;

export const useHistoryPositions = () => {
  const chainId = useChainId();
  const { address } = useAccount();

  const queryString = useMemo(() => {
    return qs.stringify({
      chain_id: chainId,
      user_address: address,
    });
  }, [address, chainId]);

  const { data, isLoading, setSize, mutate } = useSWRInfinite(
    index =>
      chainId && address
        ? `/historyPositions?${queryString}&page_size=${PAGE_SIZE}&page_index=${index}`
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
