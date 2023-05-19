import HomeLayout from '@/layouts/home-layout';
import { NextPageWithLayout } from './_app';

import Dealer from '@/constant/abis/Dealer.json';

import {
  Main,
  MintContainer,
  MintInfo,
  MintInfoBottom,
  NFTCard,
} from '@/styles/referrals';
import { Button } from '@qilin/component';
import { css } from '@emotion/react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { CONTRACTS } from '@/constant';

const Index: NextPageWithLayout = () => {
  
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'mint',
    // TODO: 请求默克尔根 和 获得最新的可mint id
    args: [1, []],
  });

  const { write, status } = useContractWrite(config);

  console.log(status);

  return (
    <Main>
      <MintContainer>
        <NFTCard></NFTCard>
        <MintInfo>
          <h1>Mint NFT - Limited Time</h1>
          <MintInfoBottom>
            <Button
              css={css`
                width: 332px;
                height: 40px;
              `}
              onClick={write}
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
