import { BigNumber } from 'ethers';
import type { Address } from 'wagmi';
import { erc721ABI, useContractRead } from 'wagmi';

import { CONTRACTS } from '@/constant';

export const useNFTInfo = (address: Address, tokenId: number) => {
  const { data } = useContractRead({
    address,
    abi: erc721ABI,
    functionName: 'tokenURI',
    args: [BigNumber.from(tokenId)],
  });

  // 暂时返回
  return {
    // 系列名称
    // metadate
    name: 'Room Card',
    description:
      'Friendly OpenSea Creature that enjoys long swims in the ocean.',
    animation_url:
      address === CONTRACTS.PlayerAddress
        ? `http://localhost:3000/player/${tokenId}`
        : `http://localhost:3000/dealer/${tokenId}`,
  };
};
