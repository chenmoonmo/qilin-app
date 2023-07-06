import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import type { usePoolInfo } from './usePoolInfo';

export const useAddLiquidity = (
  data: ReturnType<typeof usePoolInfo>['data'],
  onSuccess: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { data: marginToken } = useBalance({
    address,
    token: data?.marginTokenAddress,
  });

  const [amount, setAmount] = useState('');

  //  带精度的 amount
  const amountWithDecimals = useMemo(() => {
    if (!amount || !marginToken?.decimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(amount, marginToken.decimals));
  }, [amount, marginToken?.decimals]);

  const { isNeedApprove, approve } = useApprove(
    data?.marginTokenAddress,
    data?.assetAddress,
    amountWithDecimals
  );

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data?.assetAddress,
    abi: Asset.abi,
    functionName: 'addLiquidity',
    args: [
      address,
      {
        amount: amountWithDecimals,
        payType: 1,
        payerAddress: address,
      },
    ],
  });

  const handleAddLiquidty = useCallback(async () => {
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
      await res?.wait();
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
      handleAddLiquidty,
      marginToken,
    };
  }, [amount, handleAddLiquidty, marginToken]);
};
