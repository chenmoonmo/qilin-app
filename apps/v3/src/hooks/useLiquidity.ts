import { useToast } from '@qilin/component';
import { useMemo } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

type UseLiquidityProps = {
  assetAddress: Address;
  positionID: number;
  onSuccess?: () => void;
};

export const useLiquidity = ({
  assetAddress,
  positionID,
  onSuccess,
}: UseLiquidityProps) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: assetAddress,
    abi: Asset.abi,
    functionName: 'liquidity',
    args: [positionID, address],
  });

  const { writeAsync } = useContractWrite(config);

  const handleLiquidate = useMemo(async () => {
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
      handleLiquidate,
    };
  }, [handleLiquidate]);
};
