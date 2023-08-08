import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { ApplyRemoveItem } from '@/type';

export const useApplyRemoveList = () => {
  const chainId = useChainId();
  const { address } = useAccount();

  return useSWR(
    chainId && address
      ? `/userApplyRemove?chain_id=${chainId}&user_address=${address}&page_index=0&page_size=1000`
      : null,
    async (url: string) => {
      const result = await fetcher<{
        apply_remove_list: ApplyRemoveItem[];
      }>(url, {
        method: 'GET',
      });
      const { apply_remove_list } = result;
      // TODO: format data
      return apply_remove_list.map(item => {
        const {
          index,
          status,
          name,
          asset_address: assetAddress,
          lp_amount: LPAmount,
        } = item;

        return {
          name,
          index,
          status,
          assetAddress,
          LPAmount: formatUnits(LPAmount, 18),
        };
      });
    },
    {
      fallbackData: [],
    }
  );
};
