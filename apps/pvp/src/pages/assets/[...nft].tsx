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

  const shortAddress =
    cotractAddress.slice(0, 6) + '...' + cotractAddress.slice(-4);

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
          We&apos;ve turned the &quot;Friend Betting Game&quot; into NFTs, where
          only specific NFT holders can participate. There are two types of
          NFTs:
        </p>
        <ol>
          <li>
            Room Card NFT: Used to create trading rooms and mint trading room
            NFTs for friends & the owner of the room card NFT.
          </li>
          <li>
            Trading Room NFT: Held by users (participants) who can perform
            opening and closing operations within the trading room.
          </li>
        </ol>
        <p>The process is as follows:</p>
        <ol>
          <li>
            Room Card NFT holders create a trading room by specifying the
            trading pair, collateral currency, and the wallet addresses of their
            friends (whitelisted users). The system automatically mints trading
            room NFTs for all participants.
          </li>
          <li>
            Trading Room NFT holders enter the trading room and perform opening
            position operations.
          </li>
          <li>
            The room owner sets a countdown timer for the betting game. The
            opening and closing prices for participants are based on the prices
            at the start and end of the countdown.
          </li>
          <li>
            After the countdown ends, participants use the Trading Room NFT to
            perform closing operation and receive profits or incur losses.
          </li>
        </ol>
      </InfoCard>
      <InfoCard>
        <h1>Details</h1>
        <div>
          <div>Contract Address</div>
          <div>{shortAddress}</div>
        </div>
        <div>
          <div>Token ID</div>
          <div>{tokenId}</div>
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
