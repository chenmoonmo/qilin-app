import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { BackIcon } from '@/components';
import { useAddPlayers, usePoolInfo } from '@/hooks';
import Layout, { Header } from '@/layouts/nft-layout';
import {
  BackLink,
  MintButton,
  MintButtonContainer,
  PositionInfoItem,
  WhiteItem,
  WhiteItemContainer,
  WhiteTip,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const WhiteList: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);

  const { poolInfo, players, refetch } = usePoolInfo(+id);

  const { playerSeats, setSeats, seatsAddressValid, addPlayers } =
    useAddPlayers(+id, 6 - players?.length);

  const handleAddPlayer = useCallback(async () => {
    await addPlayers();
    refetch();
  }, [addPlayers, refetch]);

  return (
    <>
      <Header shortId={poolInfo?.shortId} />
      <BackLink href={previousPath}>
        <BackIcon />
      </BackLink>
      <PositionInfoItem>
        <div>Pricing Source：</div>
        <div>Chainlink</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Pair：</div>
        <div>{poolInfo?.trade_pair}</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Margin：</div>
        <div>{poolInfo?.pay_token_symbol}</div>
      </PositionInfoItem>
      <PositionInfoItem>
        <div>Number Of Seats： </div>
        <div>6</div>
      </PositionInfoItem>
      <PositionInfoItem
        css={css`
          margin-top: 20px;
          align-items: flex-start;
          > div:first-of-type {
            margin-top: 16px;
          }
        `}
      >
        <div>Whitelist：</div>
        <WhiteItemContainer>
          {players?.map(address => {
            return <WhiteItem key={address} value={address} disabled />;
          })}
          {playerSeats.map((address, index) => {
            return (
              <WhiteItem
                key={index}
                value={address}
                onChange={e => {
                  setSeats(pre => {
                    return [
                      ...pre.slice(0, index),
                      e.target.value,
                      ...pre.slice(index + 1),
                    ];
                  });
                }}
              />
            );
          })}
          <WhiteTip>Only whitelist can join</WhiteTip>
        </WhiteItemContainer>
      </PositionInfoItem>
      <MintButtonContainer>
        <MintButton disabled={!seatsAddressValid} onClick={handleAddPlayer}>
          Mint NFT
        </MintButton>
      </MintButtonContainer>
    </>
  );
};

WhiteList.getLayout = (page: any) => {
  return <Layout type="player">{page}</Layout>;
};

export default WhiteList;
