import HomeLayout from '@/layouts/home-layout';
import { NextPageWithLayout } from './_app';
import Image from 'next/image';

import Dealer from '@/constant/abis/Dealer.json';

import {
  Main,
  MintContainer,
  MintInfo,
  MintInfoBottom,
  NFTCard,
} from '@/styles/mint';
import { Button } from '@qilin/component';
import { css } from '@emotion/react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { CONTRACTS } from '@/constant';

import { BigNumber } from 'ethers';

const Index: NextPageWithLayout = () => {
  const { address } = useAccount();

  // 玩家拥有的 dealer ID
  const { data: dealerId, refetch } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToId',
    args: [address],
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'mint',
    // TODO: 请求默克尔根 和 获得最新的可mint id
    args: [1, []],
    enabled: (dealerId as BigNumber)?.eq(0),
  });

  const { writeAsync } = useContractWrite(config);

  const mint = async () => {
    const res = await writeAsync?.();
    await res?.wait();
    refetch();
  };

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
              disabled={(dealerId as BigNumber)?.gt(0)}
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
