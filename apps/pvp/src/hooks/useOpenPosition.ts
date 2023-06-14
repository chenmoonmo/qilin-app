import { useToast } from '@qilin/component';
import { useCallback } from 'react';
import type { Address } from 'wagmi';
import { useContractWrite, useProvider } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Router from '@/constant/abis/Router.json';

type OpenPositionPropsType = {
  poolAddress: Address;
  duration: number;
};

export const useOpenPosition = ({
  poolAddress,
  duration,
}: OpenPositionPropsType) => {
  const provider = useProvider();

  const { showWalletToast, closeWalletToast } = useToast();

  const { writeAsync } = useContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: 'open',
    mode: 'recklesslyUnprepared',
  });

  return useCallback(async () => {
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const lastBolck = await provider.getBlockNumber();
      const nowTimestamp = await provider
        .getBlock(lastBolck)
        .then(res => res?.timestamp);
      const res = await writeAsync?.({
        recklesslySetUnpreparedArgs: [poolAddress, nowTimestamp + duration],
      });
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Pending',
        type: 'loading',
      });
      await res?.wait();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [
    closeWalletToast,
    duration,
    poolAddress,
    provider,
    showWalletToast,
    writeAsync,
  ]);
};
