import { useToast } from '@qilin/component';
import { Contract } from 'ethers';
import { useCallback, useMemo } from 'react';
import { type Address, useSigner } from 'wagmi';

import Asset from '@/abis/Asset.json';

export const useRemoveLiquidityAfterApply = () => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { data: singer } = useSigner();

  const handleRemoveLiquidityAfterApply = useCallback(
    async ({
      assetAddress,
      removeIndex,
    }: {
      assetAddress: Address;
      removeIndex: number;
    }) => {
      const contract = new Contract(assetAddress, Asset.abi, singer!);

      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });

      try {
        const res = await contract.removeLiquidity(removeIndex);
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
      } catch (e) {
        showWalletToast({
          title: 'Transaction Error',
          message: 'Please try again',
          type: 'error',
        });
      }
      setTimeout(closeWalletToast, 3000);
    },
    [closeWalletToast, showWalletToast, singer]
  );

  return useMemo(() => {
    return {
      handleRemoveLiquidityAfterApply,
    };
  }, [handleRemoveLiquidityAfterApply]);
};
