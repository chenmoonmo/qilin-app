import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo, useState } from 'react';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import type { usePoolList } from './usePoolList';

export const useAddLiquidity = (
  data: ReturnType<typeof usePoolList>['data'][number]
) => {
  const { address } = useAccount();

  const { data: marginToken } = useBalance({
    address,
    token: data.marginTokenAddress,
  });

  const [amount, setAmount] = useState('');

  //  带精度的 amount
  const amountWithDecimals = useMemo(() => {
    if (!amount || !marginToken?.decimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(amount, marginToken.decimals));
  }, [amount, marginToken?.decimals]);

  const { isNeedApprove, approve } = useApprove(
    data.marginTokenAddress,
    data.assetAddress,
    amountWithDecimals
  );

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.assetAddress,
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
    if (isNeedApprove) {
      await approve();
    }
    const res = await writeAsync?.();
    await res?.wait();
  }, [approve, isNeedApprove, writeAsync]);

  return useMemo(() => {
    return {
      amount,
      setAmount,
      handleAddLiquidty,
      marginToken,
    };
  }, [amount, handleAddLiquidty, marginToken]);
};
