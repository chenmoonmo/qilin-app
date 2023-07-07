import { isAddress } from 'ethers/lib/utils.js';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/helper';
import type { OracleItem } from '@/type';

export const useOracles = (value?: string) => {
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

  return useMemo(() => {
    return {
      data:
        data?.filter(
          item =>
            item.text.toLowerCase().includes(searchInfo.toLowerCase()) ||
            (isAddress(searchInfo) &&
              item.oracleAddress
                .toLowerCase()
                .includes(searchInfo.toLowerCase())) ||
            (value &&
              item.oracleAddress.toLowerCase().includes(value.toLowerCase()))
        ) ?? [],
      currentItem: data?.find(item => item.value === value),
      searchInfo,
      setSearchInfo,
    };
  }, [data, searchInfo, value]);
};
