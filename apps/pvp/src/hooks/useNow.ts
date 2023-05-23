import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

// 获取当前区块的最新时间
export const useNow = () => {
  const [now, setNow] = useState<Date>(new Date());
  const provider = useProvider();

  useEffect(() => {
    provider.getBlockNumber().then(res => {
      provider.getBlock(res).then(res => {
        setNow(new Date(res.timestamp * 1000));
      });
    });
  }, []);
  return now;
};
