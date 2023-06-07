import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '@/layouts/nft-layout';
import {
  NotOpen,
  Pair,
  PNLInfo,
  PNLInfoContainer,
  PositionDirection,
  PositionInfoContainer,
  PositionSize,
  PriceInfo,
  PriceItem,
  RoomInfo,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const PositionInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <NotOpen />
      <PositionInfoContainer>
        <RoomInfo>
          <Pair>BTC/USDC</Pair>
          <PositionDirection data-type="long">long</PositionDirection>
          <PositionSize leverage={20}>132.24</PositionSize>
        </RoomInfo>
        <PNLInfoContainer>
          <PNLInfo>Not joined</PNLInfo>
          <Link href={`/player/${id}/positions`}>
            <svg
              width="12"
              height="18"
              viewBox="0 0 12 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.68384 18L1.3248e-07 16.4846L8.57714 8.89434L0.0116801 1.53676L1.67041 -9.03042e-07L12 8.87089L1.68384 18Z"
                fill="white"
              />
            </svg>
          </Link>
        </PNLInfoContainer>
        <PriceInfo>
          <PriceItem>
            <div>Open price</div>
            <div>-</div>
          </PriceItem>
          <PriceItem>
            <div>Current price</div>
            <div>-</div>
          </PriceItem>
        </PriceInfo>
      </PositionInfoContainer>
    </>
  );
};

const Player: NextPageWithLayout = () => {
  return (
    <>
      <PositionInfo />
    </>
  );
};

Player.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Player;
