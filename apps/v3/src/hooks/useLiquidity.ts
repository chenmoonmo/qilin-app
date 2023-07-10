import { useToast } from '@qilin/component';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

type UseLiquidityProps = {
  assetAddress?: Address;
  onSuccess?: () => void;
};

export const useLiquidity = ({
  assetAddress,
  onSuccess,
}: UseLiquidityProps) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: assetAddress,
    abi: Asset.abi,
    functionName: 'liquidity',
  });

  const handleLiquidate = useCallback(
    async (positionId: number) => {
      console.log(positionId);
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      try {
        const res = await writeAsync({
          recklesslySetUnpreparedArgs: [positionId, address!],
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
        onSuccess?.();
      } catch (e) {
        showWalletToast({
          title: 'Transaction Error',
          message: 'Please try again',
          type: 'error',
        });
      }
      setTimeout(closeWalletToast, 3000);
    },
    [address, closeWalletToast, onSuccess, showWalletToast, writeAsync]
  );

  return useMemo(() => {
    return {
      handleLiquidate,
    };
  }, [handleLiquidate]);
};
