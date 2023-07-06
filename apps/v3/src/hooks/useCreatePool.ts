import { useToast } from '@qilin/component';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import Factory from '@/abis/Factory.json';

import { useContractAddress } from './useContractAddress';

type UseCreatePoolProps = {
  tokenAddress: Address;
  oracleAddress: Address;
  onSuccess?: () => void;
};

export const useCreatePool = ({
  tokenAddress,
  oracleAddress,
  onSuccess,
}: UseCreatePoolProps) => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { factory, chainLink } = useContractAddress();

  const { config } = usePrepareContractWrite({
    address: factory,
    abi: Factory.abi,
    functionName: 'createPool',
    args: [tokenAddress, oracleAddress, chainLink, false],
  });

  const { writeAsync } = useContractWrite(config);

  const handleCreatePool = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });

    try {
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
      onSuccess?.();
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [closeWalletToast, onSuccess, showWalletToast, writeAsync]);

  return useMemo(() => {
    return {
      handleCreatePool,
    };
  }, [handleCreatePool]);
};
