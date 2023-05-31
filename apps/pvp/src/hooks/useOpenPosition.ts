import { useToast } from '@qilin/component';
import { useCallback } from 'react';
import type { Address } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Router from '@/constant/abis/Router.json';

type OpenPositionPropsType = {
  poolAddress: Address;
  endTime: number;
  enabled: boolean;
};

export const useOpenPosition = ({
  poolAddress,
  endTime,
  enabled = false,
}: OpenPositionPropsType) => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: 'open',
    args: [poolAddress, endTime],
    enabled,
  });

  const { writeAsync } = useContractWrite(config);

  return useCallback(async () => {
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const res = await writeAsync?.();
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
  }, [writeAsync]);
};
