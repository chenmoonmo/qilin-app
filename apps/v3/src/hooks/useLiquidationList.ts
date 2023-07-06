import useSWR from 'swr';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { LiquidationItem } from '@/type';

export const useLiquidationList = () => {
  const chainId = useChainId();
  const { address } = useAccount();

  return useSWR(
    chainId
      ? `/liquidation?chain_id=${chainId}&user_addres=${address}&asset_address=0x9705D3d013cB3dc406B8e29A0860E3686164199c&pool_address=0x0824Ca3F63f0E0f1Cf77808334b514D1278C6ef4`
      : null,
    async (url: string) => {
      const result = await fetcher<{
        liquidation_list: LiquidationItem[];
      }>(url, {
        method: 'GET',
      });
      return result.liquidation_list;
    }
  );
};
