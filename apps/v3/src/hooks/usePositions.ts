import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PositionItem } from '@/type';

import { usePoolAddress } from './usePoolAddress';

const PAGE_SIZE = 10;

export const usePositions = (isFilter = false) => {
  const chainId = useChainId();
  const { address } = useAccount();

  const [assetAddress, poolAddress] = usePoolAddress();

  const [pageIndex, setPageIndex] = useState(0);

  const queryString = useMemo(() => {
    return qs.stringify({
      chain_id: chainId,
      user_address: address,
      asset_address: assetAddress,
      pool_address: poolAddress,
      tick: isFilter,
      page_index: pageIndex,
      page_size: PAGE_SIZE,
    });
  }, [address, assetAddress, chainId, isFilter, pageIndex, poolAddress]);

  const { data, isLoading, mutate } = useSWR(
    chainId && address ? `/positions?${queryString}` : null,
    async url => {
      const result = await fetcher<{
        position_list: PositionItem[];
        total: number;
      }>(url, {
        method: 'GET',
      });

      const { position_list, total } = result;

      return {
        list: position_list.map(item => {
          const {
            pool_name,
            funding_fee,
            margin,
            open_price,
            service_fee,
            pnl,
            size,
            margin_ratio,
            position_ratio,
            open_rebase,
          } = item;

          const decimal = 18;

          const [token0Symbol, token1Symbol] = pool_name
            .split('/')
            .map(item => item.trim());

          return {
            ...item,
            token0Symbol,
            token1Symbol,
            poolName: pool_name,
            fundingFee: -+formatUnits(funding_fee, decimal),
            margin: +formatUnits(margin, decimal),
            openPrice: +formatUnits(open_price, decimal),
            serviceFee: +formatUnits(service_fee, decimal),
            pnl: +formatUnits(pnl, decimal),
            size: +formatUnits(size, decimal),
            openRebase: +formatUnits(open_rebase, decimal),
            marginRatio: +formatUnits(margin_ratio, 4),
            positionRatio: +formatUnits(position_ratio, 4),
          };
        }),
        total,
      };
    }
  );

  return {
    data: data?.list ?? [],
    totalPage: data?.total ? Math.ceil(data.total / PAGE_SIZE) : 0,
    page: pageIndex + 1,
    setPage: setPageIndex,
    isLoading,
    mutate,
  };
};
