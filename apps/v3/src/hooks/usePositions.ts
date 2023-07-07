import { formatUnits } from 'ethers/lib/utils.js';
import qs from 'querystring';
import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { PositionItem } from '@/type';

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
      const result = await fetcher<{
        position_list: PositionItem[];
      }>(url, {
        method: 'GET',
      });

      const { position_list } = result;

      return position_list.map(item => {
        const {
          pool_name,
          funding_fee,
          margin,
          open_price,
          service_fee,
          pnl,
          size,
          margin_ratio,
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
