import { isAddress } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import type { Address } from 'wagmi';

import { useNFTInfo } from '@/hooks';
import HomeLayout from '@/layouts/home-layout';
import { InfoCard, Main, MediaContainer } from '@/styles/assets';

import type { NextPageWithLayout } from '../_app';

const NFTDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const [cotractAddress, tokenId] = (router.query.nft ?? []) as [
    Address,
    number
  ];

  const { animation_url } = useNFTInfo(cotractAddress, tokenId);

  if (!isAddress(cotractAddress) || !tokenId) {
    return null;
  }

  return (
    <Main>
      <MediaContainer>
        <iframe src={animation_url} />
      </MediaContainer>
      <h1>Trading Room #1123</h1>
      <InfoCard>
        <h1>Description</h1>
        <p>
          By utilizing flash loans, the current NFT can reclaim collateral
          without repayment. The process involves borrowing assets from Uni
          through a flash loan, repaying them to Aave, and withdrawing deposits
          from Aave. Some of the deposits will be sold on Uni to repay the flash
          loan.
        </p>
      </InfoCard>
      <InfoCard>
        <h1>Details</h1>
        <div>
          <div>Contract Address</div>
          <div>0xak...1o9d</div>
        </div>
        <div>
          <div>Token ID</div>
          <div>23</div>
        </div>
        <div>
          <div>Token Standard</div>
          <div>ERC-721</div>
        </div>
        <div>
          <div>Chain</div>
          <div>Arbitrum Goerli</div>
        </div>
      </InfoCard>
    </Main>
  );
};

NFTDetail.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default NFTDetail;
