import dayjs from 'dayjs';
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
          out_time,
          lp_amount,
          token_amount,
          asset_address: assetAddress,
          pool_name: poolName,
        } = item;

        return {
          name,
          index,
          status,
          assetAddress,
          poolName,
          LPAmount: formatUnits(lp_amount, 18),
          tokenAmount: formatUnits(token_amount, 18),
          outTime: dayjs.unix(out_time).utc().format('YYYY-MM-DD HH:mm:ss UTC'),
        };
      });
    },
    {
      fallbackData: [],
    }
  );
};
