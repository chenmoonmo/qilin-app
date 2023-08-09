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
}: {
  marginTokenAddress?: Address;
  assetAddress?: Address;
  amount: string;
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
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      if (isNeedApprove) {
        await approve();
        showWalletToast({
          title: 'Transaction Confirmation',
          message: 'Transaction Confirmed',
          type: 'success',
        });
      } else {
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
      }
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 2000);
  }, [approve, closeWalletToast, isNeedApprove, showWalletToast, writeAsync]);

  const steps = useMemo(() => {
    return [
      {
        title: 'Approve',
        buttonText: 'Approve',
        onClick: async () => {
          if (isNeedApprove) {
            await approve();
          }
        },
      },
      {
        title: 'Add Liquidity',
        buttonText: 'Add Liquidity',
        onClick: async () => {
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
            setTimeout(closeWalletToast, 2000);
          } catch (e) {
            showWalletToast({
              title: 'Transaction Error',
              message: 'Please try again',
              type: 'error',
            });
            setTimeout(closeWalletToast, 2000);
            throw e;
          }
        },
      },
    ];
  }, [approve, closeWalletToast, isNeedApprove, showWalletToast, writeAsync]);

  return useMemo(() => {
    return {
      isNeedApprove,
      handleAddLiquidty,
      steps,
    };
  }, [handleAddLiquidty, isNeedApprove, steps]);
};
