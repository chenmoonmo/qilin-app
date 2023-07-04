import { formatUnits } from 'ethers/lib/utils.js';
import useSWR from 'swr';
import type { Address } from 'wagmi';

import { fetcher } from '@/helper';
import type { KLineItem } from '@/type';

export const useKLine = (oracleAddress?: Address) => {
  return useSWR(
    oracleAddress ? `/futureLine?oracle=${oracleAddress}` : null,
    async url => {
      const result = await fetcher<{
        k_line_price: KLineItem[];
      }>(url, {
        method: 'GET',
      });
      return result.k_line_price
        ?.sort((a, b) => a.timestamp - b.timestamp)
        ?.map(item => {
          const { close, high, low, open } = item;
          return {
            ...item,
            close: +formatUnits(close, 18),
            high: +formatUnits(high, 18),
            low: +formatUnits(low, 18),
            open: +formatUnits(open, 18),
            time: item.timestamp,
          };
        });
    }
  );
};
