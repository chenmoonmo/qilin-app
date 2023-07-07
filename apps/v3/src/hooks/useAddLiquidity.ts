import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useBalance, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';

export const useAddLiquidity = ({
  marginTokenAddress,
  assetAddress,
  amount,
  onSuccess,
}: {
  marginTokenAddress?: Address;
  assetAddress?: Address;
  amount: string;
  onSuccess: () => void;
}) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { data: marginToken } = useBalance({
    address,
    token: marginTokenAddress,
  });

  //  带精度的 amount
  const amountWithDecimals = useMemo(() => {
    if (!amount || !marginToken?.decimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(amount, marginToken.decimals));
  }, [amount, marginToken?.decimals]);

  const { isNeedApprove, approve } = useApprove(
    marginTokenAddress,
    assetAddress,
    amountWithDecimals
  );

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: assetAddress,
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
      handleAddLiquidty,
    };
  }, [handleAddLiquidty]);
};
