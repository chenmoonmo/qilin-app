import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { HistoryPositionItem } from '@/type';

import { usePoolAddress } from './usePoolAddress';

const PAGE_SIZE = 10;

const formatUnitsAmount = (amount: string) => {
  const decimal = 18;
  return amount === '-' || !amount ? '-' : formatUnits(amount, decimal);
};

export const useHistoryPositions = (isFilter: boolean) => {
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
        ? `/historyPositions?${queryString}&page_size=${PAGE_SIZE}&page_index=${index}`
        : null,
    async url => {
      const result = await fetcher<{
        history_list: HistoryPositionItem[];
      }>(url, {
        method: 'GET',
      });
      return (
        result.history_list?.map(item => {
          const { Price, Margin, ServicesFee, PNL, FundingFee } = item;
          return {
            ...item,
            Price: formatUnitsAmount(Price),
            Margin: formatUnitsAmount(Margin),
            ServicesFee: formatUnitsAmount(ServicesFee),
            PNL: formatUnitsAmount(PNL),
            FundingFee: formatUnitsAmount(FundingFee),
          };
        }) ?? []
      );
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
