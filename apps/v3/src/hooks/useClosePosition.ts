import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import type { usePositions } from './usePositions';

export const useClosePosition = (
  data: ReturnType<typeof usePositions>['data'][number],
  onSuccess: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { writeAsync } = useContractWrite({
    address: data.asset_address,
    abi: Asset.abi,
    functionName: 'closePosition',
    mode: 'recklesslyUnprepared',
    args: [data.position_id, address],
    overrides: {
      gasPrice: BigNumber.from(8000000000),
      gasLimit: BigNumber.from(8000000),
    },
  });

  const handleClosePosition = useCallback(async () => {
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
      await res.wait();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
      onSuccess();
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [closeWalletToast, onSuccess, showWalletToast, writeAsync]);

  return {
    handleClosePosition,
  };
};
