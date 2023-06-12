import HomeLayout from '@/layouts/home-layout';
import {
  Card,
  DetailItem,
  HomeTitle,
  InfoLayout,
  Main,
  NFTCard,
  NFTInfo,
} from '@/styles/home';

import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const NFTDetail = [
    {
      key: 'Contract Address',
      value: '0xak...1o9d',
    },
    {
      key: 'Token ID',
      value: '123',
    },
    {
      key: 'Token Standard',
      value: 'ERC-721',
    },
    {
      key: 'Chain',
      value: 'Arbitrum Goerli',
    },
  ];

  return (
    <Main>
      <HomeTitle>Your NFTs</HomeTitle>
      <InfoLayout>
        <NFTCard src="/nft/1" />
        <NFTInfo>
          <HomeTitle>Reclaim collateral #1123</HomeTitle>
          <Card>
            <h1>Description</h1>
            <p>
              By utilizing flash loans, the current NFT can reclaim collateral
              without repayment. The process involves borrowing assets from Uni
              through a flash loan, repaying them to Aave, and withdrawing
              deposits from Aave. Some of the deposits will be sold on Uni to
              repay the flash loan.
            </p>
          </Card>
          <Card>
            <h1>Details</h1>
            {NFTDetail.map((item, index) => (
              <DetailItem key={index}>
                <div>{item.key}</div>
                <div>{item.value}</div>
              </DetailItem>
            ))}
          </Card>
        </NFTInfo>
      </InfoLayout>
    </Main>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
