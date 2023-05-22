import { css } from '@emotion/react';
import { Button, Dialog, Tooltip } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import type { HtmlHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Address, useAccount, useBalance } from 'wagmi';

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
import { usePoolInfo } from '@/hooks/usePoolInfo';
import { useDealerId, useAddPlayers, useSubmitPositon } from '@/hooks';

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
  const router = useRouter();
  // player nft id
  const id = +(router.query.id as string);

  const { address } = useAccount();

  const { enableAdd } = useAddPlayers({ id });

  //用户的 dearlerId
  const { dealerId } = useDealerId();

  const { createDealerId, poolAddress, poolInfo } = usePoolInfo(id);

  // 是否是房主
  const isOwner = createDealerId?.eq(dealerId);

  // 房主是否开盘
  const isOpend = +(poolInfo?.deadline ?? 0) > 0;

  const canBeOpen = isOwner && !isOpend;

  // stakePrice 未开盘前为 1
  const stakePrice = isOpend ? +(poolInfo?.token_price ?? 0) : 1;

  // // 获取 stake price
  // const { data } = useContractRead({
  //   address: poolAddress as Address,
  //   abi: Pool.abi,
  //   functionName: 'getPrice',
  //   enabled: !!poolAddress,
  // });
  // console.log('getPrice', data);

  const { data: token0Info } = useBalance({
    address,
    token: poolInfo?.token0 as Address,
    enabled: !!poolInfo?.token0,
  });

  const { data: token1Info } = useBalance({
    address,
    token: poolInfo?.token1 as Address,
    enabled: !!poolInfo?.token1,
  });

  const { data: marginTokenInfo } = useBalance({
    address,
    token: poolInfo?.pay_token as Address,
    enabled: !!poolInfo?.pay_token,
  });

  const { stakeAmount, enableSubmit, form, setForm } = useSubmitPositon({
    stakePrice,
    marginTokenInfo,
  });

  const handleMaxMargin = () => {
    setForm({
      ...form,
      marginAmount: marginTokenInfo?.formatted ?? '0',
    });
  };

  console.log({
    enableSubmit,
    poolInfo,
    token0Info,
    token1Info,
  });

  return (
    <NFTMain>
      {/* mini nft card */}
      {/* TODO: 小卡片状态显示 */}
      <PairMiniCard>
        <PairInfo data-owner={isOwner}>
          <div>{poolInfo?.trade_pair}</div>
          <div>Chainlink</div>
        </PairInfo>
        <Profit data-type="long">long</Profit>
        <MainCard>+ 20.4%</MainCard>
        <RoomID>Room {poolInfo?.id}</RoomID>
        <EndTime>2023-05-02 18:21:00 UTC</EndTime>
      </PairMiniCard>
      <RoomCard>
        {/* 座位 */}
        <RoomSeats>
          <WhilteListDialog type="add" roomId={id}>
            <>
              <RoomHeader>
                <div>
                  {poolInfo?.trade_pair}
                  <span>123.46 USDC</span>
                  <EndTime>2023-05-02 18:21:00 UTC</EndTime>
                </div>
                <Dialog.Trigger asChild>
                  <Button
                    disabled={!enableAdd}
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
                <div>Room ID :{poolInfo?.id}</div>
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
                disabled={!canBeOpen}
              >
                Opening
              </Button>
            </OpenRoomDialog>
          </div>
        </RoomSeats>
        {/* 开仓表单 */}
        <FormContainer>
          {/* 图标 */}
          <OpponentInfo
            stakePrice={stakePrice}
            marginTokenSymbol={marginTokenInfo?.symbol}
          />
          <FormLabel
            css={css`
              margin-top: 10px;
            `}
          >
            Leverage
          </FormLabel>
          <LeverageRadio
            value={form.leverage}
            onChange={leverage =>
              setForm(preForm => {
                return {
                  ...preForm,
                  leverage,
                };
              })
            }
          />
          <FormLabel
            css={css`
              margin-top: 23px;
            `}
          >
            Balance
            <span>
              {marginTokenInfo?.formatted} {marginTokenInfo?.symbol}
            </span>
          </FormLabel>
          <TokenAmountInput
            maxShow
            value={form.marginAmount}
            symbol={token0Info?.symbol}
            onMaxClick={handleMaxMargin}
            onChange={(marginAmount: string) => {
              setForm(preForm => {
                return {
                  ...preForm,
                  marginAmount,
                };
              });
            }}
          />
          <TokenAmountInput
            css={css`
              margin-top: 10px;
            `}
            value={stakeAmount}
            disabled
            symbol="Stake"
          />
          <EstimateResults>
            <div>
              <Tooltip text="1111111" icon={<FQASvg />}>
                <span>LP price</span>
              </Tooltip>
              <span>- {marginTokenInfo?.symbol}</span>
            </div>
            <div>
              <Tooltip text="1111111" icon={<FQASvg />}>
                <span>Value</span>
              </Tooltip>
              <span>- {marginTokenInfo?.symbol}</span>
            </div>
          </EstimateResults>
          <OpenPositionDialog>
            <SubmitContainer>
              <Dialog.Trigger asChild disabled={!enableSubmit}>
                <SubmitButton backgroundColor="#44C27F">Long</SubmitButton>
              </Dialog.Trigger>
              <Dialog.Trigger asChild disabled={!enableSubmit}>
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
