import { css } from '@emotion/react';
import { Button, Tooltip } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
// import { useRouter } from 'next/router';
import type { FC, HtmlHTMLAttributes } from 'react';

// import { useAccount } from 'wagmi';
import { DefaultAvatar, FQASvg, TokenAmountInput } from '@/components';
import { LeverageRadio } from '@/components';
import {
  EndTime,
  EstimateResults,
  FormContainer,
  FormLabel,
  MainCard,
  NFTMain,
  OpponentContainer,
  OpponentItem,
  PairInfo,
  PairMiniCard,
  Positioninfo,
  PositionNote,
  PostionRate,
  Profit,
  RankingTable,
  RoomCard,
  RoomHeader,
  RoomID,
  RoomSeats,
  RoomSeatsMap,
  StakePrice,
  SubmitButton,
  SubmitContainer,
  SytledSeatItem,
  UserName,
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
  // const { address, isConnecting, isDisconnected } = useAccount();

  // const router = useRouter();
  // const id = router.query.id;
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
              <PostionRate>
                <div>69%</div>
                <div>Long</div>
              </PostionRate>
            </OpponentItem>
            <OpponentItem>
              <div>690 LP</div>
              <div>690 USDC</div>
              <PostionRate>
                <div>31%</div>
                <div>Short</div>
              </PostionRate>
            </OpponentItem>
          </OpponentContainer>
          <FormLabel
            css={css`
              margin-top: 10px;
            `}
          >
            Leverage
          </FormLabel>
          <LeverageRadio />
          <FormLabel
            css={css`
              margin-top: 23px;
            `}
          >
            Balance
            <span>0 USDC</span>
          </FormLabel>
          <TokenAmountInput maxShow symbol="ETH" />
          <TokenAmountInput
            css={css`
              margin-top: 10px;
            `}
            symbol="USDC"
          />
          <EstimateResults>
            <div>
              <Tooltip text="1111111" icon={<FQASvg />}>
                <span>LP price</span>
              </Tooltip>
              <span>- USDC</span>
            </div>
            <div>
              <Tooltip text="1111111" icon={<FQASvg />}>
                <span>Value</span>
              </Tooltip>
              <span>- USDC</span>
            </div>
          </EstimateResults>
          <SubmitContainer>
            <SubmitButton backgroundColor="#44C27F">Long</SubmitButton>
            <SubmitButton backgroundColor="#E15C48">Short</SubmitButton>
          </SubmitContainer>
          <PositionNote>
            After confirmation, host opens game with same opening price.
            <br />
            Note：Once confirming, you cannot make any changes.
          </PositionNote>
        </FormContainer>
        {/* ranking */}
        <RankingTable>
          <h1>Ranking</h1>
          {/* 抽离 tbale 组件 */}
          <table>
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Address</th>
                <th>Margin(USDC)</th>
                <th>Direction</th>
                <th>Open price(USDC)</th>
                <th>Value(USDC)</th>
                <th>Est.PNL(USDC)</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </RankingTable>
        
      </RoomCard>
    </NFTMain>
  );
};

export default Detail;
