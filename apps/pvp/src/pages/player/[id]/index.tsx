import { css } from '@emotion/react';
import { Button } from '@qilin/component';
import { formatAmount, formatInput } from '@qilin/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Address } from 'wagmi';
import { useAccount, useBalance } from 'wagmi';

import { ArrowIcon, LeverageRadio, TimeInput } from '@/components';
import { useClosePostion, usePoolInfo, useSubmitPositon } from '@/hooks';
import { useNow } from '@/hooks/useNow';
import Layout, {
  ExternalInfo,
  Header,
  MdCard,
  XsCard,
  XsCardContent,
  XsCardStatus,
} from '@/layouts/nft-layout';
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
  TimerTitle,
  XsPNLInfo,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const PositionInfo: FC<
  Pick<ReturnType<typeof usePoolInfo>, 'poolInfo' | 'myPosition'> & {
    duration: number;
  }
> = ({ poolInfo, myPosition, duration }) => {
  const router = useRouter();
  const { id } = router.query;

  const { isNeedLiquidate } = useClosePostion({
    position: myPosition?.index,
    poolAddress: poolInfo?.poolAddress,
  });

  const ButtonText = useMemo(() => {
    return isNeedLiquidate ? 'Liquidate' : 'Close';
  }, [isNeedLiquidate]);

  return (
    <>
      {poolInfo?.isOpend ? (
        <>
          <TimerTitle>Trading Ends in</TimerTitle>
          <TimeInput value={duration} disabled />
        </>
      ) : (
        <NotOpen />
      )}
      <PositionInfoContainer>
        <RoomInfo>
          <Pair>{poolInfo?.trade_pair}</Pair>
          <PositionDirection data-type={myPosition?.direction}>
            {myPosition?.direction}
          </PositionDirection>
          <PositionSize leverage={myPosition?.level}>
            {myPosition?.fomattedMargin} {myPosition?.marginSymbol}
          </PositionSize>
        </RoomInfo>
        <PNLInfoContainer>
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <PNLInfo>{formatAmount(myPosition?.estPnl) ?? '-'}</PNLInfo>
            {poolInfo.isEnd && myPosition?.type === 1 && (
              <Link href={`/player/${id}/close`}>
                <Button
                  css={css`
                    width: 128px;
                    height: 38px;
                  `}
                >
                  {ButtonText}
                </Button>
              </Link>
            )}
          </div>
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
            <div>{formatAmount(poolInfo.openPrice) ?? '-'}</div>
          </PriceItem>
          <PriceItem>
            <div>Current price</div>
            <div>{formatAmount(poolInfo?.token_price)}</div>
          </PriceItem>
        </PriceInfo>
      </PositionInfoContainer>
    </>
  );
};

const OpenPostition: FC<
  Pick<
    ReturnType<typeof usePoolInfo>,
    'poolInfo' | 'mergePositions' | 'refetch'
  >
