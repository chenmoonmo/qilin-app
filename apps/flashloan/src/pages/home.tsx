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
            <p>
              If you want to use this feature, please make sure that you have:
            </p>
            <ol>
              <li>
                Minted an NFT at{' '}
                <a href="http://unkownnft.xyz/.">http://unkownnft.xyz/</a>.
              </li>
              <li>
                Deposited WETH or ETH on AAVE&apos;s Arbitrum network(
                <a href="https://app.aave.com/">https://app.aave.com/</a>) and
                borrowed USDC.
                <ul>
                  <li>
                    USDC address: 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
                  </li>
                  <li>
                    WETH address: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
                  </li>
                </ul>
              </li>
              <li>
                After completing the above steps, you can then proceed to
                execute &quot;reclaim collateral without repayment&quot;
                operation on the NFT interface located on the left side of this
                page.
              </li>
            </ol>
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
