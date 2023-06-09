import { useEffect, useMemo, useState } from 'react';
import { useProvider } from 'wagmi';

// 获取当前区块的最新时间
export const useNow = () => {
  const [now, setNow] = useState<Date>(new Date());
  const provider = useProvider();

  useEffect(() => {
    provider.getBlockNumber().then(res => {
      provider.getBlock(res).then(res => {
        if (res && res.timestamp) {
          setNow(new Date(res?.timestamp * 1000));
        }
      });
    });
  }, [provider]);

  return useMemo(() => {
    return now;
  }, [now]);
};
