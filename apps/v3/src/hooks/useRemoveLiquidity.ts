import { useToast } from '@qilin/component';
import type { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { type Address, useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';

export const useRemoveLiquidity = (
  assetAddress: Address,
  LPTokenAddress?: Address,
  amount?: BigNumber,
  onSuccess?: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { address } = useAccount();

  const { isNeedApprove, approve } = useApprove(
    LPTokenAddress,
    assetAddress,
    amount
  );

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: assetAddress,
    abi: Asset.abi,
    functionName: 'removeLiquidity',
    args: [
      address,
      {
        amount,
        payType: 1,
        payerAddress: address,
      },
    ],
  });

  const handleRemoveLiquidity = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });
    try {
      if (isNeedApprove) {
        await approve();
      }
      const res = await writeAsync?.();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Pending',
        type: 'loading',
      });
      await res?.wait;
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [
    approve,
    closeWalletToast,
    isNeedApprove,
    onSuccess,
    showWalletToast,
    writeAsync,
  ]);

  return useMemo(() => {
    return {
      handleRemoveLiquidity,
      isNeedApprove,
    };
  }, [handleRemoveLiquidity, isNeedApprove]);
};
