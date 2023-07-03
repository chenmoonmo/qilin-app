import type { Address } from 'wagmi';
import { useAccount, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';

export const useClosePosition = (assetAddress: Address, tokenId: number) => {
  const { address } = useAccount();

  const {} = useApprove();

  const {} = useContractWrite({
    address: assetAddress,
    abi: Asset.abi,
    functionName: 'closePosition',
    mode: 'recklesslyUnprepared',
    args: [tokenId, address],
  });
};
