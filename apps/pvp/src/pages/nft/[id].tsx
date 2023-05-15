import { css } from '@emotion/react';
import { Button } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import type { FC, HtmlHTMLAttributes } from 'react';

import { DefaultAvatar } from '@/components';
import {
  EndTime,
  MainCard,
  NFTMain,
  PairInfo,
  PairMiniCard,
  Positioninfo,
  Profit,
  RoomCard,
  RoomHeader,
  RoomID,
  RoomSeats,
  RoomSeatsMap,
  SytledSeatItem,
  UserName,
  FormContainer,
  PositionNote,
  StakePrice,
  OpponentContainer,
  OpponentItem,
  PostionRate,
} from '@/styles/nft';

type SeatItemProps = {
  userName: string;
  position: number;
  onClick: () => void;
} & HtmlHTMLAttributes<HTMLDivElement>;

const SeatItem: FC<SeatItemProps> = ({
  userName,
  position,
  onClick,
  ...props
}) => {
  return (
    <SytledSeatItem onClick={onClick} {...props}>
      {userName ? (
        <>
          <DefaultAvatar />
          <UserName>{userName}</UserName>
          <Positioninfo>
            <div>{position}</div>
            <div>1.9</div>
          </Positioninfo>
        </>
      ) : (
        <PlusIcon />
      )}
    </SytledSeatItem>
  );
};

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  // const { id } = params;

  return (
    <NFTMain>
      {/* mini nft card */}
      <PairMiniCard>
        <PairInfo>
          <div>BTC / USDC</div>
          <div>Chainlink</div>
        </PairInfo>
        <Profit data-type="long">long</Profit>
        <MainCard>+ 20.4%</MainCard>
        <RoomID>Room ID：12345</RoomID>
        <EndTime>2023-05-02 18:21:00 UTC</EndTime>
      </PairMiniCard>
      <RoomCard>
        {/* 座位 */}
        <RoomSeats>
          <RoomHeader>
            <div>
              BTC / USDC<span>123.46 USDC</span>
              <EndTime>2023-05-02 18:21:00 UTC</EndTime>
            </div>
            <Button
              css={css`
                font-weight: 400;
                align-self: flex-start;
              `}
            >
              Whitelist
            </Button>
          </RoomHeader>
          <RoomSeatsMap>
            <div>Total margin:1000 USDC</div>
            <div>Room ID :61223</div>
            <SeatItem
              data-id="1"
              data-position="short"
              userName="111"
              position={2000}
            ></SeatItem>
            <SeatItem data-id="2"></SeatItem>
            <SeatItem data-id="3"></SeatItem>
            <SeatItem data-id="4"></SeatItem>
            <SeatItem data-id="5"></SeatItem>
            <SeatItem data-id="6"></SeatItem>
          </RoomSeatsMap>
          <div
            css={css`
              display: flex;
              width: 100%;
              margin-top: 110px;
              justify-content: center;
            `}
          >
            <Button
              css={css`
                box-sizing: border-box;
                width: 150px;
                height: 40px;
                justify-content: center;
              `}
            >
              Opening
            </Button>
          </div>
        </RoomSeats>
        {/* 开仓表单 */}
        <FormContainer>
          <StakePrice>Stake Price:48.000000 USDC</StakePrice>
          <OpponentContainer>
            <OpponentItem>
              <div>690 LP</div>
              <div>690 USDC</div>
              <PostionRate></PostionRate>
            </OpponentItem>
            <OpponentItem>
              <div>690 LP</div>
              <div>690 USDC</div>
              <PostionRate></PostionRate>
            </OpponentItem>
          </OpponentContainer>
          <PositionNote>
            After confirmation, host opens game with same opening price.
            <br />
            Note：Once confirming, you cannot make any changes.
          </PositionNote>
        </FormContainer>
        {/* ranking */}
        <div></div>
      </RoomCard>
    </NFTMain>
  );
};

export default Detail;
