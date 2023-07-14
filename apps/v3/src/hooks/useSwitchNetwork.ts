import { useCallback, useMemo } from 'react';
import { useNetwork, useSwitchNetwork as useSwitchNetworkBase } from 'wagmi';

export const useSwitchNetwork = () => {
  const { chains, chain } = useNetwork();
  const { switchNetwork } = useSwitchNetworkBase();

  const isErrorNetwork = useMemo(
    () => !chains.find(item => item.id === chain?.id),
    [chain?.id, chains]
  );

  const handleSwitchNetwork = useCallback(() => {
    switchNetwork?.(chains[0].id);
  }, [chains, switchNetwork]);

  return useMemo(() => {
    return {
      isErrorNetwork,
      switchNetwork: handleSwitchNetwork,
    };
  }, [isErrorNetwork, handleSwitchNetwork]);
};
