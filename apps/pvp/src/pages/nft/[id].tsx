import { css } from '@emotion/react';
import { Button, Dialog, Tooltip } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
// import { useRouter } from 'next/router';
import type { HtmlHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { useContractWrite } from 'wagmi';

// import { useAccount } from 'wagmi';
import {
  ClosePostionDialog,
  DefaultAvatar,
  FQASvg,
  OpenPositionDialog,
  OpenRoomDialog,
  OpponentInfo,
  TokenAmountInput,
  WhilteListDialog,
} from '@/components';
import { LeverageRadio } from '@/components';
import { CONTRACTS } from '@/constant';
import RouterABI from '@/constant/abis/Router.json';
import {
  EndTime,
  EstimateResults,
  FormContainer,
  FormLabel,
  MainCard,
  NFTMain,
  PairInfo,
  PairMiniCard,
  Positioninfo,
  PositionNote,
  Profit,
  RankingTable,
  RoomCard,
  RoomHeader,
  RoomID,
  RoomSeats,
  RoomSeatsMap,
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

const SeatItem = forwardRef<SeatItemProps, any>(
  ({ userName, position, onClick, ...props }, ref) => {
    return (
      <SytledSeatItem onClick={onClick} {...props} ref={ref}>
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
  }
);

SeatItem.displayName = 'SeatItem';

const Detail = () => {
  // const { address, isConnecting, isDisconnected } = useAccount();

  // const router = useRouter();
  // const id = router.query.id;
  // const { id } = params;

  const { write: writeOpen } = useContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: RouterABI.abi,
    functionName: 'open',
    mode: 'recklesslyUnprepared',
  });

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
          <WhilteListDialog type="add">
            <>
              <RoomHeader>
                <div>
                  BTC / USDC<span>123.46 USDC</span>
                  <EndTime>2023-05-02 18:21:00 UTC</EndTime>
                </div>
                <Dialog.Trigger asChild>
                  <Button
                    css={css`
                      font-weight: 400;
                      align-self: flex-start;
                    `}
                  >
                    Whitelist
                  </Button>
                </Dialog.Trigger>
              </RoomHeader>
              <RoomSeatsMap>
                <div>Total margin:1000 USDC</div>
                <div>Room ID :61223</div>
                <Dialog.Trigger asChild>
                  <SeatItem
                    data-id="1"
                    data-position="short"
                    userName="111"
                    position={2000}
                  />
                </Dialog.Trigger>
                <Dialog.Trigger asChild>
                  <SeatItem data-id="2" />
                </Dialog.Trigger>

                <SeatItem data-id="3" />
                <SeatItem data-id="4" />
                <SeatItem data-id="5" />
                <SeatItem data-id="6" />
              </RoomSeatsMap>
            </>
          </WhilteListDialog>

          <div
            css={css`
              display: flex;
              width: 100%;
              margin-top: 110px;
              justify-content: center;
            `}
          >
            <OpenRoomDialog>
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
            </OpenRoomDialog>
          </div>
        </RoomSeats>
        {/* 开仓表单 */}
        <FormContainer>
          <OpponentInfo />
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
          <OpenPositionDialog>
            <SubmitContainer>
              <Dialog.Trigger asChild>
                <SubmitButton backgroundColor="#44C27F">Long</SubmitButton>
              </Dialog.Trigger>
              <Dialog.Trigger asChild>
                <SubmitButton backgroundColor="#E15C48">Short</SubmitButton>
              </Dialog.Trigger>
            </SubmitContainer>
          </OpenPositionDialog>

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
        {/* TODO: 绑定 trigger */}
        <ClosePostionDialog />
      </RoomCard>
    </NFTMain>
  );
};

export default Detail;
