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
import { formatAmount, formatInput } from '@qilin/utils';

type SeatItemProps = {
  userName: string;
  position: number;
  onClick: () => void;
} & HtmlHTMLAttributes<HTMLDivElement>;

const SeatItem = forwardRef<SeatItemProps, any>(
  ({ userName, position, pnl, onClick, ...props }, ref) => {
    return (
      <SytledSeatItem onClick={onClick} {...props} ref={ref}>
        {userName ? (
          <>
            <DefaultAvatar />
            <UserName>{userName}</UserName>
            <Positioninfo>
              <div>{formatAmount(position)}</div>
              <div>{formatAmount(pnl)}</div>
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
  const {
    createDealerId,
    poolAddress,
    poolInfo,
    positions,
    mergePositions,
    isSubmited,
    stakePrice,
    status,
    myROE,
  } = usePoolInfo(id);

  // 是否是房主
  const isOwner = dealerId && createDealerId?.eq(dealerId);

  // 房主是否开盘
  const isOpend = +(poolInfo?.deadline ?? 0) > 0;

  const canBeOpen = isOwner && !isOpend;

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

  return (
    <NFTMain>
      {/* mini nft card */}
      {/* TODO: 小卡片状态显示 */}
      <PairMiniCard>
        <PairInfo data-owner={isOwner}>
          <div>{poolInfo?.trade_pair}</div>
          <div>Chainlink</div>
        </PairInfo>
        <MainCard data-type={myROE > 0 ? 'long' : 'short'}>
          <div>
            {status === 'wait' ? 'To Be Open' : `${formatAmount(myROE, 2)}%`}
          </div>
          {status === 'end' && <div>Ended</div>}
        </MainCard>
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
                  <span>{formatAmount(poolInfo?.token_price)} USDC</span>
                  {isOpend && <EndTime>2023-05-02 18:21:00 UTC</EndTime>}
                </div>
                <Dialog.Trigger asChild>
                  <Button
                    disabled={
                      !enableAdd || (!isOwner && !isOpend) || isSubmited
                    }
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
                <div>
                  Total margin: {formatAmount(poolInfo?.fomattedMargin)}
                  {marginTokenInfo?.symbol}
                </div>
                <div>Room ID: {poolInfo?.id}</div>
                {new Array(6).fill(0).map((_, index) => {
                  const position = positions?.[index];
                  const userName = position?.user.slice(-4) ?? '';
                  return (
                    <Dialog.Trigger
                      key={index}
                      disabled={!!userName || isSubmited}
                    >
                      <SeatItem
                        key={index}
                        data-id={index + 1}
                        data-position={position?.direction}
                        userName={`${userName}${position?.isMe ? '(I)' : ''}`}
                        position={position?.formattedLp}
                        pnl={position?.estPnl}
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
            long={+mergePositions?.long?.formattedLp}
            short={+mergePositions?.short?.formattedLp}
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
              {formatAmount(marginTokenInfo?.formatted)}{' '}
              {marginTokenInfo?.symbol}
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
                  marginAmount: formatInput(marginAmount),
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
            value={stakeAmount ? formatAmount(stakeAmount) : stakeAmount}
            symbol="Stake"
          />
          <EstimateResults>
            <div>
              <Tooltip text="Current Stake Price" icon={<FQASvg />}>
                <span>Stake price</span>
              </Tooltip>
              <span>
                {formatAmount(lpPrice)} {marginTokenInfo?.symbol}
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
                {formatAmount(value)} {marginTokenInfo?.symbol}
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
                {/*TODO: 单位 */}
                <th>Open price({marginTokenInfo?.symbol})</th>
                <th>Value({marginTokenInfo?.symbol})</th>
                <th>Est.PNL({marginTokenInfo?.symbol})</th>
              </tr>
            </thead>
            <tbody>
              {positions?.map((position, index) => {
                const direction = position.level > 0 ? 'Long' : 'Short';
                const shortAddress =
                  position.user.slice(0, 6) + '...' + position.user.slice(-4);
                return (
                  <tr key={index}>
                    {/* Ranking */}
                    <td>{position?.index}</td>
                    {/* Address */}
                    <td>{`${shortAddress} ${position.isMe ? '(I)' : ''}`}</td>
                    {/* Margin */}
                    <td>{formatAmount(position.fomattedMargin)}</td>
                    {/* Direction */}
                    <td>{direction}</td>
                    {/* Open price */}
                    <td>{formatAmount(position.open_price)}</td>
                    {/* Value */}
                    <td>{formatAmount(position.currentValue)}</td>
                    {/* Est.PNL */}
                    <td>
                      {formatAmount(position.estPnl)}(
                      {formatAmount(position.ROE, 2)}%)
                      {position.isMe && (
                        <ClosePostionDialog
                          position={position}
                          poolAddress={poolAddress}
                        >
                          <Dialog.Trigger asChild>
                            <Button
                              css={css`
                                margin-left: 11px;
                              `}
                            >
                              Close
                            </Button>
                          </Dialog.Trigger>
                        </ClosePostionDialog>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </RankingTable>
      </RoomCard>
    </NFTMain>
  );
};

export default Detail;