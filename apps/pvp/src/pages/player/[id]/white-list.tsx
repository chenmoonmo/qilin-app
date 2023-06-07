import { css } from '@emotion/react';
import { useRouter } from 'next/router';

import { BackIcon } from '@/components';
import Layout from '@/layouts/nft-layout';
import {
  BackLink,
  MintButton,
  PositionInfoItem,
  WhiteItem,
  WhiteItemContainer,
  WhiteTip,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const WhiteList: NextPageWithLayout = () => {
  const router = useRouter();
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);
  return (
    <>
      <BackLink href={previousPath}>
        <BackIcon />
      </BackLink>
      <PositionInfoItem>
        <div>Pricing Source：</div>
        <div>Chainlink</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Pair：</div>
        <div>BTC/USD</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Margin：：</div>
        <div>DAI</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Number Of Seats： </div>
        <div>6</div>
      </PositionInfoItem>
      <PositionInfoItem
        css={css`
          margin-top: 20px;
          align-items: flex-start;
          > div:first-of-type {
            margin-top: 16px;
          }
        `}
      >
        <div>Whitelist：</div>
        <WhiteItemContainer>
          <WhiteItem />
          <WhiteItem />
          <WhiteItem />
          <WhiteItem />
          <WhiteItem />
          <WhiteTip>Only whitelist can join</WhiteTip>
        </WhiteItemContainer>
      </PositionInfoItem>
      <MintButton>Mint NFT</MintButton>
    </>
  );
};

WhiteList.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default WhiteList;
