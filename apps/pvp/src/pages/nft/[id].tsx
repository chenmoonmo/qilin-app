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
import {
  useDealerId,
  useAddPlayers,
  useSubmitPositon,
  useWaitPositions,
} from '@/hooks';
import { ethers, utils } from 'ethers';

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
              {/*TODO: est pnl */}
              {/* <div>1.9</div> */}
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

  // 获取池子信息
  const { createDealerId, poolAddress, poolInfo, positions } = usePoolInfo(id);

  // 已经 submit 的 仓位
  const { waitPositions, mergePosition, isSubmited } = useWaitPositions({
    poolAddress,
    id,
    marginTokenDecimal: poolInfo?.pay_token_decimal,
  });

  console.log({ waitPositions, mergePosition });

  // 是否是房主
  const isOwner = dealerId && createDealerId?.eq(dealerId);

  // 房主是否开盘
  const isOpend = +(poolInfo?.deadline ?? 0) > 0;

  const canBeOpen = isOwner && !isOpend;

  // stakePrice 未开盘前为 1
  const stakePrice = poolInfo?.lp_price;

  const { data: marginTokenInfo } = useBalance({
    address,
    token: poolInfo?.pay_token as Address,
    enabled: !!poolInfo?.pay_token,
  });

  const {
    submitPosition,
    form,
    setForm,
    stakeAmount,
    enableSubmit,
    lpPrice,
    value,
  } = useSubmitPositon({
    poolAddress,
    stakePrice,
    marginTokenInfo,
    marginTokenAddress: poolInfo?.pay_token as Address,
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
        {/* <Profit data-type="long">long</Profit> */}
        {/* <MainCard>+ 20.4%</MainCard> */}
        <MainCard>To Be Open</MainCard>
        <RoomID>Room {poolInfo?.id?.slice(-4)}</RoomID>
        {isOpend && <EndTime>2023-05-02 18:21:00 UTC</EndTime>}
      </PairMiniCard>
      <RoomCard>
        {/* 座位 */}
        <RoomSeats>
          <WhilteListDialog type="add" roomId={id}>
            <>
              <RoomHeader>
                <div>
                  {poolInfo?.trade_pair}
                  <span>{poolInfo?.token_price} USDC</span>
                  {isOpend && <EndTime>2023-05-02 18:21:00 UTC</EndTime>}
                </div>
                <Dialog.Trigger asChild>
                  <Button
                    disabled={!enableAdd || (!isOwner && !isOpend)}
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
                <div>Total margin: 100 {marginTokenInfo?.symbol}</div>
                <div>Room ID: {poolInfo?.id}</div>
                {new Array(6).fill(0).map((_, index) => {
                  const position = waitPositions?.[index];
                  const userName = position?.user.slice(-4) ?? '';
                  return (
                    <Dialog.Trigger key={index} disabled={userName}>
                      <SeatItem
                        key={index}
                        data-id={index + 1}
                        data-position={
                          position?.leverage
                            ? position?.leverage > 0
                              ? 'long'
                              : 'short'
                            : null
                        }
                        userName={`${userName}${position?.isMe ? '(I)' : ''}`}
                        position={
                          position?.marginAmount &&
                          +position?.marginAmount * Math.abs(position?.leverage)
                        }
                      />
                    </Dialog.Trigger>
                  );
                })}
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
            <OpenRoomDialog poolAddress={poolAddress}>
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
          {/* 图表 */}
          <OpponentInfo
            long={mergePosition?.long}
            short={mergePosition?.short}
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
            placeholder="Margin"
            value={form.marginAmount}
            symbol={marginTokenInfo?.symbol}
            onMaxClick={handleMaxMargin}
            onChange={(marginAmount: string) => {
              // TODO: 格式化输入
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
            disabled
            placeholder="Stake Amount"
            value={stakeAmount}
            symbol="Stake"
          />
          <EstimateResults>
            <div>
              <Tooltip text="Current Stake Price" icon={<FQASvg />}>
                <span>Stake price</span>
              </Tooltip>
              <span>
                {lpPrice} {marginTokenInfo?.symbol}
              </span>
            </div>
            <div>
              <Tooltip
                text={
                  <>
                    Value of current position. <br />
                    Value = Current LP Price * LP Amount
                  </>
                }
                icon={<FQASvg />}
              >
                <span>Value</span>
              </Tooltip>
              <span>
                {value} {marginTokenInfo?.symbol}
              </span>
            </div>
          </EstimateResults>
          <OpenPositionDialog
            poolInfo={poolInfo}
            form={form}
            lpPrice={lpPrice}
            value={value}
            onConfirm={submitPosition}
          >
            <SubmitContainer>
              <Dialog.Trigger asChild disabled={!enableSubmit || isSubmited}>
                <SubmitButton
                  backgroundColor="#44C27F"
                  onClick={() => {
                    setForm(preForm => {
                      return {
                        ...preForm,
                        direction: 'long',
                      };
                    });
                  }}
                >
                  Long
                </SubmitButton>
              </Dialog.Trigger>
              <Dialog.Trigger asChild disabled={!enableSubmit || isSubmited}>
                <SubmitButton
                  backgroundColor="#E15C48"
                  onClick={() => {
                    setForm(preForm => {
                      return {
                        ...preForm,
                        direction: 'short',
                      };
                    });
                  }}
                >
                  Short
                </SubmitButton>
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
                <th>Margin({marginTokenInfo?.symbol})</th>
                <th>Direction</th>
                <th>Open price({marginTokenInfo?.symbol})</th>
                <th>Value({marginTokenInfo?.symbol})</th>
                <th>Est.PNL({marginTokenInfo?.symbol})</th>
              </tr>
            </thead>
            <tbody>
              {positions?.map((position, index) => {
                const margin = ethers.utils.formatUnits(
                  position.margin,
                  marginTokenInfo?.decimals
                );
                const direction = position.level > 0 ? 'long' : 'short';
                const value = +margin * Math.abs(position.level) * stakePrice;
                return (
                  <tr key={index}>
                    <td>{position.index}</td>
                    <td>{position.user}</td>
                    <td>{margin}</td>
                    <td>{direction}</td>
                    <td>{position.open_price}</td>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </RankingTable>
        {/* TODO: 绑定 trigger */}
        <ClosePostionDialog />
      </RoomCard>
    </NFTMain>
  );
};

export default Detail;
