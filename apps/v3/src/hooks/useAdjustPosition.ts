import { useToast } from '@qilin/component';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';
import type { PositionItem } from '@/type';

import { useApprove } from './useApprove';

export const useAdjustPosition = (
  data: PositionItem,
  onSuccess: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const [amount, setAmount] = useState('');

  const { isNeedApprove, approve } = useApprove(
    data.pool_token,
    data.asset_address,
    +amount
  );

  const { writeAsync } = useContractWrite({
    address: data.asset_address,
    abi: Asset.abi,
    functionName: 'addMargin',
    mode: 'recklesslyUnprepared',
    args: [
      data.position_id,
      {
        payType: 1,
        amount,
        payerAddress: address,
      },
    ],
  });

  const handleAdjustPosition = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });

    try {
      if (isNeedApprove) {
        await approve();
      }
      const res = await writeAsync();
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
      amount,
      setAmount,
      isNeedApprove,
      handleAdjustPosition,
    };
  }, [amount, handleAdjustPosition, isNeedApprove]);
};
