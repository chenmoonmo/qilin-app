import styled from '@emotion/styled';
import type { FC } from 'react';
import type { Address } from 'wagmi';

import { useNFTInfo } from '@/hooks';

type NFTCardPropsType = {
  address: Address;
  tokenId: number;
  onClick?: () => void;
};

const NFTContainer = styled.div`
  margin: 5px 6px;
  cursor: pointer;
`;

const NFTMedia = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 244px;
  height: 244px;
  border: 1px solid rgba(54, 58, 69, 0.2);
  outline: 5px solid #2e71ff;
  border-radius: 6px;
  iframe {
    all: unset;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

const NFTInfo = styled.div`
  box-sizing: border-box;
  width: 244px;
  padding: 12px 10px;
  outline: 5px solid #2e71ff;
  border-radius: 6px;
  background: #fff;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  color: #121212;
  margin-top: 5px;
  > div:first-of-type {
    margin-bottom: 7px;
    font-weight: 600;
    font-size: 10px;
    line-height: 12px;
  }
`;

export const NFTCard: FC<NFTCardPropsType> = ({
  address,
  tokenId,
  onClick,
}) => {
  // TODO 根据合约和 URI 获取 NFT 信息

  const { animation_url } = useNFTInfo(address, tokenId);

  return (
    <NFTContainer onClick={onClick}>
      <NFTMedia>
        <iframe src={animation_url} />
      </NFTMedia>
      <NFTInfo>
        <div>Trading Room </div>
        <div>Trading Room #{tokenId}</div>
      </NFTInfo>
    </NFTContainer>
  );
};
