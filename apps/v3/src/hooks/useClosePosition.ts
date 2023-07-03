import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import type { usePositions } from './usePositions';

export const useClosePosition = (
  data: ReturnType<typeof usePositions>['data'][number]
) => {
  const { address } = useAccount();

  const { writeAsync } = useContractWrite({
    address: data.asset_address,
    abi: Asset.abi,
    functionName: 'closePosition',
    mode: 'recklesslyUnprepared',
    args: [data.position_id, address],
    overrides: {
      gasPrice: BigNumber.from(8000000000),
      gasLimit: BigNumber.from(8000000),
    },
  });

  const handleClosePosition = useCallback(async () => {
    const res = await writeAsync?.();
    await res.wait();
  }, [writeAsync]);

  return {
    handleClosePosition,
  };
};
