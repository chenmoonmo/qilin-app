import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import { useAccount, useChainId } from 'wagmi';

import { fetcher } from '@/helper';
import type { LiquidationItem } from '@/type';

export const useLiquidationList = ({
  assetAddress,
  poolAddress,
}: {
  assetAddress?: Address;
  poolAddress?: Address;
}) => {
  const chainId = useChainId();
  const { address } = useAccount();

  return useSWR(
    chainId && assetAddress && poolAddress
      ? `/liquidation?chain_id=${chainId}&user_addres=${address}&asset_address=${assetAddress}&pool_address=${poolAddress}`
      : null,
    async (url: string) => {
      const result = await fetcher<{
        total_reward: string;
        liquidation_list: LiquidationItem[];
      }>(url, {
        method: 'GET',
      });

      const { liquidation_list, total_reward } = result;
      return {
        list: liquidation_list,
        totalReward: formatUnits(total_reward, 18),
      };
    },
    {}
  );
};
