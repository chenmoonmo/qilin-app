import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import { useChainId } from 'wagmi';

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

  return useSWR(
    chainId && assetAddress && poolAddress
      ? `/liquidation?chain_id=${chainId}&asset_address=${assetAddress}&pool_address=${poolAddress}&page_index=0&page_size=1000`
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
        list: liquidation_list?.map(item => {
          const { position_id, rewards, symbol, size, user_address } = item;
          return {
            symbol,
            user_address,
            positionId: position_id,
            rewards: formatUnits(rewards, 18),
            size: formatUnits(size, 18),
          };
        }),
        totalReward: +formatUnits(total_reward, 18),
      };
    },
    {
      fallbackData: {
        list: [],
        totalReward: 0,
      },
    }
  );
};