> = ({ poolInfo, refetch, mergePositions }) => {
  const { address } = useAccount();

  const { data: marginTokenInfo } = useBalance({
    address,
    token: poolInfo?.pay_token as Address,
    enabled: !!poolInfo?.pay_token,
  });

  const {
    form,
    // stakeAmount,
    // lpPrice,
    // value,
    setForm,
    enableSubmit,
    submitPosition,
  } = useSubmitPositon({
    poolAddress: poolInfo.poolAddress,
    stakePrice: poolInfo.stakePrice,
    marginTokenInfo,
    marginTokenAddress: poolInfo?.pay_token as Address,
  });

  const handleSubmit = useCallback(
    async (direction: 'long' | 'short') => {
      await submitPosition(direction);
      refetch();
    },
    [submitPosition, refetch]
  );

  return (
    <>
      <PairInfo>
        <div>{poolInfo?.trade_pair}</div>
        <div>
          {formatAmount(poolInfo?.token_price)} {poolInfo?.token1Symbol}
        </div>
      </PairInfo>
      <PositionPercent
        longSize={mergePositions?.long?.asset ?? 0}
        shortSize={mergePositions?.short?.asset ?? 0}
      />
      <OpenPositionOuter>
        <OpenPositionForm>
          <OpenPositionFormItem>
            <div>Leverage</div>
            <LeverageRadio
              value={form.leverage}
              leverages={poolInfo?.level ?? []}
              onChange={leverage =>
                setForm(preForm => {
                  return {
                    ...preForm,
                    leverage,
                  };
                })
              }
            />
          </OpenPositionFormItem>
          <OpenPositionFormItem>
            <div>Margin</div>
            <MarginInputContainer>
              <input
                type="text"
                value={form.marginAmount}
                onChange={e =>
                  setForm(preForm => {
                    return {
                      ...preForm,
                      marginAmount: formatInput(e.target.value),
                    };
                  })
                }
              />
              <div>
                <div>{poolInfo?.pay_token_symbol}</div>
                <div>Balance: {formatAmount(marginTokenInfo?.formatted)}</div>
              </div>
            </MarginInputContainer>
          </OpenPositionFormItem>
          <FormButtonContainer>
            <SubmitButton
              backgroundColor="#4BD787"
              disabled={!enableSubmit || poolInfo?.isSubmited}
              onClick={() => handleSubmit('long')}
            >
              Long
            </SubmitButton>
            <SubmitButton
              backgroundColor="#F45E68"
              disabled={!enableSubmit || poolInfo?.isSubmited}
              onClick={() => handleSubmit('short')}
            >
              Short
            </SubmitButton>
          </FormButtonContainer>
        </OpenPositionForm>
      </OpenPositionOuter>
    </>
  );
};

const Player: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { poolInfo, myPosition, mergePositions, refetch } = usePoolInfo(+id);

  const now = useNow();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [duration, setDuration] = useState(0);

  const cardStatus = useMemo(() => {
    const { isEnd, isOpend, isSubmited } = poolInfo;
    let statusMessage = 'Open Position';
    let showArrow = true;

    if (!isSubmited) {
      statusMessage = 'Open Position';
      showArrow = true;
    }
    if (isSubmited && !isOpend) {
      statusMessage = 'Not Open';
      showArrow = false;
    }
    if (isOpend && !isEnd && !myPosition) {
      statusMessage = 'Not Joined';
      showArrow = false;
    }
    if (isOpend && !isEnd && myPosition) {
      statusMessage = 'Close Position';
      showArrow = true;
    }
    return (
      <>
        <XsPNLInfo>{myPosition?.estPnl}</XsPNLInfo>
        <XsCardStatus>
          <span>{statusMessage}</span>
          {showArrow && <ArrowIcon />}
        </XsCardStatus>
      </>
    );
  }, [poolInfo, myPosition]);

  // 倒计时
  const countdown = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDuration(pre => {
        const newValue = pre - 60;
        console.log({
          pre,
          newValue,
        });
        if (newValue <= 0) {
          clearTimeout(timerRef.current!);
          return 0;
        }
        countdown();
        return newValue;
      });
    }, 60000);
  }, []);

  useEffect(() => {
    if (poolInfo.isOpend && !poolInfo.isEnd) {
      setDuration(+poolInfo.deadline! - +now / 1000);
      countdown();
    } else if (poolInfo.isEnd) {
      setDuration(0);
    }
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [poolInfo, now, countdown]);

  console.log({ id, poolInfo, mergePositions, myPosition });
  return (
    <>
      <Header shortId={poolInfo?.shortId} isOwner={poolInfo.isOwner} />
      <XsCard>
        <XsCardContent>
          <div
            css={css`
              margin-top: 20px;
            `}
          >
            {poolInfo?.isOpend && <TimeInput disabled value={duration} />}
          </div>
          <div>
            <ExternalInfo>{poolInfo?.trade_pair}</ExternalInfo>
            {cardStatus}
          </div>
        </XsCardContent>
      </XsCard>
      <MdCard>
        {poolInfo.status === 'wait' ? (
          <OpenPostition
            poolInfo={poolInfo}
            mergePositions={mergePositions}
            refetch={refetch}
          />
        ) : (
          <PositionInfo
            poolInfo={poolInfo}
            myPosition={myPosition}
            duration={duration}
          />
        )}
      </MdCard>
    </>
  );
};

Player.getLayout = (page: any) => {
  return <Layout type="player">{page}</Layout>;
};

export default Player;
