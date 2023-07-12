import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/helper';
import type { OracleItem } from '@/type';

export const useOracles = (currentIndex?: string) => {
  const [searchInfo, setSearchInfo] = useState('');

  const { data } = useSWR('/oracles', async url => {
    const result = await fetcher<{
      oracles: OracleItem[];
    }>(url, {
      method: 'GET',
    });
    return result.oracles.map((item, index) => {
      return {
        text: item.name,
        value: index + '',
        oracleAddress: item.address,
        tokenAddress: item.token_address,
      };
    });
  });

  console.log(data);

  return useMemo(() => {
    return {
      data:
        data?.filter((item, index) => {
          const oraclePairName = item.text.toLowerCase();
          const oracleAddress = item.oracleAddress.toLowerCase();
          const tokenAddress = item.tokenAddress.toLowerCase();
          const lowerSearchInfo = searchInfo.toLowerCase();

          return (
            [oraclePairName, oracleAddress, tokenAddress].some(item => {
              return item.includes(lowerSearchInfo);
            }) ||
            (currentIndex && index.toString() === currentIndex)
          );
        }) ?? [],
      currentItem: data?.find(item => item.value === currentIndex),
      searchInfo,
      setSearchInfo,
    };
  }, [currentIndex, data, searchInfo]);
};
