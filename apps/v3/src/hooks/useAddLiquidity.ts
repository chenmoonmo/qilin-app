import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo, useState } from 'react';
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import type { usePoolList } from './usePoolList';

export const useAddLiquidity = (
  data: ReturnType<typeof usePoolList>['data'][number]
) => {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data: marginToken } = useBalance({
    address,
    token: data.marginTokenAddress,
  });

  const [amount, setAmount] = useState('');

  const { isNeedApprove, approve } = useApprove(
    data.marginTokenAddress,
    data.assetAddress,
    parseUnits(amount || '0', marginToken?.decimals)
  );

  const { config, error } = usePrepareContractWrite({
    address: data.assetAddress,
    abi: Asset.abi,
    functionName: 'removeLiquidity',
    chainId,
    args: [
      address,
      {
        amount: parseUnits(amount || '0', marginToken?.decimals),
        payType: 1,
        playerAddress: address,
      },
    ],
    enabled: !!amount,
  });

  console.log(config, error);

  const { writeAsync } = useContractWrite(config);

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
