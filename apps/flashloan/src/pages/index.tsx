import { css } from '@emotion/react';
import { Button } from '@qilin/component';
import Image from 'next/image';

import { useNFT } from '@/hooks';
import HomeLayout from '@/layouts/home-layout';
import {
  Main,
  MintContainer,
  MintInfo,
  MintInfoBottom,
  NFTCard,
} from '@/styles/mint';

import type { NextPageWithLayout } from './_app';

const Index: NextPageWithLayout = () => {
  const { hasNFT, mint } = useNFT();

  return (
    <Main>
      <MintContainer>
        <NFTCard>
          <Image src="/nft-card.png" width={292} height={292} alt="NFT" />
        </NFTCard>
        <MintInfo>
          <h1>Mint NFT - Limited Time</h1>
          <MintInfoBottom>
            <Button
              css={css`
                width: 332px;
                height: 40px;
              `}
              disabled={hasNFT}
              onClick={mint}
            >
              Mint NFT
            </Button>
          </MintInfoBottom>
        </MintInfo>
      </MintContainer>
    </Main>
  );
};

Index.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Index;
