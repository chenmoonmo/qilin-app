import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
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
  const [pageIndex, setPageIndex] = useState(0);

  const queryString = useMemo(() => {
    return qs.stringify({
      chain_id: chainId,
      user_address: address,
      page_size: PAGE_SIZE,
      page_index: pageIndex,
      ...(isFilter
        ? {
            asset_address: assetAddress,
            pool_address: poolAddress,
          }
        : {}),
    });
  }, [address, assetAddress, chainId, isFilter, pageIndex, poolAddress]);

  const { data, isLoading, mutate } = useSWR(
    chainId && address ? `/historyPositions?${queryString}` : null,
    async url => {
      const result = await fetcher<{
        history_list: HistoryPositionItem[];
        total: number;
      }>(url, {
        method: 'GET',
      });

      const { history_list, total } = result;
      return {
        list:
          history_list?.map(item => {
            const { Price, Margin, ServicesFee, PNL, FundingFee, pool_name } =
              item;
            const [token0Symbol, token1Symbol] = pool_name
              .split('/')
              .map(item => item.trim());

            return {
              ...item,
              Price: formatUnitsAmount(Price),
              Margin: formatUnitsAmount(Margin),
              ServicesFee: formatUnitsAmount(ServicesFee),
              PNL: formatUnitsAmount(PNL),
              FundingFee: formatUnitsAmount(FundingFee),
              token0Symbol,
              token1Symbol,
            };
          }) ?? [],
        total,
      };
    }
  );

  return useMemo(() => {
    return {
      data: data?.list ?? [],
      totalPage: data?.total ? Math.ceil(data.total / PAGE_SIZE) : 0,
      page: pageIndex + 1,
      setPage: setPageIndex,
      isLoading,
      mutate,
    };
  }, [data?.list, data?.total, isLoading, mutate, pageIndex]);
};
