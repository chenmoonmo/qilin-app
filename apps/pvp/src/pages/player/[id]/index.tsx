import Link from 'next/link';
import { useRouter } from 'next/router';

import { LeverageRadio } from '@/components';
import Layout from '@/layouts/nft-layout';
import {
  FormButtonContainer,
  MarginInputContainer,
  NotOpen,
  OpenPositionForm,
  OpenPositionFormItem,
  OpenPositionOuter,
  Pair,
  PairInfo,
  PNLInfo,
  PNLInfoContainer,
  PositionDirection,
  PositionInfoContainer,
  PositionPercent,
  PositionSize,
  PriceInfo,
  PriceItem,
  RoomInfo,
  SubmitButton,
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

const OpenPostition = () => {
  return (
    <>
      <PairInfo>
        <div>BTC / USDC</div>
        <div>26876.24 USD</div>
      </PairInfo>
      <PositionPercent longSize={60} shortSize={40} />
      <OpenPositionOuter>
        <OpenPositionForm>
          <OpenPositionFormItem>
            <div>Leverage</div>
            <LeverageRadio></LeverageRadio>
          </OpenPositionFormItem>
          <OpenPositionFormItem>
            <div>Margin</div>
            <MarginInputContainer>
              <input type="text" />
              <div>
                <div>USDC</div>
                <div>Balance: 0.0001441</div>
              </div>
            </MarginInputContainer>
          </OpenPositionFormItem>
          <FormButtonContainer>
            <SubmitButton backgroundColor="#4BD787">Long</SubmitButton>
            <SubmitButton backgroundColor="#F45E68">Short</SubmitButton>
          </FormButtonContainer>
        </OpenPositionForm>
      </OpenPositionOuter>
    </>
  );
};

const Player: NextPageWithLayout = () => {
  return (
    <>
      {/* <PositionInfo /> */}
      <OpenPostition />
    </>
  );
};

Player.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Player;
