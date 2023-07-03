import { useCallback, useMemo, useState } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';

export const useAdjustPosition = (
  assetAddress: Address,
  mariginTokenAddress: Address,
  tokenId: number
) => {
  const { address } = useAccount();

  const [amount, setAmount] = useState(0);

  const { isNeedApprove, approve } = useApprove(
    mariginTokenAddress,
    assetAddress,
    amount
  );

  const { writeAsync } = useContractWrite({
    address: assetAddress,
    abi: Asset.abi,
    functionName: 'addMargin',
    mode: 'recklesslyUnprepared',
    args: [
      tokenId,
      {
        payType: 1,
        amount,
        payerAddress: address,
      },
    ],
  });

  const handleAdjustPosition = useCallback(async () => {
    if (isNeedApprove) {
      await approve();
    }
    const res = await writeAsync();
    await res.wait();
  }, [approve, isNeedApprove, writeAsync]);

  return useMemo(() => {
    return {
      amount,
      setAmount,
      isNeedApprove,
      handleAdjustPosition,
    };
  }, [amount, handleAdjustPosition, isNeedApprove]);
};
