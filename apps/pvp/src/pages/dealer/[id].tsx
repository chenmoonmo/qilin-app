import { css } from '@emotion/react';
import { Button, Select, SelectToken } from '@qilin/component';
import { isAddress } from 'ethers/lib/utils.js';
import { atom, useAtom } from 'jotai';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount, useChainId, useToken } from 'wagmi';

import { ArrowIcon, TimeInput } from '@/components';
import { PAIRS, PAY_TOKENS } from '@/constant';
import { useCreateRoom, useDealerPoolInfo, useOpenPosition } from '@/hooks';
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
  FormContainer,
  FromItem,
  InfoContainer,
  InfoItem,
  SeatItem,
  TraddingEndTitle,
  WhielistContainer,
  WhielistItem,
} from '@/styles/dealer';

import type { NextPageWithLayout } from '../_app';

export const lastMarginSelectionAtom = atom<{
  symbol: string;
  address: string;
} | null>(null);

const Dealer: NextPageWithLayout = () => {
  const router = useRouter();
  const id = +(router.query.id as string);
  const chainId = useChainId();

  const { address } = useAccount();
  const shortAddress = useMemo(() => {
    return address ? address?.slice(0, 6) + '...' + address?.slice(-4) : '';
  }, [address]);

  const now = useNow();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { poolInfo, refetch: refetchPoolInfo } = useDealerPoolInfo(id);

  const {
    canCreateRoom,
    canClose,
    canOpen,
    canSendCreate,
    form,
    setForm,
    createRoom,
    players,
    setPlayers,
    refetch,
  } = useCreateRoom();

  const handleCreateRoom = useCallback(async () => {
    await createRoom();
    setTimeout(() => {
      refetchPoolInfo();
      refetch();
    }, 3000);
  }, [createRoom, refetch, refetchPoolInfo]);

  const [searchInfo, setSearchInfo] = useState<string>('');
  const [marginSearchInfo, setMarginSearchInfo] = useState<string>('');

  const [duration, setDuration] = useState(0);

  const openPosition = useOpenPosition({
    poolAddress: poolInfo.poolAddress,
    duration,
  });

  const handleOpenPosition = useCallback(async () => {
    await openPosition();
    refetchPoolInfo();
    refetch();
  }, [openPosition, refetch, refetchPoolInfo]);

  const [lastMarginSelection, setLastMarginSelection] = useAtom(
    lastMarginSelectionAtom
  );

  const { data, isSuccess } = useToken({
    address: marginSearchInfo as `0x${string}`,
    enabled: isAddress(marginSearchInfo),
  });

  const payTokens = useMemo(() => {
    return uniqBy(
      PAY_TOKENS?.[chainId as keyof typeof PAY_TOKENS]
        .concat(
          data && isSuccess
            ? [{ symbol: data.symbol, address: marginSearchInfo }]
            : []
        )
        .concat(lastMarginSelection ? [lastMarginSelection] : []),
      'address'
    );
  }, [chainId, data, isSuccess, lastMarginSelection, marginSearchInfo]);

  const pairFilter = useCallback(
    (item: any) => {
      if (!searchInfo) return true;
      return (
        item.name.includes(searchInfo.toUpperCase()) ||
        (isAddress(searchInfo) && item.oracleAddress.includes(searchInfo))
      );
    },
    [searchInfo]
  );

  const marginFilter = useCallback(
    (item: any) => {
      if (!marginSearchInfo) return true;
      return (
        item.symbol.includes(marginSearchInfo.toUpperCase()) ||
        (isAddress(marginSearchInfo) && item.address.includes(marginSearchInfo))
      );
    },
    [marginSearchInfo]
  );

  const cardStatus = useMemo(() => {
    if (canCreateRoom) {
      return (
        <div>
          <XsCardStatus>
            <span>Create a room</span>
            <ArrowIcon />
          </XsCardStatus>
        </div>
      );
    }
    if (canOpen) {
      return (
        <div>
          <ExternalInfo>Trading Room ID : {poolInfo?.shortId}</ExternalInfo>
          <XsCardStatus>
            <span>To Open</span>
            <ArrowIcon />
          </XsCardStatus>
        </div>
      );
    }
    if (canClose) {
      return (
        <div>
          <XsCardStatus>Trading Room ID : {poolInfo?.shortId}</XsCardStatus>
        </div>
      );
    }
  }, [poolInfo, canCreateRoom, canOpen, canClose]);

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
  }, [countdown, now, poolInfo]);

  console.log({ poolInfo, shortAddress, canCreateRoom });
  return (
    <>
      <Header title="Room Card" />
      <XsCard>
        <XsCardContent>
          <div
            css={css`
              margin-top: 20px;
            `}
          >
            {poolInfo.isOpend && !canCreateRoom && (
              <TimeInput disabled value={duration} />
            )}
          </div>
          {cardStatus}
        </XsCardContent>
      </XsCard>
      {/* 可以创建房卡时 */}
      <MdCard>
        {canCreateRoom ? (
          <FormContainer>
            <FromItem>
              <label>Pricing Source</label>
              <Select
                disabled
                selections={[{ text: 'Chainlink', value: '1' }]}
                value="Chainlink"
                onChange={() => {}}
                css={css`
                  box-sizing: border-box;
                  width: 340px;
                  margin-left: 31px;
                `}
              />
            </FromItem>
            <FromItem>
              <label>Select Pair *</label>
              <SelectToken
                css={css`
                  box-sizing: border-box;
                  width: 340px;
                  margin-left: 31px;
                `}
                selections={PAIRS?.[chainId as keyof typeof PAIRS]}
                valueKey="oracleAddress"
                textKey="name"
                value={form.oracle}
                onChange={selection =>
                  setForm(preForm => ({
                    ...preForm,
                    oracle: selection.oracleAddress,
                    targetToken: selection.tokenAddress,
                  }))
                }
                search={searchInfo}
                onSearchChange={setSearchInfo}
                filter={pairFilter}
              />
            </FromItem>
            <FromItem>
              <label>Margin *</label>
              <SelectToken
                css={css`
                  box-sizing: border-box;
                  width: 340px;
                  margin-left: 31px;
                `}
                valueKey="address"
                textKey="symbol"
                selections={payTokens}
                filter={marginFilter}
                value={form.payToken}
                onChange={selection => {
                  setLastMarginSelection(selection);
                  setForm(preForm => ({
                    ...preForm,
                    payToken: selection.address,
                  }));
                }}
                search={marginSearchInfo}
                onSearchChange={setMarginSearchInfo}
              />
            </FromItem>
            <FromItem>
              <label>Number Of Seats</label>
              <SeatItem value={6} disabled></SeatItem>
            </FromItem>
            <FromItem>
              <label>Whitelist</label>
              <WhielistContainer>
                {players.map((player, index) => (
                  <WhielistItem key={index}>
                    <input
                      type="text"
                      value={player}
                      onChange={e =>
                        setPlayers(prePlayers => {
                          prePlayers[index] = e.target.value;
                          return [...prePlayers];
                        })
                      }
                    />
                  </WhielistItem>
                ))}
              </WhielistContainer>
            </FromItem>
            <Button
              css={css`
                box-sizing: border-box;
                display: flex;
                width: 100%;
                height: 40px;
                margin: 10px auto 0;
              `}
              disabled={!canSendCreate}
              onClick={handleCreateRoom}
            >
              Create Room & Mint NFT
            </Button>
          </FormContainer>
        ) : (
          <>
            {/* 已创建房间 可以开盘时 */}
            <InfoContainer>
              <h1>Trading Room info</h1>
              <InfoItem>
                <div>Pricing Source：</div>
                <div>Chainlink</div>
              </InfoItem>
              <InfoItem>
                <div>Pair：</div>
                <div>{poolInfo?.trade_pair}</div>
              </InfoItem>
              <InfoItem>
                <div>Margin：</div>
                <div>{poolInfo?.pay_token_symbol}</div>
              </InfoItem>
              <InfoItem>
                <div>Room ID：</div>
                <div>{poolInfo?.shortId}</div>
              </InfoItem>
            </InfoContainer>
            <TraddingEndTitle>
              {poolInfo?.isOpend ? 'Enter Countdown' : 'Trading Ends In'}
            </TraddingEndTitle>
            <TimeInput
              value={duration}
              disabled={poolInfo?.isOpend}
              onChange={setDuration}
            />
            {!poolInfo?.isOpend && (
              <Button
                css={css`
                  box-sizing: border-box;
                  display: flex;
                  width: 100%;
                  height: 40px;
                  margin: 42px auto 0;
                `}
                disabled={duration <= 0}
                onClick={handleOpenPosition}
              >
                Open
              </Button>
            )}
          </>
        )}
      </MdCard>
    </>
  );
};

Dealer.getLayout = (page: any) => {
  return <Layout type="dealer">{page}</Layout>;
};

export default Dealer;
