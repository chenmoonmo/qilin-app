import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import useSWR from 'swr';
import { type Address, erc721ABI, useContractRead } from 'wagmi';

import { CONTRACTS, NFTBaseUrl } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';
import Player from '@/constant/abis/Player.json';

const params = {
  [CONTRACTS.PlayerAddress]: {
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'uri',
  },
  [CONTRACTS.DealerAddress]: {
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'tokenURI',
  },
};

export const useNFTInfo = (address: Address, tokenId: number) => {
  const { data: tokenURI } = useContractRead({
    ...params[address],
    args: [BigNumber.from(tokenId ?? 0)],
  });

  // 获取系列名称
  const { data: seriesName } = useContractRead({
    address,
    abi: erc721ABI,
    functionName: 'name',
  });

  const { data: NFTInfo } = useSWR(
    tokenURI as string | null,
    (tokenURI: string) => {
      return fetch(`/api/queryJson?url=${tokenURI}`).then(res => res.json());
    }
  );

  // 暂时返回
  return useMemo(() => {
    return {
      id: tokenId,
      seriesName,
      ...(NFTInfo ?? {}),
      animation_url:
        process.env.NODE_ENV === 'production'
          ? NFTInfo?.animation_url
          : address === CONTRACTS.PlayerAddress
          ? `${NFTBaseUrl}player/${tokenId}`
          : `${NFTBaseUrl}dealer/${tokenId}`,
    };
  }, [NFTInfo, address, seriesName, tokenId]);
};
