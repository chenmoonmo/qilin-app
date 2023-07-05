import useSWR from 'swr';
import { useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { LiquidationItem } from '@/type';

export const useLiquidation = () => {
  const chainId = useChainId();

  return useSWR(
    chainId ? `/liquidation?chain_id=${chainId}` : null,
    async url => {
      const result = await fetcher<{
        liquidation_list: LiquidationItem[];
      }>(url, {
        method: 'GET',
      });
      return result.liquidation_list;
    }
  );
};
