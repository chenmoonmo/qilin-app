import type { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import {
  type Address,
  useAccount,
  useContractWrite,
} from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';

export const useRemoveLiquidity = (
  assetAddress: Address,
  LPTokenAddress?: Address,
  amount?: BigNumber
) => {
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
    if (isNeedApprove) {
      await approve();
    }
    const res = await writeAsync?.();
    await res?.wait;
  }, [approve, isNeedApprove, writeAsync]);

  return useMemo(() => {
    return {
      handleRemoveLiquidity,
      isNeedApprove
    };
  }, [handleRemoveLiquidity, isNeedApprove]);
};
