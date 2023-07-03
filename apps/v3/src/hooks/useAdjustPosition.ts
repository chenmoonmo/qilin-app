import { useCallback, useMemo, useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';
import type { PositionItem } from '@/type';

import { useApprove } from './useApprove';

export const useAdjustPosition = (data: PositionItem) => {
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
