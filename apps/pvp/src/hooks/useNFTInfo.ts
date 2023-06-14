import type { Address } from 'wagmi';

import { CONTRACTS, NFTBaseUrl } from '@/constant';

export const useNFTInfo = (address: Address, tokenId: number) => {
  // const { data } = useContractRead({
  //   address,
  //   abi: erc721ABI,
  //   functionName: 'tokenURI',
  //   args: [BigNumber.from(tokenId)],
  //   enabled: !!tokenId,
  // });

  // 暂时返回
  return {
    // 系列名称
    // metadate
    name: address === CONTRACTS.PlayerAddress ? 'Trading Room' : 'Room Card',
    description:
      'Friendly OpenSea Creature that enjoys long swims in the ocean.',
    animation_url:
      address === CONTRACTS.PlayerAddress
        ? `${NFTBaseUrl}player/${tokenId}`
        : `${NFTBaseUrl}dealer/${tokenId}`,
  };
};
