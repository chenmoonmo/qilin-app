import { css } from '@emotion/react';
import { Button } from '@qilin/component';
import { formatAmount, formatInput } from '@qilin/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useBalance } from 'wagmi';

import { ArrowIcon, LeverageRadio } from '@/components';
import { usePoolInfo, useSubmitPositon } from '@/hooks';
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
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const PositionInfo: FC<
  Pick<ReturnType<typeof usePoolInfo>, 'poolInfo' | 'myPosition'>
> = ({ poolInfo, myPosition }) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <NotOpen />
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
            {myPosition?.type === 1 && (
              <Link href={`/player/${id}/close`}>
                <Button
                  css={css`
                    width: 128px;
                    height: 38px;
                  `}
                >
                  Close
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
  Pick<ReturnType<typeof usePoolInfo>, 'poolInfo' | 'mergePositions'>
> = ({ poolInfo, mergePositions }) => {
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
              disabled={!enableSubmit || isSubmited}
              onClick={submitPosition}
            >
              Long
            </SubmitButton>
            <SubmitButton
              backgroundColor="#F45E68"
              disabled={!enableSubmit || isSubmited}
              onClick={submitPosition}
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
  const { poolInfo, myPosition, mergePositions } = usePoolInfo(+id);

  console.log({ id, poolInfo, mergePositions, myPosition });
  return (
    <>
      <Header shortId={poolInfo?.shortId} />
      <XsCard>
        <XsCardContent>
          <div />
          <div>
            <ExternalInfo>Trading Room ID : {poolInfo?.shortId}</ExternalInfo>
            <XsCardStatus>
              <span>Create a room</span>
              <ArrowIcon />
            </XsCardStatus>
          </div>
        </XsCardContent>
      </XsCard>
      <MdCard>
        {status === 'wait' ? (
          <OpenPostition poolInfo={poolInfo} mergePositions={mergePositions} />
        ) : (
          <PositionInfo poolInfo={poolInfo} myPosition={myPosition} />
        )}
      </MdCard>
    </>
  );
};

Player.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Player;
