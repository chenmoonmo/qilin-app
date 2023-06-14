import { css } from '@emotion/react';
import { Button, useToast } from '@qilin/component';
import Image from 'next/image';
import { useMemo } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';
import { useNFTList } from '@/hooks';
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
  const { isConnected } = useAccount();
  const { showWalletToast, closeWalletToast } = useToast();
  const { data, mutate: refetch } = useNFTList();

  const dealerId = useMemo(() => data?.dealer?.id, [data?.dealer]);

  // // 玩家拥有的 dealer ID
  // const { data: dealerId, refetch } = useContractRead({
  //   address: CONTRACTS.DealerAddress,
  //   abi: Dealer.abi,
  //   functionName: 'dealerToId',
  //   args: [address],
  // });

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'mint',
    // TODO: 请求默克尔根 和 获得最新的可mint id
    args: [1, []],
    enabled: !dealerId,
  });
  const { writeAsync } = useContractWrite(config);

  const mint = async () => {
    // TODO: Not on the whitelist
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const res = await writeAsync?.();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Pending',
        type: 'loading',
      });
      await res?.wait();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
      refetch();
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
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
              disabled={!isConnected || !!dealerId}
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
